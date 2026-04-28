# backend/app/controllers/meme_controller.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.meme import Meme
from app.models.user import User
from app.services.image_service import add_caption_to_image
from app.services.behavior_service import BehaviorService

class MemeController:
    
    @staticmethod
    def create_meme(user_id: int, caption: str, image_path: str, db: Session) -> dict:
        # Thêm caption vào ảnh
        image_url = add_caption_to_image(image_path, caption)
        
        # Lưu vào database
        meme = Meme(
            user_id=user_id,
            caption=caption,
            image_url=image_url
        )
        db.add(meme)
        db.commit()
        db.refresh(meme)
        BehaviorService.log_create_meme(user_id, meme.id, db)
        return {"id": meme.id, "image_url": meme.image_url}
    
    @staticmethod
    def get_meme(meme_id: int, db: Session) -> Meme:
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")
        return meme
    
    @staticmethod
    def delete_meme(meme_id: int, user_id: int, db: Session) -> dict:
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")
        if meme.user_id != user_id:
            raise HTTPException(403, "Not your meme")
        
        db.delete(meme)
        db.commit()
        return {"message": "Deleted"}