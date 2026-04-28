# backend/app/models/report.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from app.database import Base

class ReportedMeme(Base):
    __tablename__ = "reported_memes"
    
    id = Column(Integer, primary_key=True, index=True)
    meme_id = Column(Integer, ForeignKey("memes.id", ondelete="CASCADE"), nullable=False, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    reason = Column(String(100), nullable=False)  # spam, offensive, copyright, inappropriate, other
    description = Column(Text, nullable=True)
    
    status = Column(String(20), default="pending")  # pending, reviewed, dismissed, resolved
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, server_default=func.now(), index=True)
    
    # Mỗi user chỉ report 1 meme 1 lần
    __table_args__ = (
        UniqueConstraint('meme_id', 'reporter_id', name='unique_user_meme_report'),
    )
    
    def __repr__(self):
        return f"<ReportedMeme meme={self.meme_id} by={self.reporter_id} status={self.status}>"