# backend/app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base
from app.models.base import TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(String(255), default="/static/default-avatar.png")
    bio = Column(String(500), default="")
    
    role = Column(String(20), default="user")  # user, admin
    is_active = Column(Boolean, default=True)
    
    last_login = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<User {self.username}>"