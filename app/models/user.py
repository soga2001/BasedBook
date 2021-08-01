from marshmallow import Schema, fields
from datetime import date
from flask_bcrypt import Bcrypt
from bson.objectid import ObjectId
# marshmallow makes it easier to serialize
# Schema is the object and fields is the types


class User(Schema):

    _id = fields.String()
    # name equals the name in the database which is a string
    username = fields.Str()

    # the age in the database which is an integer
    # DOB = fields.Date()
    phone = fields.Int()
    email = fields.Str()
    password = fields.Str()
