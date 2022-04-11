from dataclasses import dataclass, field
from enum import unique

#############################
### User Post Likes Class ###
#############################

@dataclass
class UserPostLikes:
    post_id: str
    user_id: str
    _id: str = field(default_factory=str)

    @classmethod
    def deserialize(cls, like):
        return UserPostLikes(_id=str(like["_id"]),
                    post_id=str(like["postId"]),
                    user_id=str(like["userId"]))
