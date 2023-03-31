from backend.authenticate import *
# From Django
from django.conf import settings
from django.core import serializers
from django.db import DatabaseError
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, csrf_protect, requires_csrf_token
# from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.db.models import F

from django.contrib.postgres.search import TrigramSimilarity, TrigramDistance
from django.db.models import Q


from django.contrib.sessions.models import Session


# From rest_framework_simplejwt
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
# From rest_framework
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import authentication_classes



from users.models import User


import datetime

import json
from .serializer import UserSerializer

import environ
from aes import *

env = environ.Env()
environ.Env.read_env()

jwt = JWTAuthentication()
custom = CustomAuthentication()

# Create your views here.
@api_view(["GET"])
def get_csrf(request):
    csrf = get_token(request)
    return JsonResponse({'csrf': csrf})

@api_view(["GET"])
def users(request):
    users = UserSerializer(User.objects.all(), many=True)
    return JsonResponse({'users': list(users.data)}, safe=False)

@api_view(["GET"])
def user_by_id(request, user_id):
    try:
        user = UserSerializer(User.objects.filter(id=user_id), many=True)
        return JsonResponse({"success": True, "user": user.data}, safe=False)
    except:
        return JsonResponse({"error": True}, safe=False)


@api_view(["GET"])
def user_by_username(request, username, multiple = True):
    try:
        if multiple == True:
            users = User.objects.annotate(similarity=TrigramSimilarity('username', username)).filter(similarity__gte=0.2).order_by('-similarity')
            # users = User.objects.filter(username__icontains=username)
            # search_indexes = TrigramSimilarity('username', username) + TrigramSimilarity('bio', username) + TrigramSimilarity('first_name', username) + TrigramSimilarity('last_name', username)
            # users = User.objects.annotate(similarity=TrigramSimilarity('username', username)).filter(similary_gt=0).order_by('-similarity')
            users_data = UserSerializer(users, many=True).data
        else:
            user = User.objects.get(username=username)
            users_data = UserSerializer(user).data
        return JsonResponse({"success": True, "users": users_data})
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    except:
        return JsonResponse({"error": "An error occurred"}, status=500)




@api_view(["POST"])
def user_register(request):
    try:
        data = json.loads(request.body)
        if(data['first_name'] == '' or data['last_name'] == ''):
            raise ValueError('Please enter your name')
        if(data['username'] == ''):
            raise ValueError('Please enter your username')
        if(data['email'] == ''):
            raise ValueError('Please enter your email')
        if(data['password'] == ''):
            raise ValueError('Please enter your password')
        if(data['confirm_password'] == ''):
            raise ValueError('Please enter your confirm password')
        if(data['password'] != data['confirm_password']):
            raise ValueError('Password and confirm password must match')

        user = User.objects.create_user(
            first_name=data['first_name'],
            last_name=data['last_name'],
            username=data['username'], 
            password=data['password'], 
            email=data['email'])
        return JsonResponse({"success": True}, safe=False)
    except ValueError as e:
        return JsonResponse({"error": True, "message": str(e)}, safe=False)
    except DatabaseError:
        return JsonResponse({"error": True, "message":" Username or email is taken."}, safe=False)

@api_view(["POST"])
def user_login(request):
    data = json.loads(request.body)
    user = authenticate(username=data['username'], password=data['password'])

    if(user):
        login(request, user)
        token = RefreshToken.for_user(user)
        userSerialized = UserSerializer(user)
        request.session.set_test_cookie()
        jResponse = JsonResponse({"access_token": str(token.access_token), 
                            "at_lifetime": str(token.access_token.lifetime.days) + "d",
                            "refresh_token": str(token),
                            "rt_lifetime": str(token.lifetime.days) + "d",
                            "user": userSerialized.data
                            })
        response = HttpResponse(jResponse, content_type="application/json")
        # response.set_cookie("testing", "true", secure=True, httponly=True)
        response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE'], 
                    value = str(token.access_token),
                    expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )
        # response.set_cookie('access_token', str(token.access_token), expires=str(token.access_token.lifetime.days) + "d", secure=True, httponly=True)
        response.set_cookie('refresh_token', str(token), expires=str(token.lifetime.days)+ "d", secure=True, httponly=True)
        return response
    return JsonResponse({"error": True}, safe=False)


