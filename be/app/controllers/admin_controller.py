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
    @staticmethod
    def get_all_memes(db, skip: int = 0, limit: int = 100):
        memes = db.query(Meme).offset(skip).limit(limit).all()
        
        # Format lại dữ liệu trả về cho Admin Dashboard
        return [
            {
                "id": meme.id,
                "user_id": meme.user_id,
                "image_url": meme.image_url,
                "caption": meme.caption, 
                "like_count": meme.like_count,
                "view_count": meme.view_count,
                "status": meme.status,
                "is_public": meme.is_public,
                "created_at": meme.created_at,
                "user_username": meme.user.username if meme.user else None
            }
            for meme in memes
        ]

    @staticmethod
    def toggle_meme_status(meme_id: int, db):
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(status_code=404, detail="Meme not found")
        
        if meme.status == "active":
            meme.status = "reported"
        else:
            meme.status = "active"
            
        db.commit()
        db.refresh(meme)
        
        return {
            "message": "Cập nhật trạng thái meme thành công",
            "meme_id": meme.id,
            "new_status": meme.status
        }