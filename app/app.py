# importing flask and flask_pymongo into out app
from datetime import datetime
from flask import Flask, json, jsonify, request
from flask_pymongo import PyMongo
from marshmallow.fields import Date
# connecting user.py to app.py
from models.user import User
from bson.objectid import ObjectId



def create_app(env=None):
    app = Flask(__name__)

    app.config["MONGO_URI"] = "mongodb://localhost:27017/test_database"

    #connecting to mongo running on the computer
    # mongodb_client = PyMongo("mongodb://localhost:27017/")
     
    #using local reference
    mongo = PyMongo(app)

    @app.route("/users", methods = ['GET'])
    def get_users():
        # user_list = []
        # for user in mongo.db.users.find():
        #     user_list.append({"name": user["name"] })
        
        #pythonic way to do things
        user_list = [User().dump(user_doc) for user_doc in mongo.db.users.find()]

        # users = db.users.find()
        return jsonify(user_list)
        # return jsonify("potato")

    @app.route("/users", methods = ['POST'])
    def post_user():
        
        data = request.json

        user = User().load(data)
        result = mongo.db.users.insert_one(user)
        new_user = User().dump(mongo.db.users.find_one(user))
        
        # print("dumping", User().dump(result))
        # print(result)
        return jsonify(new_user)

    @app.route("/users/<user_id>", methods = ['GET'])
    def get_user_by_id(user_id):
        user = User().dump(mongo.db.users.find_one({"_id": ObjectId(user_id)}))
        
        print("Hi",user)
        return jsonify(user)

    @app.route("/users/<user_id>", methods = ['DELETE'])
    def remove_user_by_id(user_id):
        remove_user = User().dump(mongo.db.users.delete_one({"_id": ObjectId(user_id)}))
        
        # print("Hello", remove_user)
        return jsonify(remove_user)

    @app.route("/users", methods = ['DELETE'])
    def remove_all():
        remove_all = User().dump(mongo.db.users.remove({}))
        
        # print("Hello", remove_user)
        return jsonify(remove_all)

    return app

    
