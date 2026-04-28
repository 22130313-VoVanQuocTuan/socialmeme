# backend/app/models/like.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from app.database import Base

class Like(Base):
    __tablename__ = "likes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    meme_id = Column(Integer, ForeignKey("memes.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)
    
    # Mỗi user chỉ like 1 meme 1 lần
    __table_args__ = (
        UniqueConstraint('user_id', 'meme_id', name='unique_user_meme_like'),
    )
    
    def __repr__(self):
        return f"<Like user={self.user_id} meme={self.meme_id}>"