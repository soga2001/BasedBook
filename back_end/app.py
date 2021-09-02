from flask_cors import CORS, cross_origin
from flask import Flask, jsonify, request
from flask_pymongo import ASCENDING, DESCENDING, PyMongo
from datetime import datetime
from bson import ObjectId
from flask_praetorian import Praetorian, auth_required, current_user

#create the app
app = Flask(__name__)
guard = Praetorian()
CORS(app)

app.config["SECRET_KEY"] = "supo5458"
app.config["JWT_ACCESS_LIFESPAN"] = {"seconds": 30}
app.config["JWT_REFRESH_LIFESPAN"] = {"seconds": 31}

# connecting to mongo running on the computer
app.config["MONGO_URI"] = "mongodb://localhost:27017/test_database"
# using local reference
mongo = PyMongo(app)

#import User and Post dataclass from user.py and post.py files
from user import User
from post import Post

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

@app.route("/refresh-token", methods=['POST'])
@cross_origin(origin="*")
def refresh():
    old_token = guard.read_token_from_header()
    new_token = guard.refresh_jwt_token(old_token)
    print("old", old_token, "new", new_token)
    return jsonify(new_token)

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
        # print(username, password)
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
            "firstname": firstname,
            "lastname": lastname,
            "phone": phone,
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
    return jsonify({"success": 'Posted'})


@app.route("/post", methods=['GET'])
def get_all_post():
    posts = [Post.deserialize(x) for x in mongo.db.post.find().sort("date_posted", DESCENDING)]
    return jsonify(posts)



@app.route("/user_post", methods=['GET'])
@auth_required
def get_user_posts():
    author = current_user().username
    post = [Post.deserialize(x) for x in mongo.db.post.find({"author" : author}).sort("date_posted", DESCENDING)]
    if post:
        return jsonify(post)
    return jsonify({"message": "You have made no posts."})



@app.route("/post/<post_id>", methods=['DELETE'])
@cross_origin(origin="*")
@auth_required
def delete_post(post_id):
    mongo.db.post.find_one_and_delete({"_id": ObjectId(post_id)})
    return jsonify({'success': 'Your post has been deleted. Refreshing the page...'})


@app.route("/protected", methods=['POST'])
@auth_required
def protected():
    print("protected")
    return jsonify({"success": True})
    


#Run the example
if __name__ == "__main__":
    app.run(debug=True)