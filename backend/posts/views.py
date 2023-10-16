import re
from time import time
from django.db import DatabaseError
from django.forms import ValidationError
from django.http import JsonResponse
from django.utils.html import escape
from rest_framework.views import APIView
# From Django
from django.http import HttpResponse, JsonResponse
from django.db.models import Count
from following.models import UserFollowing
from django.db.models import Q
from django.contrib.auth.models import AnonymousUser
import time

from notifications.signals import notify
import asyncio


# From rest_framework
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes

from PIL import Image
from .models import Post
from .serializer import PostSerializer
from users.models import User
from backend.authenticate import *
from rest_framework import status

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
import json

from replace import *

channel_layer = get_channel_layer()
custom = CustomAuthentication()


def user_is_following(following_user, followed_user):
    try:
        UserFollowing.objects.get(following_user=following_user, followed_user=followed_user)
        return True
    except UserFollowing.DoesNotExist:
        return False


class Post_Content(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = (CustomAuthentication,)

    def post(self, request):
        try:
            try:
                image = request.FILES['image']
            except:
                image = None
            
            try:
                caption = request.POST['caption']
            except:
                caption = None
            
            user_list = []
            # The following two lines make sure the file uploaded is actually an image
            if(image):
                try:
                    check_image = Image.open(image)
                    check_image.verify()
                except:
                    return JsonResponse({"error": True, "message": "Invalid Image"}, status=400)
            if(caption):
                caption = escape(caption)
                regex = r'@(\w+)'
                caption = re.sub(regex, lambda val: replaceMention(val, user_list), caption)
                caption = replaceLink(caption)

            user = User.objects.get(pk=request.user.id)
            post = Post(
                user = user,
            )
            if(image):
                post.img_url = image
            if(caption):
                post.caption = caption
            post.save()
            link = "{}/spill/{}".format(user.username, str(post.id))
            print('6')

            
            
            if(post.user.username in user_list):
                user_list.remove(post.user.username)

            if(user_list): 
                text = 'Image' if (not post.caption) else post.caption
                notify.send(user, recipient=user_list, verb='mention', action_object=post, target=post, description="mentioned you on a spill", url=link, text=text)


            group_name = f'user_{post.user.username}'
            async_to_sync(channel_layer.group_send)(group_name, {
                "type": "user_update",
                "updateType": 'posted',
                "message": json.dumps(PostSerializer(post, context={'request': request}).data)
            })
            return JsonResponse({"success": True, "message": "Posted Successfully"}, safe=False)
        except ValidationError as e:
            print(e)
            return JsonResponse({"error": True, "message": e.message}, status=400)
        except Exception as e:
            print(str(e))
            return JsonResponse({"error": True}, safe=False)

    def delete(self, request):
        data = json.loads(request.body)
        try:
            post = Post.objects.get(id=data["id"])
            user = request.user
            if(post.user == user):
                print('here')
                post.delete()
            elif user.is_staff:
                print(post.user.is_admin, user.is_admin)
                if post.user.is_admin and not user.is_admin:
                    return JsonResponse({'error': True, 'message': 'You are not authorized to delete this post.'})
                post.delete()
                notify.send(sender=user, recipient=post.user, verb='deleted', description='Your post has been deleted by staff.')
                return JsonResponse({'error': False, 'message': 'Post deleted successfully and user notified.'})
            else:
                return JsonResponse({'error': True, "message": 'You are not authorized to delete this post.'})
            return JsonResponse({"success": True})
        except:
            return JsonResponse({"error": False, "message": 'Unable to delete Post. Please try again later!'})

@api_view(["GET"])
def view_posts(request, timestamp, page):
    offset = int(page) * 5
    try:
        post = Post.objects.filter(date_posted__lt=timestamp, user__private=False)[offset:offset+5]
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PostSerializer(post, context={'request': request}, many=True)
    return JsonResponse({"posts": serializer.data}, status=200)


@api_view(["GET"])
@authentication_classes([CustomAuthentication,])
@permission_classes([IsAuthenticated,])
def post_by_followed_users(request, timestamp, page):
    try:
        followed_list = request.user.following.values_list('followed_user_id', flat=True)
        offset = int(page) * 10
        posts = Post.objects.filter(user__in=followed_list).filter(date_posted__lt=timestamp)[offset:offset+10]
        if posts:
            posts = PostSerializer(posts, context={'request': request}, many=True)
            return JsonResponse({"success": True,"posts": posts.data}, safe=False)
        else:
            if offset == 0:
                return JsonResponse({"error": True, "message": "You are not following anyone"})
            return JsonResponse({"error": True,"message": "You have reached the end."})
    except Exception as e:
        return JsonResponse({"error": True, "message": str(e)})

@api_view(["GET"])
def explore(request, timestamp, page):
    offset = int(page) * 10
    try:
        user = request.user
        query = None
        # if user.is_anonymous:
        #     query = (Q(date_posted__lt=timestamp) & (Q(user__private=False)))
        # else:
        query = (Q(date_posted__lt=timestamp) & (Q(user__private=False)) | Q(user=user) | Q(user__followers__following_user_id=user.id))
        post = Post.objects.filter(query)[offset:offset+10]
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Error in Explore",str(e))
        return JsonResponse({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
    

    serializer = PostSerializer(post, context={'request': request}, many=True)
    return JsonResponse({"posts": serializer.data}, status=200)



@api_view(["GET"])
def user_posted(request, timestamp, page, username):
    offset = int(page) * 10
    try:
        user = User.objects.get(username=username)
        if(user.private and user != request.user):
            try:
                user.followers.filter(following_user=request.user).exists()
            except UserFollowing.DoesNotExist as e:
                return JsonResponse({"error": True, "message": "User is private. Please follow them to see their posts."})
        pass
    except User.DoesNotExist:
        return JsonResponse({"error": True, 'message':"User doesn't exist."})
    posts = PostSerializer(Post.objects.filter(user__username=username,date_posted__lt=timestamp)[offset:offset+10], context={'request': request}, many=True)
    return JsonResponse({"posts": list(posts.data)}, safe=False)



@api_view(["DELETE"])
def delete_all_posts(request):
    Post.objects.all().delete()
    return JsonResponse({"success": True}, safe=False)


@api_view(["GET"])
def total_user_posted(request, user_id):
    posts = Post.objects.filter(user_id=user_id).count()
    return JsonResponse({"posts": posts}, safe=False)


@api_view(["GET"])
def get_post_by_id(request, post_id):
    try:
        user = request.user
        spill = Post.objects.get(pk=post_id)
        if(spill.user.private and spill.user != user):
            try:
                spill.user.followers.get(following_user=user)
            except UserFollowing.DoesNotExist as e:
                return JsonResponse({"error": True, "message": "Post not found."}, status=404)
        return JsonResponse({"success": True,"spill": PostSerializer(spill, context={'request': request}).data}, status=200)
    except Post.DoesNotExist:
        return JsonResponse({"error": True, "message": "Post not found."})
    except DatabaseError as e:
        return JsonResponse({"error": True}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return JsonResponse({"error": True})


    
    