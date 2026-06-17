# backend/app/routes/admin_routes.py
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.admin_controller import AdminController
from app.services.jwt_service import require_admin
from app.schemas.user_schema import UserResponse

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return AdminController.get_all_users(db, skip, limit)

@router.put("/users/{user_id}/toggle")
def toggle_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return AdminController.toggle_user_status(user_id, db)

@router.delete("/memes/{meme_id}")
def delete_meme(
    meme_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return AdminController.delete_meme(meme_id, db)

@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return AdminController.get_dashboard_stats(db)