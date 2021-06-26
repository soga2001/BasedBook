from flask import Flask, jsonify
from flask_pymongo import PyMongo
from models.user import User

def create_app(env=None):
    app = Flask(__name__)

    app.config["MONGO_URI"] = "mongodb://localhost:27017/test_database"

    #connecting to mongo running on the computer
    # mongodb_client = PyMongo("mongodb://localhost:27017/")
     
    #using local reference
    mongo = PyMongo(app)

    @app.route("/users")
    def get_users():
        # user_list = []
        # for user in mongo.db.users.find():
        #     user_list.append({"name": user["name"] })
        
        #pythonic way to do things
        user_list = [User().dump(user_doc) for user_doc in mongo.db.users.find()]
        # user_list = [user_doc["name"] for user_doc in mongo.db.users.find()]

        # users = db.users.find()
        return jsonify(user_list)
        # return jsonify("potato")

    @app.route("/health")
    def health():
        return jsonify("soga")
    
    return app

