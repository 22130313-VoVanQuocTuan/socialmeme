# backend/app/models/behavior.py
from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, DateTime, Index
from sqlalchemy.sql import func
from app.database import Base

class UserBehavior(Base):
    __tablename__ = "user_behaviors"
    
    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    meme_id = Column(Integer, ForeignKey("memes.id", ondelete="SET NULL"), nullable=True)
    
    action_type = Column(String(30), nullable=False, index=True)  # view, like, share, create_meme, login, scroll
       
    # Time data (denormalized for faster query)
    time_of_day = Column(Integer)   # 0-23
    day_of_week = Column(Integer)   # 0-6 (0 = Sunday)
    week_of_year = Column(Integer)
    month = Column(Integer)
    year = Column(Integer)
    
    created_at = Column(DateTime, server_default=func.now(), index=True)
    __table_args__ = (
        Index('idx_behaviors_user_action_time', 'user_id', 'action_type', 'created_at'),
    )
    
    def __repr__(self):
        return f"<UserBehavior user={self.user_id} action={self.action_type}>"