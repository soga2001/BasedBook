from marshmallow import Schema, fields
# marshmallow makes it easier to serialize
# Schema is the object and fields is the types

class User(Schema):

    # name equals the name in the database which is a string
    name = fields.Str()

    # the age in the database which is an integer
    age = fields.Int()
    DOB = fields.Date()

    # def __init__(self, name) -> None:
    #     super().__init__()
    #     self.name = name


