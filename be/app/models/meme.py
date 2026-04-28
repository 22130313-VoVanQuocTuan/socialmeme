# backend/app/models/meme.py
from sqlalchemy import Column, Integer, String, Boolean, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import TimestampMixin

class Meme(Base, TimestampMixin):
    __tablename__ = "memes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    template_id = Column(Integer, ForeignKey("templates.id", ondelete="SET NULL"), nullable=True)
    
    image_url = Column(String(500), nullable=False)
    original_image_url = Column(String(500))
    caption = Column(Text)
    
    # Interaction stats
    like_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)
    
    #Trend prediction
    trending_score = Column(Float, default=0.0)
    is_trending = Column(Boolean, default=False)
    predicted_hot_at = Column(DateTime, nullable=True)
    hot_prediction_probability = Column(Float, default=0.0)
    
    # Status
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    status = Column(String(20), default="active")  # active, reported, deleted
    
    # Relationships
    user = relationship("User", backref="memes")
    template = relationship("Template", backref="memes")
    
    def __repr__(self):
        return f"<Meme {self.id}>"