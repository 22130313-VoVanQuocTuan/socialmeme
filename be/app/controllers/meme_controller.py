from typing import Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.meme import Meme
from app.models.like import Like
from app.services.image_service import add_caption_to_image
from app.services.behavior_service import BehaviorService


class MemeController:
    @staticmethod
    def serialize_meme(meme: Meme, db: Session, current_user_id: int = None) -> dict:
        is_liked = False
        if current_user_id:
            is_liked = db.query(Like).filter(
                Like.user_id == current_user_id,
                Like.meme_id == meme.id,
            ).first() is not None

        return {
            "id": meme.id,
            "user_id": meme.user_id,
            "image_url": meme.image_url,
            "caption": meme.caption,
            "like_count": meme.like_count,
            "view_count": meme.view_count,
            "share_count": meme.share_count,
            "is_trending": meme.is_trending,
            "trending_score": meme.trending_score,
            "created_at": meme.created_at,
            "is_liked": is_liked,
            "user_username": meme.user.username if meme.user else None,
            "user_joined": meme.user.created_at if meme.user else None,
        }

    @staticmethod
    def create_meme(
        user_id: int,
        caption: str,
        image_path: str,
        db: Session,
        text_x: Optional[float] = None,
        text_y: Optional[float] = None,
    ) -> dict:
        position = None
        if text_x is not None and text_y is not None:
            position = {"x": text_x, "y": text_y}

        image_url = add_caption_to_image(image_path, caption, position)

        meme = Meme(
            user_id=user_id,
            caption=caption,
            image_url=image_url,
        )
        db.add(meme)
        db.commit()
        db.refresh(meme)
        BehaviorService.log_create_meme(user_id, meme.id, db)
        return {"id": meme.id, "image_url": meme.image_url}

    @staticmethod
    def get_meme(meme_id: int, db: Session, current_user_id: int = None) -> dict:
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")
        return MemeController.serialize_meme(meme, db, current_user_id)

    @staticmethod
    def delete_meme(meme_id: int, user_id: int, db: Session) -> dict:
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")
            
        # Check if user is owner or admin
        from app.models.user import User
        user = db.query(User).filter(User.id == user_id).first()
        if meme.user_id != user_id and (not user or user.role != 'admin'):
            raise HTTPException(403, "Not your meme")

        db.delete(meme)
        db.commit()
        return {"message": "Deleted"}
