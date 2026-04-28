# backend/app/controllers/feed_controller.py
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.meme import Meme

class FeedController:
    
    @staticmethod
    def get_trending_feed(db: Session, limit: int = 20):
        """Lấy meme trending (xếp hạng theo like_count + view_count)"""
        memes = db.query(Meme).filter(
            Meme.is_public == True,
            Meme.status == "active"
        ).order_by(
            desc(Meme.like_count),
            desc(Meme.view_count),
            desc(Meme.created_at)
        ).limit(limit).all()
        
        return memes
    
    @staticmethod
    def get_latest_feed(db: Session, limit: int = 20):
        """Lấy meme mới nhất"""
        memes = db.query(Meme).filter(
            Meme.is_public == True,
            Meme.status == "active"
        ).order_by(
            desc(Meme.created_at)
        ).limit(limit).all()
        
        return memes
    
    @staticmethod
    def get_memes_by_user(user_id: int, db: Session, limit: int = 20):
        """Lấy meme của 1 user"""
        memes = db.query(Meme).filter(
            Meme.user_id == user_id,
            Meme.is_public == True
        ).order_by(
            desc(Meme.created_at)
        ).limit(limit).all()
        
        return memes