from dataclasses import dataclass, field
from datetime import datetime

############################
#### Post Content Class ####
############################

@dataclass
class Post():
    author: str 
    _id: str = field(default_factory=str)
    title: str = field(default_factory=str)
    content: str = field(default_factory=str)
    date_posted: datetime = field(default_factory=datetime)
    # image: str = field(default_factory=str)

    @classmethod
    def deserialize(cls, post):
        return Post(_id = str(post["_id"]),
                    author=post["author"],
                    title=post["title"],
                    content=post["content"],
                    date_posted=post["date_posted"]) 