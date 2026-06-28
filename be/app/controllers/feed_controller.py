from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.meme import Meme
from app.models.like import Like
from app.services.recommendation_service import RecommendationService


class FeedController:
    @staticmethod
    def _serialize_memes(memes, db: Session, current_user_id: int = None):
        liked_meme_ids = set()
        if current_user_id and memes:
            meme_ids = [meme.id for meme in memes]
            liked_meme_ids = {
                meme_id for (meme_id,) in db.query(Like.meme_id).filter(
                    Like.user_id == current_user_id,
                    Like.meme_id.in_(meme_ids),
                ).all()
            }

        return [
            {
                "id": meme.id,
                "user_id": meme.user_id,
                "image_url": meme.image_url,
                "caption": meme.caption,
                "like_count": meme.like_count,
                "view_count": meme.view_count,
                "share_count": meme.share_count,
                "is_trending": meme.is_trending,
                "trending_score": meme.trending_score,
                "created_at": meme.created_at,
                "is_liked": meme.id in liked_meme_ids,
                "user_username": meme.user.username if meme.user else None,
                "user_joined": meme.user.created_at if meme.user else None,
            }
            for meme in memes
        ]

    @staticmethod
    def get_trending_feed(db: Session, limit: int = 20, current_user_id: int = None):
        memes = db.query(Meme).filter(
            Meme.is_public == True,
            Meme.status == "active",
        ).order_by(
            desc(Meme.like_count),
            desc(Meme.view_count),
            desc(Meme.created_at),
        ).limit(limit).all()

        return FeedController._serialize_memes(memes, db, current_user_id)

    @staticmethod
    def get_latest_feed(db: Session, limit: int = 20, current_user_id: int = None):
        memes = db.query(Meme).filter(
            Meme.is_public == True,
            Meme.status == "active",
        ).order_by(
            desc(Meme.created_at),
        ).limit(limit).all()

        return FeedController._serialize_memes(memes, db, current_user_id)

    @staticmethod
    def get_memes_by_user(
        user_id: int,
        db: Session,
        limit: int = 20,
        current_user_id: int = None,
    ):
        memes = db.query(Meme).filter(
            Meme.user_id == user_id,
            Meme.is_public == True,
            Meme.status == "active",
        ).order_by(
            desc(Meme.created_at),
        ).limit(limit).all()

        return FeedController._serialize_memes(memes, db, current_user_id)

    @staticmethod
    def get_liked_memes_by_user(
        user_id: int,
        db: Session,
        limit: int = 20,
        current_user_id: int = None,
    ):
        memes = db.query(Meme).join(Like, Meme.id == Like.meme_id).filter(
            Like.user_id == user_id,
            Meme.is_public == True,
            Meme.status == "active",
        ).order_by(
            desc(Like.created_at),
        ).limit(limit).all()

        return FeedController._serialize_memes(memes, db, current_user_id)

    @staticmethod
    def get_recommended_feed(user_id: int, db: Session, limit: int = 20):
        memes = RecommendationService.get_recommended_memes(user_id, db, limit)
        has_behavior = len(memes) > 0
        return FeedController._serialize_memes(memes, db, user_id), has_behavior
