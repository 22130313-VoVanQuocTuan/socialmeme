# backend/app/controllers/share_controller.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.share import Share
from app.models.meme import Meme
from app.services.behavior_service import BehaviorService

class ShareController:
    
    @staticmethod
    def create_share(user_id: int, meme_id: int, platform: str, db: Session) -> dict:
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")
        share = Share(
            user_id=user_id,
            meme_id=meme_id,
            platform=platform,
        )
        db.add(share)
        meme.share_count += 1
        BehaviorService.log_share(user_id, meme_id, db)
        db.commit()
      
        
        return {"shared": True, "share_count": meme.share_count}