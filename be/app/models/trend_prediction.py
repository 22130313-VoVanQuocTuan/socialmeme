# backend/app/models/trend_prediction.py
from sqlalchemy import Column, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class TrendPrediction(Base):
    __tablename__ = "trend_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    meme_id = Column(Integer, ForeignKey("memes.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Features
    likes_1h = Column(Integer, default=0)
    views_1h = Column(Integer, default=0)
    shares_1h = Column(Integer, default=0)
    like_rate_1h = Column(Float, default=0.0)
    share_rate_1h = Column(Float, default=0.0)
    view_velocity = Column(Float, default=0.0)
    hour_post = Column(Integer)
    day_of_week = Column(Integer)
    user_avg_likes = Column(Float, default=0.0)
    
    # Prediction result
    hot_probability = Column(Float, default=0.0)
    is_predicted_hot = Column(Boolean, default=False)
    
    # Ground truth (after 24h)
    actually_hot = Column(Boolean, nullable=True)
    actual_likes_24h = Column(Integer)
    
    # Metadata
    predicted_at = Column(DateTime, server_default=func.now())
    evaluated_at = Column(DateTime, nullable=True)