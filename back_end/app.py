from enum import unique
import json
from flask_cors import CORS, cross_origin
from flask import Flask, jsonify, request
from flask_pymongo import ASCENDING, DESCENDING, PyMongo
from datetime import datetime
from bson import ObjectId
from flask_praetorian import Praetorian, auth_required, current_user
import gridfs
import time

#create the app
app = Flask(__name__)


# connecting to mongo running on the computer
if app.config["ENV"] == "production":
    app.config.from_object("config.ProductionConfig")
else:
    app.config.from_object("config.DevelopmentConfig")

CORS(app)
guard = Praetorian()
mongo = PyMongo(app)
fs = gridfs.GridFS(mongo.db)


#import User and Post dataclass from user.py and post.py files
from user import User
from post import Post
from likes import UserPostLikes
from rating import PostRating


guard.init_app(app, User)


# create collection if it doesn't already exists
collection = mongo.db.list_collection_names()
if "users" not in collection:
    mongo.db.create_collection("users")
    # create unique index
    mongo.db.users.create_index("username", unique = True) 
    mongo.db.users.create_index("email", unique = True)
if "post" not in collection:
    mongo.db.create_collection("post")
if "rating" not in collection:
    mongo.db.create_collection("rating")
    # create index unique combination
    mongo.db.rating.create_index([("userId", ASCENDING), ("postId", ASCENDING)], unique = True)
if "likes" not in collection:
    mongo.db.create_collection("likes")
    # create index unique combination
    mongo.db.likes.create_index([("userId", ASCENDING), ("postId", ASCENDING)], unique = True)


# returns all the user in the database along with information
#currently has no usage
@app.route("/users", methods=['GET'])
def get_users():
    return jsonify([User.deserialize(x).to_dict() for x in mongo.db.users.find()])

@app.route("/user", methods=['GET'])
@auth_required
def get_user():
    try:
        id = current_user()._id
        user = [User.deserialize(mongo.db.users.find_one({"_id": ObjectId(id)})).to_dict()]
        return jsonify(user)
    except:
        return jsonify({"": "There is no user with that user_id in the database"})


#Update endpoints

#change username
@app.route("/update_username", methods=['PUT'])
@auth_required
def update_username():
    try:
        data = request.json
        found = mongo.db.users.find_one({"username": data["username"]})
        if(found is not None):
            return jsonify({"message": "Username already taken."})
        if(guard.authenticate(current_user().username, data["password"])):
            mongo.db.post.update_many({"author": current_user().username},{"$set": {"author": data["username"]}})
            mongo.db.users.find_one_and_update({"_id": ObjectId(current_user()._id)}, {"$set": {"username": data["username"]}})
            return jsonify({"success": True})
    except:
        return jsonify({"message": "Invalid password."})

# change password
@app.route("/update_password", methods=['PUT'])
@auth_required
def update_password():
    try:
        data = request.json
        if(guard.authenticate(current_user().username, data["password"])):
            mongo.db.users.find_one_and_update({"_id": ObjectId(current_user()._id), "email": current_user().email}, {"$set": {"password": guard.hash_password(data["newPass"])}})
            return jsonify({"success": True})
    except:
        return jsonify({"message": "Please make sure your email or old password is correct."})

# delete user
@app.route('/delete_user', methods=["DELETE"])
@auth_required
def delete_user():
    try:
        username = current_user().username
        #guard._verify_password checks the password that the user inputs to the password in the database
        #and returns True or False depending on whether the password match or not.
        user_password = guard._verify_password(request.json["password"], current_user().password)
        _id = current_user()._id
        if user_password:
            mongo.db.likes.delete_many({"userId": _id})
            mongo.db.post.delete_many({"author": username})
            mongo.db.rating.delete_may({"userId": _id})
            User.deserialize(mongo.db.users.find_one_and_delete({"_id": ObjectId(_id)}))
            return jsonify({"success": True})
        return jsonify({"message":"Invalid Username or Password"})
    except:
        return jsonify({"message": "Invalid information"})

