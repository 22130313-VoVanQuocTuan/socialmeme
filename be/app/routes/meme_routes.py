# backend/app/routes/meme_routes.py
from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.meme_controller import MemeController
from app.services.image_service import save_temp_image
from app.services.jwt_service import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/memes", tags=["memes"])

@router.post("/create")
async def create_meme(
    caption: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_path = await save_temp_image(file)
    return MemeController.create_meme(current_user.id, caption, image_path, db)

@router.get("/{meme_id}")
def get_meme(meme_id: int, db: Session = Depends(get_db)):
    return MemeController.get_meme(meme_id, db)

@router.delete("/{meme_id}")
def delete_meme(
    meme_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return MemeController.delete_meme(meme_id, current_user.id, db)