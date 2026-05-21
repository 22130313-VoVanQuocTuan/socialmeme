from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import TimestampMixin

class Comment(Base, TimestampMixin):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    meme_id = Column(Integer, ForeignKey("memes.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)

    user = relationship("User", backref="comments")
    meme = relationship("Meme", backref="comments")

    def __repr__(self):
        return f"<Comment {self.id} user={self.user_id} meme={self.meme_id}>"
