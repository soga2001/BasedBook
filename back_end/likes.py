from dataclasses import dataclass, field
from enum import unique

#############################
### User Post Likes Class ###
#############################

@dataclass
class UserPostLikes:
    post_id: str = unique
    user_id: str = unique
    _id: str = field(default_factory=str)

    @classmethod
    def deserialize(cls, like):
        return UserPostLikes(_id=str(like["_id"]),
                    post_id=str(like["postId"]),
                    user_id=str(like["userId"]))
