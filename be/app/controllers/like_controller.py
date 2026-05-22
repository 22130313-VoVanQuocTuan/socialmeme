# backend/app/controllers/like_controller.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.like import Like
from app.models.meme import Meme
from app.models.user import User
from app.services.behavior_service import BehaviorService
from app.services.notification_service import NotificationService
from datetime import datetime

class LikeController:
    
    @staticmethod
    def toggle_like(user_id: int, meme_id: int, username: str, db: Session) -> dict:
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
            if meme.user_id != user_id:
                NotificationService.create_notification(
                    user_id=meme.user_id,
                    type="like",
                    title="Meme của bạn được thích",
                    message=f"{username} đã thích meme của bạn.",
                    extra_data={"meme_id": meme.id, "actor_id": user_id, "action": "like"},
                    db=db,
                )
            else:
                db.commit()
            BehaviorService.log_like(user_id, meme_id, db)
            return {"liked": True, "like_count": meme.like_count}