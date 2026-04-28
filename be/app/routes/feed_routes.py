# backend/app/routes/feed_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.feed_controller import FeedController

router = APIRouter(prefix="/api/feed", tags=["feed"])

@router.get("/trending")
def get_trending(limit: int = 20, db: Session = Depends(get_db)):
    memes = FeedController.get_trending_feed(db, limit)
    return {"memes": memes}

@router.get("/latest")
def get_latest(limit: int = 20, db: Session = Depends(get_db)):
    memes = FeedController.get_latest_feed(db, limit)
    return {"memes": memes}

@router.get("/user/{user_id}")
def get_user_memes(user_id: int, limit: int = 20, db: Session = Depends(get_db)):
    memes = FeedController.get_memes_by_user(user_id, db, limit)
    return {"memes": memes}