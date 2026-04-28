# backend/app/routes/view_routes.py
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.view_controller import ViewController
from app.services.jwt_service import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/views", tags=["views"])

@router.post("/{meme_id}/track")
def track_view(
    meme_id: int,
    request: Request,
    duration: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ghi nhận lượt xem meme"""
    
    if not current_user:
        return {"error": "Login required to track view"}
    
    session_id = request.headers.get("X-Session-ID")
    
    return ViewController.track_view(
        user_id=current_user.id,
        meme_id=meme_id,
        session_id=session_id,
        view_duration=duration,
        db=db
    )

@router.get("/{meme_id}/stats")
def get_view_stats(
    meme_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy thống kê view (chỉ admin mới xem được)"""
    
    # Chỉ admin mới xem được stats
    if not current_user or current_user.role != "admin":
        raise HTTPException(403, "Admin only")
    
    return ViewController.get_view_stats(meme_id, db)