# backend/app/controllers/admin_controller.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.models.meme import Meme
from app.models.template import Template

class AdminController:
    
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100):
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def toggle_user_status(user_id: int, db: Session):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(404, "User not found")
        user.is_active = not user.is_active
        db.commit()
        db.refresh(user)
        return {"user_id": user_id, "is_active": user.is_active}
    
    @staticmethod
    def delete_meme(meme_id: int, db: Session):
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")
        db.delete(meme)
        db.commit()
        return {"message": "Meme deleted"}
    
    @staticmethod
    def get_dashboard_stats(db: Session):
        total_users = db.query(User).count()
        total_memes = db.query(Meme).count()
        total_likes = db.query(Meme).with_entities(Meme.like_count).count()
        
        return {
            "total_users": total_users,
            "total_memes": total_memes,
            "total_likes": total_likes
        }