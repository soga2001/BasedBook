from dataclasses import dataclass, field
from enum import unique
from tokenize import Double

#############################
### User Post Likes Class ###
#############################

@dataclass
class PostRating:
    post_id: str = unique
    user_id: str = unique
    _id: str = field(default_factory=str)
    rating: float = field(default_factory=float)

    @classmethod
    def deserialize(cls, like):
        return PostRating(_id=str(like["_id"]),
                    post_id=str(like["postId"]),
                    user_id=str(like["userId"]),
                    rating=float(like["rating"]))
