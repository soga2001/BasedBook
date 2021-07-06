from marshmallow import Schema, fields
# marshmallow makes it easier to serialize
# Schema is the object and fields is the types

class User(Schema):

    _id = fields.String()
    # name equals the name in the database which is a string
    name = fields.Str()

    # the age in the database which is an integer
    DOB = fields.DateTime()
    phone = fields.Int()