@api_view(["GET"])
def get_session(request):
    if "access_token" in request.COOKIES:
        print(request.COOKIES.get('access_token'))
    return JsonResponse({"success": True})

    
class UserFromCookie(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomAuthentication,]

    def get(self, request):
        try:
            user = UserSerializer(request.user).data
            return JsonResponse({"success": True, "user": user})
        except:
            return JsonResponse({"success": False, "message": "User not found."})
        # if 'user' in request.COOKIES:
        #     user = json.loads(request.COOKIES.get('user'))
        #     return JsonResponse({"success": True, "user": user})
        # else:
        #     return JsonResponse({"success": False})
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated,]
    authentication_classes = (CustomAuthentication,)

    def post(self, request):
        try:
            
            response = HttpResponse({"success": True}, content_type="application/json")
            logout(request)
            for cookies in request.COOKIES:
                if cookies != "theme":
                    response.delete_cookie(cookies)
            request.session.flush()
            return response
        except:
            return JsonResponse({"error": True}, safe=False)

    # def delete(self, request):
    #     session_id = request.COOKIES.get(settings.SESSION_COOKIE_NAME)
    #     session = Session.objects.get(session_key=session_id)
    #     session.delete()


class AllLogins(APIView):
    permission_classes = [IsAuthenticated,]
    authentication_classes = [CustomAuthentication,]

    def get(self, request):
        user = request.user
        userSerialized = UserSerializer(user)
        return JsonResponse({'success': True, 'user': userSerialized.data, 'sessions': list(Session.objects.all().values())})
        

class LogoutFromAll(APIView):
    permission_classes = [IsAuthenticated,]
    authentication_classes = [CustomAuthentication,]

    def delete(self, request):
        sessions = Session.objects.filter(expire_date__gte=datetime.timezone.now(), 
                                       session_key__contains=request.user_id)

        # Delete the sessions
        sessions.delete()


class SuperUser(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request):
        user = User.objects.get(id=request.user.id)
        if user.is_superuser:
            return JsonResponse({"message": True}, safe=False)
        return JsonResponse({"message": False}, safe=False)

    def post(self, request):
        try:
            user = User.objects.get(id=request.user.id)
            user.is_superuser = True
            user.save()
            return JsonResponse({"success": True}, safe=False)
        except:
            return JsonResponse({"error": True}, safe=False)

class Staff(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request):
        user = User.objects.get(id=request.user.id)
        if user.is_staff:
            return JsonResponse({"message": True}, safe=False)
        return JsonResponse({"message": False}, safe=False)

    def post(self, request):
        try:
            user = User.objects.get(id=request.user.id)
            user.is_staff = True
            user.save()
            return JsonResponse({"success": True}, safe=False)
        except:
            return JsonResponse({"error": True}, safe=False)


class SuperUser(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request):
        user = User.objects.get(id=request.user.id)
        if user.is_superuser:
            return JsonResponse({"message": True}, safe=False)
        return JsonResponse({"message": False}, safe=False)

    def post(self, request):
        try:
            user = User.objects.get(id=request.user.id)
            user.is_superuser = True
            user.save()
            return JsonResponse({"success": True}, safe=False)
        except:
            return JsonResponse({"error": True}, safe=False)

class Staff(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request):
        user = User.objects.get(id=request.user.id)
        if user.is_staff:
            return JsonResponse({"message": True}, safe=False)
        return JsonResponse({"message": False}, safe=False)

    def post(self, request):
        try:
            user = User.objects.get(id=request.user.id)
            user.is_staff = True
            user.save()
            return JsonResponse({"success": True}, safe=False)
        except:
            return JsonResponse({"error": True}, safe=False)

# Delete Endpoints
class Delete_User(APIView):
    permission_classes= [CustomAuthentication,]

    def delete(self, request):
        try:
            user = User.objects.get(id=request.user.id).delete()
            return JsonResponse({"success": True}, safe=False)
        except:
            return JsonResponse({"error": True}, safe=False)



@api_view(["DELETE"])
# @permission_classes([IsAdminUser,])
def delete_all(request):
    User.objects.all().delete()
    return JsonResponse({"success": True}, safe=False)