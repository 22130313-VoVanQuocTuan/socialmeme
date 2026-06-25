# backend/app/routes/like_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.like_controller import LikeController
from app.services.jwt_service import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/likes", tags=["likes"])

@router.post("/{meme_id}/toggle")
def toggle_like(
    meme_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle like/unlike cho meme"""
    return LikeController.toggle_like(
        current_user.id,
        meme_id,
        current_user.username,
        db,
    )
