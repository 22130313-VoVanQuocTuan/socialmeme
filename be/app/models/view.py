# backend/app/models/view.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from app.database import Base

class MemeView(Base):
    __tablename__ = "meme_views"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    meme_id = Column(Integer, ForeignKey("memes.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id = Column(String(100), nullable=True)
    view_duration = Column(Integer, default=0)  # seconds
    referrer = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)
    
    # Mỗi user chỉ tính 1 view cho 1 meme trong 1 ngày
    __table_args__ = (
        UniqueConstraint('user_id', 'meme_id', name='unique_user_meme_daily_view'),
    )
    
    def __repr__(self):
        return f"<MemeView user={self.user_id} meme={self.meme_id}>"