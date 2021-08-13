# importing flask and flask_pymongo
from flask_bcrypt import Bcrypt
import flask_praetorian
from flask_cors import CORS
from re import DEBUG
from flask import Flask, json, jsonify, request, make_response, redirect, url_for
from flask_pymongo import PyMongo
from marshmallow.decorators import pre_load
from marshmallow.fields import Date, Str, String
from marshmallow import Schema, fields
# importing user class from user.py
# from models.user import User
from bson import ObjectId
from marshmallow import Schema, fields
# from marshmallow.utils import EXCLUDE

# Schema.TYPE_MAPPING[ObjectId] = fields.String


app = Flask(__name__)
bcrypt = Bcrypt(app)
guard = flask_praetorian.Praetorian()
CORS(app)

app.config["SECRET_KEY"] = "supo5458"
app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}

app.config["MONGO_URI"] = "mongodb://localhost:27017/test_database"

# using local reference
mongo = PyMongo(app)
app.debug = True

############################


class User(Schema):
    _id = fields.Str()
    username = fields.Str()
    # DOB = fields.Date()
    phone = fields.Int()
    hashed_password = fields.Str()
    email = fields.Str()
    roles = fields.Str()

    @ property
    def identity(self):
        print("identity", "user id", self._id)
        return self._id

    @ property
    def rolenames(self):
        print("rolenames", self.roles)
        try:
            return self.roles.split(",")
        except Exception:
            return []

    @property
    def password(self):
        return self.hashed_password

    @ classmethod
    def lookup(cls, username):
        # print("lookup", username)
        user_dict = User().dump(mongo.db.users.find_one({"username": username}))
        # print("user dict", user_dict)
        # user_credentials = UserCredentials().load(user_dict, unknown=EXCLUDE)
        # print(type(user_credentials))
        return User(username, user_dict['password'])

    @ classmethod
    def identify(cls, id):
        print("identify", id)
        return cls.query.get(id)
        # return mongo.db.users.find_one({"_id": id})


##############################


guard.init_app(app, User)


# connecting to mongo running on the computer


@ app.route("/")
def home():
    return "Hello this is a home page"


@ app.route("/users", methods=['GET'])
def get_users():

    # user_list = [User().dump(user_doc) for user_doc in mongo.db.users.find()]
    # for users in user_list:
    #     if user_list:
    #         users.pop('password')
    #     print(users, User.id)

    return jsonify(User(many=True).dump(mongo.db.users.find()))


@ app.route("/users", methods=['POST'])
def post_user():

    data = request.json

    # "email": "soga2058@gmail.com",
    # "username": "bob",
    # "password": "my123",
    # "phone": 7209370783,
    # "roles": "admin, moderator"
    email = request.json["email"]
    username = request.json["username"]
    password = request.json["password"]
    hashed_password = guard.hash_password(password)
    phone = request.json["phone"]
    roles = request.json["roles"]

    # user = User().load(data)
    result = mongo.db.users.insert_one({"email": email, "username": username, "hashed_password": hashed_password, "phone": phone, "roles": roles})
    new_user = User().dump(mongo.db.users.find_one({"email": email}))

    return jsonify(new_user)


@ app.route("/users/<user_id>", methods=['GET'])
def get_user_by_id(user_id):
    user = User().dump(mongo.db.users.find_one({"_id": ObjectId(user_id)}))

    print("Hi", user)
    return jsonify(user)


@ app.route("/users/<user_id>", methods=['DELETE'])
def remove_user_by_id(user_id):
    remove_user = User().dump(
        mongo.db.users.find_one_and_delete({"_id": ObjectId(user_id)}))
    print("Bitch", remove_user)

    return jsonify(remove_user)


@ app.route("/users", methods=['DELETE'])
def remove_all():
    remove_all = User().dump(mongo.db.users.remove({}))

    return jsonify(remove_all)


@ app.route("/users/<user_id>", methods=['PUT'])
def update_user_by_id(user_id):

    data = request.json

    user = User().load(data)

    update_user = User().dump(mongo.db.users.find_one_and_update(
        {"_id": ObjectId(user_id)}, {"$set": user}))

    return jsonify(update_user, data)


@ app.route("/login", methods=["POST"])
def login():
    req = request.get_json(force=True)
    username = req.get("username")
    password = req.get("password")
    hashed_password = guard.hash_password(password)

    print("login", username, password)
    # its breaking on the next line with the error -- 'dict' object has no attribute 'password'
    user = guard.authenticate(username, hashed_password)
    ret = {"access_token": guard.encode_jwt_token(user)}
    return (jsonify(ret), 200)


if __name__ == "__main__":
    app.run(debug=True)
