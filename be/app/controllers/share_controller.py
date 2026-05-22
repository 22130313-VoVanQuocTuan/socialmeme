# backend/app/controllers/share_controller.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.share import Share
from app.models.meme import Meme
from app.services.behavior_service import BehaviorService
from app.services.notification_service import NotificationService

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
        if meme.user_id != user_id:
            NotificationService.create_notification(
                user_id=meme.user_id,
                type="share",
                title="Meme của bạn đã được chia sẻ",
                message=f"{username} đã chia sẻ meme của bạn.",
                extra_data={"meme_id": meme.id, "actor_id": user_id, "platform": platform, "action": "share"},
                db=db,
            )
        else:
            db.commit()

        BehaviorService.log_share(user_id, meme_id, db)
        return {"shared": True, "share_count": meme.share_count}