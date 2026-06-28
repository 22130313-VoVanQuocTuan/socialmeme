# backend/app/controllers/admin_controller.py
from collections import defaultdict

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.meme import Meme
from app.models.user import User
from app.utils.time_utils import to_vietnam_time


class AdminController:
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100):
        return db.query(User).offset(skip).limit(limit).all()

    @staticmethod
    def toggle_user_status(user_id: int, db: Session):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(404, "User not found")
        user.is_active = not user.is_active
        db.commit()
        db.refresh(user)
        return {"user_id": user_id, "is_active": user.is_active}

    @staticmethod
    def delete_meme(meme_id: int, db: Session):
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")
        db.delete(meme)
        db.commit()
        return {"message": "Meme deleted"}

    @staticmethod
    def _build_count_series(counter):
        return [
            {"label": label, "count": count}
            for label, count in sorted(counter.items(), key=lambda item: item[0])
        ]

    @staticmethod
    def get_dashboard_stats(db: Session):
        total_users = db.query(User).count()
        total_memes = db.query(Meme).count()
        total_likes = db.query(func.coalesce(func.sum(Meme.like_count), 0)).scalar() or 0

        meme_timestamps = db.query(Meme.created_at).all()
        memes_by_day = defaultdict(int)
        memes_by_month = defaultdict(int)
        memes_by_year = defaultdict(int)
        posting_distribution = {"day": 0, "night": 0}

        for (created_at,) in meme_timestamps:
            local_created_at = to_vietnam_time(created_at)
            if local_created_at is None:
                continue

            memes_by_day[local_created_at.strftime("%Y-%m-%d")] += 1
            memes_by_month[local_created_at.strftime("%Y-%m")] += 1
            memes_by_year[local_created_at.strftime("%Y")] += 1

            if 6 <= local_created_at.hour < 18:
                posting_distribution["day"] += 1
            else:
                posting_distribution["night"] += 1

        return {
            "total_users": total_users,
            "total_memes": total_memes,
            "total_likes": total_likes,
            "memes_by_day": AdminController._build_count_series(memes_by_day),
            "memes_by_month": AdminController._build_count_series(memes_by_month),
            "memes_by_year": AdminController._build_count_series(memes_by_year),
            "posting_distribution": posting_distribution,
        }

    @staticmethod
    def get_all_memes(db, skip: int = 0, limit: int = 100):
        memes = db.query(Meme).offset(skip).limit(limit).all()

        return [
            {
                "id": meme.id,
                "user_id": meme.user_id,
                "image_url": meme.image_url,
                "caption": meme.caption,
                "like_count": meme.like_count,
                "view_count": meme.view_count,
                "status": meme.status,
                "is_public": meme.is_public,
                "created_at": meme.created_at,
                "user_username": meme.user.username if meme.user else None,
            }
            for meme in memes
        ]

    @staticmethod
    def toggle_meme_status(meme_id: int, db):
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(status_code=404, detail="Meme not found")

        if meme.status == "active":
            meme.status = "reported"
        else:
            meme.status = "active"

        db.commit()
        db.refresh(meme)

        return {
            "message": "Cap nhat trang thai meme thanh cong",
            "meme_id": meme.id,
            "new_status": meme.status,
        }
