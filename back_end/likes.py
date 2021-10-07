from dataclasses import dataclass, field

#############################
### User Post Likes Class ###
#############################

@dataclass
class UserPostLikes:
    _id: str
    post_id: str
    user_id: str

    @classmethod
    def deserialize(cls, like):
        return UserPostLikes(_id=str(like["_id"]),
                    post_id=str(like["postId"]),
                    user_id=str(like["userId"]))
