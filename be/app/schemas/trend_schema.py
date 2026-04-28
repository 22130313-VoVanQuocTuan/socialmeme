# backend/app/schemas/trend_schema.py
from pydantic import BaseModel
from typing import Optional

class TrendPredictionResponse(BaseModel):
    meme_id: int
    hot_probability: float
    is_predicted_hot: bool
    
    class Config:
        from_attributes = True