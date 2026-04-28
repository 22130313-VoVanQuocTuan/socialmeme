# backend/app/routes/share_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.share import Share
from app.models.meme import Meme
from app.services.jwt_service import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/shares", tags=["shares"])

@router.post("/{meme_id}")
def share_meme(
    meme_id: int,
    platform: str = "copy_link",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ghi nhận share meme"""
    meme = db.query(Meme).filter(Meme.id == meme_id).first()
    if not meme:
        raise HTTPException(404, "Meme not found")
    
    share = Share(
        user_id=current_user.id,
        meme_id=meme_id,
        platform=platform
    )
    db.add(share)
    meme.share_count += 1
    db.commit()
    
    return {"shared": True, "share_count": meme.share_count}