from dataclasses import dataclass, field, asdict
from app import mongo
from bson import ObjectId

############################
######## User Class ########
############################

@dataclass
class User:
    _id: str = field(default_factory=str)
    firstname: str = field(default_factory=str)
    lastname: str = field(default_factory=str)
    email: str = field(default_factory=str)
    phone: str = field(default_factory=str)
    username: str = field(default_factory=str)
    password: str = field(default_factory=str)
    roles: str = field(default_factory=str)
    # liked: set = field(default_factory=set)
    liked: list = field(default_factory=list)

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
                    firstname=user["firstname"],
                    lastname=user["lastname"],
                    phone=user["phone"],
                    username=user["username"],
                    password=user["password"],
                    email=user["email"],
                    roles=user["roles"],
                    liked=user["liked"])

    #removes the password so that when data is printed, it doesn't display the password
    def to_dict(self):
        user = asdict(self)
        del user["password"]
        return user