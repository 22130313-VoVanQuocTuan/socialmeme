# backend/app/services/behavior_service.py
from sqlalchemy.orm import Session
from app.controllers.behavior_controller import BehaviorController

class BehaviorService:
    
    @staticmethod
    def log_view(user_id: int, meme_id: int, db: Session = None):
        return BehaviorController.log_action(
            user_id=user_id,
            action_type="view",
            meme_id=meme_id,
            db=db
        )
    
    @staticmethod
    def log_like(user_id: int, meme_id: int, db: Session = None):
        return BehaviorController.log_action(
            user_id=user_id,
            action_type="like",
            meme_id=meme_id,
            db=db
        )
    
    @staticmethod
    def log_share(user_id: int, meme_id: int, db: Session = None):
        return BehaviorController.log_action(
            user_id=user_id,
            action_type="share",
            meme_id=meme_id,
            db=db
        )
    
    @staticmethod
    def log_create_meme(user_id: int, meme_id: int, db: Session = None):
        return BehaviorController.log_action(
            user_id=user_id,
            action_type="create_meme",
            meme_id=meme_id,
            db=db
        )
    
    @staticmethod
    def log_login(user_id: int, db: Session = None):
        return BehaviorController.log_action(
            user_id=user_id,
            action_type="login",
            db=db
        )