# Login a user
@app.route("/login", methods=['POST'])
def login():
    try:
        time.sleep(2)
        username = request.json["username"]
        username = username.lower()
        password = request.json["password"]
        user = guard.authenticate(username, password)
        token = guard.encode_jwt_token(user)
        return jsonify({"access_token": token, "username": username})
    except:
        return jsonify({"error": "Invalid username or password."})

# Register a user
@app.route("/register", methods=['POST'])
def register():
    try:
        email = request.json["email"].lower()
        username = request.json["username"]
        password = request.json["password"]
        hashed_password = guard.hash_password(password)

        mongo.db.users.insert_one({
            "firstname": request.json["firstname"],
            "lastname": request.json["lastname"],
            "phone": request.json["phone"],
            "email": email,
            "username": username,
            "password": hashed_password,
            "roles": "member"
            # "image": file
        })
        return jsonify({"success": "You have been registered"})
    except:
        return jsonify({"error": "The email or username you entered is already taken."})

# Currently has no usage
@app.route("/register/admin", methods=['POST'])
def register_admin():
    try:
        email = request.json["email"].lower()
        username = request.json["username"]
        password = request.json["password"]
        hashed_password = guard.hash_password(password)

        mongo.db.users.insert_one({
            "firstname": request.json["firstname"],
            "lastname": request.json["lastname"],
            "phone": request.json["phone"],
            "email": email,
            "username": username,
            "password": hashed_password,
            "roles": "admin"
            # "image": file
        })
    except:
        return jsonify("Please don't leave anything empty.")

# Upload a post to the database
@app.route("/post", methods=['POST'])
@auth_required
def post():
    author = current_user().username
    title = request.json["title"]
    content = request.json["content"]
    date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    mongo.db.post.insert_one({
        "author": author,
        "title": title,
        "content": content,
        "date_posted": date
    })
    Post.deserialize(mongo.db.post.find_one({"author": author}))
    return jsonify({"success": 'Posted'})

# edit post
@app.route('/edit_post', methods=['PUT'])
@auth_required
def edit_post():
    try:
        time.sleep(2)
        title = request.json["title"]
        content = request.json["content"]
        id = request.json["id"]
        mongo.db.post.update({"_id": ObjectId(id)}, {"$set": {"title": title, "content": content}})
        return jsonify({"success": True})
    except:
        return jsonify({"error": True})


# like and dislike a post
@app.route("/like", methods=["POST"])
@auth_required
def like():
    try:
        post_id = request.json["post_id"]
        mongo.db.likes.insert_one({
            "postId": post_id,
            "userId": current_user()._id
        })
        return jsonify({"liked": True})
    except: 
        post_id = request.json["post_id"]
        mongo.db.likes.remove({
            "postId": post_id,
            "userId": current_user()._id
        })
        return jsonify({"disliked": True})

# Check if the post is liked
@app.route("/liked/<postId>", methods=["GET"])
def liked(postId):
    likes = [x["total"] for x in mongo.db.likes.aggregate([{"$match": {"postId": postId}},{"$group" : {"_id": "$postId", "total": {"$sum": 1}}}])][0]
    token = guard.read_token_from_header()
    try:
        userId = guard.extract_jwt_token(token=token)
        if(mongo.db.likes.find_one({"userId": userId["id"], "postId": postId})):
            return jsonify({"liked": True, "likes": likes})
    except:
        return jsonify({"error": False, "likes": likes})
    return jsonify({"error": False, "likes": likes})

# Returns 10 the liked posts from the database at a time
@app.route("/liked_posts", methods=["GET"])
@auth_required
def liked_posts():
    userId = current_user()._id
    posts = []
    page = int(request.args['page'])
    limit = int(request.args['limit'])
    offset = page * 10
    liked = mongo.db.likes.find({"userId": userId}).sort('$natural', -1).limit(limit).skip(offset)
    posts = [Post.deserialize(mongo.db.post.find_one({"_id": ObjectId(x["postId"])})) for x in liked]
    if(posts):
        return jsonify({"posts": posts})
    return jsonify({"message": "You have liked no posts."})

    
