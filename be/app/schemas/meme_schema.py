# backend/app/schemas/meme_schema.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MemeCreate(BaseModel):
    caption: str
    template_id: Optional[int] = None
    is_public: bool = True

class MemeResponse(BaseModel):
    id: int
    user_id: int
    image_url: str
    caption: str
    like_count: int
    view_count: int
    share_count: int
    is_trending: bool
    trending_score: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class MemeUpdate(BaseModel):
    caption: Optional[str] = None
    is_public: Optional[bool] = None