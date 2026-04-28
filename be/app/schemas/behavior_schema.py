# backend/app/schemas/behavior_schema.py
from pydantic import BaseModel
from typing import Optional

class BehaviorLog(BaseModel):
    action_type: str  # view, like, share, create_meme
    meme_id: Optional[int] = None
    session_id: Optional[str] = None
    device_type: str = "desktop"
    browser: Optional[str] = None