# Get posts from the database
@app.route("/post", methods=['GET'])
def get_all_post():
    page = int(request.args['page'])
    limit = int(request.args['limit'])
    currCount = int(request.args['count'])
    plus = 0
    count = mongo.db.post.find().count()
    if(currCount > 0 and count - currCount != 0):
        plus = count - currCount
    offset = (page * 10) + plus
    posts = [Post.deserialize(x) for x in mongo.db.post.find().sort("date_posted", DESCENDING).limit(limit).skip(offset)]
    
    if(posts):
        return jsonify({"posts": posts, "count": count})
    return jsonify({"hasMore": False})

# For Profile
@app.route("/user_post", methods=['GET'])
@auth_required
def get_user_posts():
    author = current_user().username
    page = int(request.args['page'])
    limit = int(request.args['limit'])
    offset = page * 10
    post = [Post.deserialize(x) for x in mongo.db.post.find({"author" : author}).sort("date_posted", DESCENDING).limit(limit).skip(offset)]
    if post:
        return jsonify({"posts": post})
    return jsonify({"hasMore": False})


@app.route("/posts_id", methods=["GET"])
def get_post_id():  
    page = int(request.args['page'])
    limit = int(request.args['limit'])
    offset = (page * 10) 
    postsId = [Post.deserialize(x)._id for x in mongo.db.post.find().sort("date_posted", DESCENDING).limit(limit).skip(offset)]
    if(postsId):
        return jsonify({"posts_id": postsId})
    return jsonify({"hasMore": False})

@app.route("/posts/<post_id>", methods=["GET"])
def post_by_id(post_id):
    return jsonify({"post": Post.deserialize(mongo.db.post.find({"_id": ObjectId(post_id)}))})


# Delete Post
@app.route("/post/<post_id>", methods=['DELETE'])
@auth_required
def delete_post(post_id):
    mongo.db.post.remove({"_id": ObjectId(post_id)})
    mongo.db.likes.remove({"postId": post_id})
    return jsonify({"success": True})


#Check if post has been rated by user
@app.route("/post/rated/<post_id>", methods=["GET"])
def rated(post_id):
    total = [x for x in mongo.db.rating.aggregate([{"$match": {"postId": post_id}},{"$group" : {"_id": "$postId", "rating": {"$sum": "$rating"}, "count":{"$sum": 1}}}])]
    rating = 0
    totalCount = 0
    if total:
        for doc in total:
            rating = doc["rating"]
            totalCount = doc["count"]
    token = guard.read_token_from_header()
    if(rating != 0 and totalCount != 0):
        try:
            userId = guard.extract_jwt_token(token=token)
            if(mongo.db.rating.find_one({"userId": userId["id"], "postId": post_id})):
                return jsonify({"rated": True, "rating": round(rating/totalCount,1)})
        except:
            return jsonify({"error": False, "rating": round(rating/totalCount, 1)})
    return jsonify({"error": False, "rating": 0  })

# Rate a Post
@app.route("/post/rate", methods=["POST"])
@auth_required
def rate_post():
    post_id = request.json["post_id"]
    rating = request.json["rating"]
    try:
        mongo.db.rating.insert({"postId": post_id, "userId": current_user()._id,  "rating": rating})
        return jsonify({"rated": True})
    except:
        print("except")
        mongo.db.rating.update_one({"postId": post_id}, {"$set": {"rating": rating}})
        return jsonify({"changed": True})

#unrate a post
# @app.route("/post/change_rating", methods=["PUT"])
# @auth_required
# def change_rating():
#     post_id = request.json["post_id"]
#     rating = request.json["rating"]
#     # mongo.db.rating.update({"post_id": post_id}, {"$set": {"rating": rating}})
#     mongo.db.rating.update_one({"post_id": post_id}, {"$set": {"rating": rating}})
#     return jsonify({"succes": True})
#     # mongo.db.rating.find({"_id"})




# To make sure the user token is still valid
@app.route("/protected", methods=['GET'])
@auth_required
def protected():
    time.sleep(2000)
    return jsonify(True)


# Refresh token if possible
@app.route("/refresh-token", methods=['GET'])
@cross_origin(origin="*")
def refresh():
    try:
        old_token = guard.read_token_from_header()
        new_token = guard.refresh_jwt_token(old_token)
        return jsonify(new_token)
    except:
        return jsonify({"error": "Invaid Token"})

    

#Run the example
if __name__ == "__main__":
    app.run()