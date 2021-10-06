from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from flask import Flask, jsonify, request
from flask_pymongo import ASCENDING, DESCENDING, PyMongo
from datetime import datetime
from bson import ObjectId
from flask_praetorian import Praetorian, auth_required, current_user
import time

#create the app
app = Flask(__name__)
guard = Praetorian()
CORS(app)

app.config["SECRET_KEY"] = "supo5458"
app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 5}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 15}

# connecting to mongo running on the computer
app.config["MONGO_URI"] = "mongodb://localhost:27017/test_database"
mongo = PyMongo(app)

#import User and Post dataclass from user.py and post.py files
from user import User
from post import Post


guard.init_app(app, User)


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
        return jsonify({"error": "There is no user with that user_id in the database"})


@app.route("/refresh-token", methods=['POST'])
@cross_origin(origin="*")
def refresh():
    old_token = guard.read_token_from_header()
    new_token = guard.refresh_jwt_token(old_token)
    return jsonify(new_token)


#update_user_by_id doesn't work when a user is trying to update is password as of right now
@app.route("/user", methods=['PUT'])
@auth_required
@cross_origin(origin="*")
def update_user_by_id():
    try:
        user_id = current_user()._id
        data = request.json
        update_user = User.deserialize(mongo.db.users.find_one_and_update({"_id": ObjectId(user_id)}, {"$set": data}))
        return jsonify(update_user.to_dict())
    except:
        return jsonify("There is no user with that user_id in the database")


@app.route('/user', methods=["DELETE"])
@auth_required
@cross_origin(origin="*")
def delete_user():
    try:
        username = current_user().username
        password = request.json["password"]
        _id = current_user()._id
        #guard._verify_password checks the password that the user inputs to the password in the database
        #and returns True or False depending on whether the password match or not.
        user_password = guard._verify_password(password, current_user().password)
        if user_password:
            remove_user = User.deserialize(mongo.db.users.find_one_and_delete({"_id": ObjectId(_id)}))
            mongo.db.post.delete_many({"author": username})
            return jsonify(remove_user.to_dict())
        return jsonify("Invalid Username or Password")
    except:
        return jsonify("Invalid information")


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


@app.route("/register", methods=['POST'])
@cross_origin(origin="*")
def register():
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
            "roles": "member",
            "liked": []
        })
        User.deserialize(mongo.db.users.find_one({"email": email})).to_dict()
        return jsonify({"success": "You have been registered"})
    except:
        return jsonify("Please don't leave anything empty.")


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
            "liked": []
        })
        User.deserialize(mongo.db.users.find_one({"email": email})).to_dict()
        return jsonify({"success": "You have been registered"})
    except:
        return jsonify("Please don't leave anything empty.")


@app.route("/post", methods=['POST'])
@auth_required
def post():
    author = current_user().username
    title = request.json["title"]
    content = request.json["content"]
    date_posted = datetime.now()
    mongo.db.post.insert_one({
        "author": author,
        "title": title,
        "content": content,
        "date_posted": date_posted,
        "likes": 0
    })
    Post.deserialize(mongo.db.post.find_one({"author": author}))
    return jsonify({"success": 'Posted'})


@app.route("/like", methods=["PATCH"])
@auth_required
def likes():
    post_id = request.json["post_id"]
    likes = int(request.json["likes"])
    _id = ObjectId(current_user()._id)
    user = User.deserialize(mongo.db.users.find_one({"_id": _id}))
    for a in user.liked:
        if a == post_id:
            user.liked.remove(post_id)
            likes = likes - 1
            User.deserialize(mongo.db.users.find_one_and_update({"_id": _id}, {"$set": {"liked": user.liked}}))
            (mongo.db.post.find_one_and_update({"_id": ObjectId(post_id) }, {"$set": {"likes": likes }}))
            return jsonify("Disliked")
    user.liked.append(post_id)
    User.deserialize(mongo.db.users.find_one_and_update({"_id": _id}, {"$set": {"liked": user.liked}}))
    likes = likes + 1
    (mongo.db.post.find_one_and_update({"_id": ObjectId(post_id)}, {"$set": {"likes": likes }}))
    return jsonify("Liked")

@app.route("/user_liked/<postID>", methods=["POST"])
@auth_required
def user_liked(postID):
    id = current_user()._id
    user = User.deserialize(mongo.db.users.find_one({"_id": ObjectId(id)}))
    print(postID)
    print(user.liked)
    # liked = filter(lambda x: x == postID, user.liked)
    for post in user.liked:
        if post == postID:
            return True
    return jsonify(False)

# Returns all the liked posts
@app.route("/liked", methods=["GET"])
@auth_required
def liked():
    user = User.deserialize(mongo.db.users.find_one({"_id": ObjectId(current_user()._id)}))
    item = user.liked
    item.reverse()
    for items in user.liked:
        post = (mongo.db.post.find_one({"_id": ObjectId(items)}))
        if(not post):
            user.liked.remove(items)
    User.deserialize(mongo.db.users.find_one_and_update({"_id": ObjectId(current_user()._id)}, {"$set": {"liked": user.liked}}))
    item = [Post.deserialize(mongo.db.post.find_one({"_id": ObjectId(x)})) for x in item]
    if(item):
        return jsonify(item)
    return jsonify({"message": "You have liked no posts."})


@app.route("/post", methods=['GET'])
def get_all_post():
    posts = [Post.deserialize(x) for x in mongo.db.post.find().sort("date_posted", DESCENDING)]
    return jsonify({"posts": posts})


@app.route("/user_post", methods=['GET'])
@cross_origin(origin="*")
@auth_required
def get_user_posts():
    author = current_user().username
    post = [Post.deserialize(x) for x in mongo.db.post.find({"author" : author}).sort("date_posted", DESCENDING)]
    if post:
        return jsonify(post)
    return jsonify({"message": "You have made no posts."})


@app.route("/post/<post_id>", methods=['DELETE'])
@auth_required
def delete_post(post_id):
    mongo.db.post.find_one_and_delete({"_id": ObjectId(post_id)})
    return jsonify({"success": True})


@app.route("/protected", methods=['POST'])
@auth_required
def protected():
    return jsonify(True)
    

#Run the example
if __name__ == "__main__":
    app.run(debug=True)