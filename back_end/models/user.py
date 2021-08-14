
from marshmallow import Schema, fields
import pymongo
from datetime import date
from flask_bcrypt import Bcrypt
from bson.objectid import ObjectId
import flask_praetorian

# marshmallow makes it easier to serialize
# Schema is the object and fields is the types


class UserSchema(Schema):

    _id = fields.String()
    username = fields.Str()
    # DOB = fields.Date()
    phone = fields.Int()
    email = fields.Email()
    password = fields.Str()
    roles = fields.Str()

    # class Meta:
    #     ordered = True