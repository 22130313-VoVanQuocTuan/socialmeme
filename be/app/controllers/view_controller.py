# backend/app/controllers/view_controller.py
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from datetime import datetime, timedelta
from fastapi import HTTPException
from app.models.meme import Meme
from app.models.view import MemeView
from app.services.behavior_service import BehaviorService

class ViewController:
    
    @staticmethod
    def track_view(
        user_id: int,
        meme_id: int,
        session_id: str = None,
        view_duration: int = 0,
        db: Session = None
    ) -> dict:
        
        if db is None:
            raise HTTPException(500, "Database session required")
        
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")
        
        #Kiểm tra đã view hôm nay chưa
        existing_view = db.query(MemeView).filter(
            and_(
                MemeView.user_id == user_id,
                MemeView.meme_id == meme_id,
            )
        ).first()
        
        if existing_view:
            # Đã view hôm nay rồi, chỉ tăng view_count
            meme.view_count += 1
            db.commit()
            db.refresh(meme)
            
            return {
                "viewed": False,
                "message": "Already viewed today",
                "view_count": meme.view_count
            }
        
        
        new_view = MemeView(
            user_id=user_id,
            meme_id=meme_id,
            session_id=session_id,
            view_duration=view_duration,
        )
        db.add(new_view)
        
        # Tăng view_count
        meme.view_count += 1
        BehaviorService.log_view(
            user_id=user_id,
            meme_id=meme_id,
            db=db,
        )
        db.commit()
        db.refresh(meme)
        
        return {
            "viewed": True,
            "view_id": new_view.id,
            "view_count": meme.view_count,
            "message": "View tracked successfully"
        }