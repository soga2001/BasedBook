# importing flask and flask_pymongo
from re import DEBUG
from flask import Flask, json, jsonify, request, make_response, redirect, url_for
from flask_pymongo import PyMongo
from marshmallow.fields import Date, Str
# importing user class from user.py
from models.user import User
from bson.objectid import ObjectId
from flask_cors import CORS
import flask_praetorian
from flask_bcrypt import Bcrypt

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

app.secret_key = "supo5458"

# connecting to mongo running on the computer
app.config["MONGO_URI"] = "mongodb://localhost:27017/test_database"

# using local reference
mongo = PyMongo(app)
app.debug = True


@app.route("/")
def home():
    return "Hello this is a home page"


@app.route("/users", methods=['GET'])
def get_users():

    user_list = [User().dump(user_doc) for user_doc in mongo.db.users.find()]
    for users in user_list:
        if user_list:
            users.pop('password')

    return jsonify(user_list)


@app.route("/users", methods=['POST'])
def post_user():

    data = request.json

    user = User().load(data)
    print("user", user)
    result = mongo.db.users.insert_one(user)
    new_user = User().dump(mongo.db.users.find_one(user))

    return jsonify(new_user)


@app.route("/users/<user_id>", methods=['GET'])
def get_user_by_id(user_id):
    user = User().dump(mongo.db.users.find_one({"_id": ObjectId(user_id)}))

    print("Hi", user)
    return jsonify(user)


@app.route("/users/<user_id>", methods=['DELETE'])
def remove_user_by_id(user_id):
    remove_user = User().dump(
        mongo.db.users.find_one_and_delete({"_id": ObjectId(user_id)}))
    print("Bitch", remove_user)

    return jsonify(remove_user)


@app.route("/users", methods=['DELETE'])
def remove_all():
    remove_all = User().dump(mongo.db.users.remove({}))

    return jsonify(remove_all)


@app.route("/users/<user_id>", methods=['PUT'])
def update_user_by_id(user_id):

    data = request.json

    user = User().load(data)

    update_user = User().dump(mongo.db.users.find_one_and_update(
        {"_id": ObjectId(user_id)}, {"$set": user}))

    return jsonify(update_user, data)


if __name__ == "__main__":
    app.run(debug=True)
