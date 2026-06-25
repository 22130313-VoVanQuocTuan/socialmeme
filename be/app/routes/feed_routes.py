from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.feed_controller import FeedController
from app.services.jwt_service import get_current_user, get_optional_current_user
from app.models.user import User

router = APIRouter(prefix="/api/feed", tags=["feed"])


@router.get("/trending")
def get_trending(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    current_user_id = current_user.id if current_user else None
    memes = FeedController.get_trending_feed(db, limit, current_user_id)
    return {"memes": memes}


@router.get("/latest")
def get_latest(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    current_user_id = current_user.id if current_user else None
    memes = FeedController.get_latest_feed(db, limit, current_user_id)
    return {"memes": memes}


@router.get("/recommended")
def get_recommended(
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    memes, has_behavior = FeedController.get_recommended_feed(current_user.id, db, limit)
    try:
        print(f"[DEBUG] /api/feed/recommended user={current_user.id} has_behavior={has_behavior} count={len(memes)}")
    except Exception:
        print("[DEBUG] /api/feed/recommended (could not log details)")
    return {"memes": memes, "has_behavior": has_behavior}


@router.get("/user/{user_id}")
def get_user_memes(
    user_id: int,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    current_user_id = current_user.id if current_user else None
    memes = FeedController.get_memes_by_user(user_id, db, limit, current_user_id)
    return {"memes": memes}
