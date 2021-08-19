from contextlib import nullcontext
from typing import KeysView, Text
from flask_cors import CORS, cross_origin
from dataclasses import dataclass, field, asdict
from flask import Flask, jsonify, request
from flask_pymongo import ASCENDING, DESCENDING, PyMongo
from datetime import date, datetime
from bson import ObjectId
from uuid import uuid4
from flask_praetorian import Praetorian, auth_required, current_user

#create the app
app = Flask(__name__)
guard = Praetorian()
CORS(app)

app.config["SECRET_KEY"] = "supo5458"
app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 4}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}

# connecting to mongo running on the computer
app.config["MONGO_URI"] = "mongodb://localhost:27017/test_database"
# using local reference
mongo = PyMongo(app)

############################
######## User Class ########
############################

@dataclass
class User:
    _id: str = field(default_factory=str)
    email: str = field(default_factory=str)
    username: str = field(default_factory=str)
    password: str = field(default_factory=str)
    roles: str = field(default_factory=str)

    @property
    def identity(self):
        return self._id

    @property
    def rolenames(self):
        try:
            return self.roles.split(",")
        except:
            return []

    @classmethod
    def lookup(cls, username):
        user = mongo.db.users.find_one({"username": username})
        return User.deserialize(user)

    @classmethod
    def identify(cls, _id):
        user =  mongo.db.users.find_one({"_id": ObjectId(_id)})
        return User.deserialize(user)

    @classmethod
    def deserialize(cls, user):
        return User(_id=str(user["_id"]),
                    username=user["username"],
                    password=user["password"],
                    email=user["email"],
                    roles=user["roles"])

    #removes the password so that when data is printed, it doesn't show to password
    def to_dict(self):
        user = asdict(self)
        del user["password"]
        return user


############################

############################
#### Post Content Class ####
############################

@dataclass
class Post():
    author: str 
    _id: str = field(default_factory=str)
    title: str = field(default_factory=str)
    content: str = field(default_factory=str)
    date_posted: datetime = field(default_factory=datetime)

    @classmethod
    def deserialize(cls, post):
        return Post(_id = str(post["_id"]),
                    author=post["author"],
                    title=post["title"],
                    content=post["content"],
                    date_posted=post["date_posted"])    

############################



guard.init_app(app, User)

@app.route("/users", methods=['GET'])
def get_users():
    return jsonify([User.deserialize(x).to_dict() for x in mongo.db.users.find()])



@app.route("/users/<user_id>", methods=['GET'])
def get_user_by_id(user_id):
    try:
        user = User.deserialize(mongo.db.users.find_one({"_id": ObjectId(user_id)}))
        return jsonify(user.to_dict())
    except:
        return jsonify("There is no user with that user_id in the database")


#update_user_by_id doesn't work when a user is trying to update is password as of right now
@app.route("/users", methods=['PUT'])
@auth_required
def update_user_by_id():
    try:
        user_id = current_user()._id
        data = request.json
        update_user = User.deserialize(mongo.db.users.find_one_and_update({"_id": ObjectId(user_id)}, {"$set": data}))
        return jsonify(update_user.to_dict())
    except:
        return jsonify("There is no user with that user_id in the database")


@app.route('/users', methods=["DELETE"])
@auth_required
def delete():
    try:
        username = current_user().username
        password = request.json["password"]
        _id = current_user()._id
        #guard._verify_password checks the password that the user inputs to the password in the database
        #and returns True or False depending on whether the password match or not.
        user_password = guard._verify_password(password, current_user().password)
        if user_password:
            remove_user = User.deserialize(mongo.db.users.find_one_and_delete({"_id": ObjectId(_id)}))
            remove_post = mongo.db.post.delete_many({"author": username})
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
        return jsonify({"access_token": token, "success": "You have been logged in"})
    except:
        return jsonify({"error": "Invalid username or password."})


@app.route("/register", methods=['POST'])
@cross_origin(origin="*")
def register():
    try:
        email = request.json["email"]
        email = email.lower()
        username = request.json["username"]
        username = username.lower()
        password = request.json["password"]
        hashed_password = guard.hash_password(password)
        # roles = request.json["roles"]
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
            "email": email,
            "username": username,
            "password": hashed_password,
            "roles": "N/A"
        })
        user = User.deserialize(mongo.db.users.find_one({"email": email})).to_dict()
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
        "date_posted": date_posted
    })
    post = Post.deserialize(mongo.db.post.find_one({"author": author}))
    return jsonify(post)


@app.route("/post", methods=['GET'])
def get_all_post():
    posts = [Post.deserialize(x) for x in mongo.db.post.find().sort("date_posted", DESCENDING)]
    return jsonify(posts)



@app.route("/user_post", methods=['GET'])
@auth_required
def get_user_posts():
    author = current_user()._id
    post = [Post.deserialize(x) for x in mongo.db.post.find({"author" : author})]
    if post:
        return jsonify(post)
    return jsonify({"Message": "You have made no posts."})



@app.route("/protected")
@auth_required
def protected():
    return jsonify("Success")
    


#Run the example
if __name__ == "__main__":
    app.run(debug=True)