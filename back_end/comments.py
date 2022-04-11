from dataclasses import dataclass, field

############################
#### Post Content Class ####
############################

@dataclass
class Comments():
    username: str 
    postId: str
    _id: str = field(default_factory=str)
    title: str = field(default_factory=str)
    comment: str = field(default_factory=str)
    date_posted: str = field(default_factory=str)

    @classmethod
    def deserialize(cls, comment):
        return Comments(_id=str(comment["_id"]),
                    username=comment["username"],
                    postId=comment["postId"],
                    title=comment["title"],
                    comment=comment["comment"],
                    date_posted=comment["date_posted"]) 