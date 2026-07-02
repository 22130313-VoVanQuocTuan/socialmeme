from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.prediction_controller import PredictionController
from app.services.prediction_service import PredictionService
from app.middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

@router.get("/")
def list_predictions(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    return PredictionController.list_predictions(db, limit, offset)

@router.get("/stats")
def prediction_stats(days: int = 7, db: Session = Depends(get_db)):
    return PredictionController.stats(db, days)

@router.get("/model/accuracy")
def get_model_accuracy():
    """Lấy độ chính xác hiện tại của model."""
    accuracy = PredictionService.calculate_accuracy()
    if accuracy is None:
        return {
            "status": "error",
            "message": "Cannot calculate accuracy - no evaluated predictions yet",
            "accuracy": None
        }
    return {
        "status": "success",
        "accuracy": round(accuracy, 4),
        "percentage": f"{accuracy * 100:.2f}%"
    }

@router.post("/model/retrain")
def trigger_model_retrain(current_user=Depends(get_current_user)):
    """Trigger manual model retrain (admin only)."""
    # Check if user is admin
    if not hasattr(current_user, 'role') or current_user.role != "admin":
        return {
            "status": "error",
            "message": "Only admin can trigger model retrain"
        }
    
    PredictionService.retrain_model_if_needed(accuracy_threshold=0.85)
    
    return {
        "status": "success",
        "message": "Model retrain check triggered",
        "accuracy": round(PredictionService.calculate_accuracy(), 4) if PredictionService.calculate_accuracy() else None
    }
