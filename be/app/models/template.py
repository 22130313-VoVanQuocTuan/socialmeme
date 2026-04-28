# backend/app/models/template.py
from sqlalchemy import Column, Integer, String, Boolean, Text, ARRAY, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
from app.models.base import TimestampMixin

class Template(Base, TimestampMixin):
    __tablename__ = "templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    image_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))
    
    # Caption settings
    caption_position = Column(String(20), default="bottom")  # top, bottom, center
    font_size = Column(Integer, default=40)
    text_color = Column(String(20), default="#FFFFFF")
    
    # Tags for recommendation
    category_tags = Column(ARRAY(String), default=[])  # ['animals', 'work', 'school', 'dating', 'memes']
    emotion_tags = Column(ARRAY(String), default=[])   # ['happy', 'sad', 'angry', 'funny']
    
    is_active = Column(Boolean, default=True)
    usage_count = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    def __repr__(self):
        return f"<Template {self.name}>"