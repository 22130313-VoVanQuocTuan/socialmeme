# backend/app/models/share.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Share(Base):
    __tablename__ = "shares"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    meme_id = Column(Integer, ForeignKey("memes.id", ondelete="CASCADE"), nullable=False, index=True)
    platform = Column(String(30), nullable=True)  # facebook, twitter, copy_link, zalo, tiktok
    created_at = Column(DateTime, server_default=func.now(), index=True)
    
    def __repr__(self):
        return f"<Share user={self.user_id} meme={self.meme_id} platform={self.platform}>"