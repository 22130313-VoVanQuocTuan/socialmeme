from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.prediction_controller import PredictionController

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

@router.get("/")
def list_predictions(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    return PredictionController.list_predictions(db, limit, offset)

@router.get("/stats")
def prediction_stats(days: int = 7, db: Session = Depends(get_db)):
    return PredictionController.stats(db, days)
