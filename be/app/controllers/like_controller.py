# backend/app/controllers/like_controller.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.like import Like
from app.models.meme import Meme
from app.services.behavior_service import BehaviorService
from datetime import datetime

class LikeController:
    
    @staticmethod
    def toggle_like(user_id: int, meme_id: int, db: Session) -> dict:
        # Check meme exists
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")
        
        # Check if already liked
        existing_like = db.query(Like).filter(
            Like.user_id == user_id,
            Like.meme_id == meme_id
        ).first()
        
        if existing_like:
            # Unlike
            db.delete(existing_like)
            meme.like_count -= 1
            db.commit()
            return {"liked": False, "like_count": meme.like_count}
        else:
            # Like
            new_like = Like(user_id=user_id, meme_id=meme_id)
            db.add(new_like)
            meme.like_count += 1
            db.commit()
            BehaviorService.log_like(user_id, meme_id, db)
            return {"liked": True, "like_count": meme.like_count}