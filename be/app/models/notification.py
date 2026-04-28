# backend/app/models/notification.py
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    type = Column(String(30), nullable=False)  # system, achievement, recommendation, daily_reminder, trending_alert
    title = Column(String(100), nullable=False)
    message = Column(Text)
    extra_data = Column(JSON, default={})  # store extra data like meme_id, badge_name, trending_score
    
    is_read = Column(Boolean, default=False)
    is_sent = Column(Boolean, default=False)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)
    
    def __repr__(self):
        return f"<Notification user={self.user_id} type={self.type} read={self.is_read}>"