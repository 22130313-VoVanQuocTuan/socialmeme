# backend/app/models/__init__.py
from app.models.user import User
from app.models.template import Template
from app.models.meme import Meme
from app.models.behavior import UserBehavior
from app.models.like import Like
from app.models.share import Share
from app.models.view import MemeView
from app.models.comment import Comment
from app.models.trend_prediction import TrendPrediction
from app.models.notification import Notification
from app.models.report import ReportedMeme

# Import Base để Alembic nhận diện
from app.database import Base

__all__ = [
    "User",
    "Template",
    "Meme",
    "UserBehavior",
    "Like",
    "Share",
    "MemeView",
    "Comment",
    "TrendPrediction",
    "Notification",
    "UserSession",
    "ReportedMeme",
    "Base"
]