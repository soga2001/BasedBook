from fileinput import filename
from flask_cors import CORS, cross_origin
from flask import Flask, jsonify, request
from flask_pymongo import DESCENDING, PyMongo
from datetime import datetime
from bson import ObjectId
from flask_praetorian import Praetorian, auth_required, current_user
import gridfs

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


guard.init_app(app, User)


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

# Update user information
# Currently no usage
@app.route("/user", methods=['PUT'])
@auth_required
def update_user_by_id():
    try:
        user_id = current_user()._id
        data = request.json
        update_user = User.deserialize(mongo.db.users.find_one_and_update({"_id": ObjectId(user_id)}, {"$set": data}))
        return jsonify({"success": True})
    except:
        return jsonify({"error": True})


# Currently has no uses but removes a user information and all the post they have liked and posted
@app.route('/user', methods=["DELETE"])
@auth_required
@cross_origin(origin="*")
def delete_user():
    try:
        username = current_user().username
        #guard._verify_password checks the password that the user inputs to the password in the database
        #and returns True or False depending on whether the password match or not.
        user_password = guard._verify_password(request.json["password"], current_user().password)
        if user_password:
            remove_user = User.deserialize(mongo.db.users.find_one_and_delete({"_id": ObjectId(current_user()._id)}))
            mongo.db.post.delete_many({"author": username})
            return jsonify(remove_user.to_dict())
        return jsonify("Invalid Username or Password")
    except:
        return jsonify("Invalid information")

# Login a user
@app.route("/login", methods=['POST'])
@cross_origin(origin="*")
def login():
    try:
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
@cross_origin(origin="*")
def register():
    try:
        email = request.json["email"].lower()
        username = request.json["username"]
        password = request.json["password"]
        hashed_password = guard.hash_password(password)
        #check if the email and username is already in the database
        found_email = mongo.db.users.find_one({"email": email})
        found_username = mongo.db.users.find_one({"username": username})
        #if email or username is already in the database
        if found_email or found_username:
            return jsonify({"error": "The email or username you entered is already taken."})

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
        return jsonify("Please don't leave anything empty.")

# Currently has no usage
@app.route("/register/admin", methods=['POST'])
def register_admin():
    try:
        firstname = request.json["firstname"]
        lastname = request.json["lastname"]
        phone = request.json["phone"]
        email = request.json["email"]
        email = email.lower()
        username = request.json["username"]
        username = username.lower()
        password = request.json["password"]
        hashed_password = guard.hash_password(password)
        image = request.file["image"]
        #check if the email and username is already in the database
        found_email = mongo.db.users.find_one({"email": email})
        found_username = mongo.db.users.find_one({"username": username})
        #if found_email and found_username aren't empty and the database returned something
        #don't add the user into the database otherwise, add the user
        if found_email and found_username:
            return jsonify({"error": "The email and username you entered is already taken."})
        if found_email:
            return jsonify({"error":"The email you entered is already taken."})
        if found_username:
            return jsonify({"error": "The username you entered is already taken."})

        mongo.db.users.insert_one({
            "firstname": firstname,
            "lastname": lastname,
            "phone": phone,
            "email": email,
            "username": username,
            "password": hashed_password,
            "roles": "admin",
            "image": username + "image"
        })
        User.deserialize(mongo.db.users.find_one({"email": email})).to_dict()
        return jsonify({"success": "You have been registered"})
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

# Dislike a post
@app.route("/dislike", methods=["POST"])
@auth_required
def dislike():
    post_id = request.json["post_id"]
    mongo.db.likes.remove({
        "postId": post_id,
        "userId": current_user()._id
    })
    return jsonify("Disliked")

# Like a post
@app.route("/like", methods=["POST"])
@auth_required
def like():
    post_id = request.json["post_id"]
    mongo.db.likes.insert_one({
        "postId": post_id,
        "userId": current_user()._id
    })
    return jsonify("Liked")

# Check if the post is liked
@app.route("/liked/<postId>", methods=["GET"])
def liked(postId):
    likes = mongo.db.likes.aggregate([{"$match": {"postId": postId}},{"$group" : {"_id": "$postId", "total": {"$sum": 1}}}])
    postLikes = 0
    
    for doc in likes:
        postLikes = doc["total"]
    token = guard.read_token_from_header()
    
    try:
        userId = guard.extract_jwt_token(token=token)
        if(mongo.db.likes.find_one({"userId": userId["id"], "postId": postId})):
            return jsonify({"liked": True, "likes": postLikes})
    except:
        return jsonify({"error": False, "likes": postLikes})
    return jsonify({"error": False, "likes": postLikes})

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
    offset = page * 10
    posts = [Post.deserialize(x) for x in mongo.db.post.find().sort("date_posted", DESCENDING).limit(limit).skip(offset)]
    if(posts):
        return jsonify({"posts": posts})
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


# Delete Post
@app.route("/post/<post_id>", methods=['DELETE'])
@auth_required
def delete_post(post_id):
    mongo.db.post.remove({"_id": ObjectId(post_id)})
    mongo.db.likes.remove({"postId": post_id})
    return jsonify({"success": True})


# To make sure the user token is still valid
@app.route("/protected", methods=['POST'])
@auth_required
def protected():
    return jsonify(True)

# Refresh token if possible
@app.route("/refresh-token", methods=['POST'])
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