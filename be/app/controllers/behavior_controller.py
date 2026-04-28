# backend/app/controllers/behavior_controller.py
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.behavior import UserBehavior


class BehaviorController:


    @staticmethod
    def log_action(
        user_id: int,
        action_type: str,
        meme_id: int = None,
        db: Session = None
    ):
        if db is None:
            raise HTTPException(500, "Database session required")
        
        now = datetime.now()
        
        behavior = UserBehavior(
            user_id=user_id,
            action_type=action_type,
            meme_id=meme_id,
            time_of_day=now.hour,
            day_of_week=now.weekday(),
            week_of_year=now.isocalendar()[1],
            month=now.month,
            year=now.year,
        )
        db.add(behavior)
        db.commit()
        
        return {"logged": True}