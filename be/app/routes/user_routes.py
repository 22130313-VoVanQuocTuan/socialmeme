from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.user_controller import UserController
from app.schemas.user_schema import UserUpdate, UserResponse
from app.services.jwt_service import get_current_user
from app.models.user import User
from app.services.image_service import save_avatar_image

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    return UserController.get_user_stats(user_id, db)

@router.get("/{user_id}/history")
def get_user_history(user_id: int, limit: int = 50, db: Session = Depends(get_db)):
    return UserController.get_interaction_history(user_id, db, limit)

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_profile(data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return UserController.update_profile(current_user.id, data, db)

@router.post("/me/avatar", response_model=UserResponse)
async def update_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    avatar_url = await save_avatar_image(file)
    return UserController.update_avatar(current_user.id, avatar_url, db)
