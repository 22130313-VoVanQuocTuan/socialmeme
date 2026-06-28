from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.trend_prediction import TrendPrediction
from app.models.meme import Meme


class PredictionController:
    @staticmethod
    def list_predictions(db: Session, limit: int = 50, offset: int = 0):
        q = db.query(TrendPrediction).order_by(TrendPrediction.predicted_at.desc())
        total = q.count()
        items = q.offset(offset).limit(limit).all()
        return {"total": total, "predictions": items}

    @staticmethod
    def stats(db: Session, days: int = 7):
        # Compute true/false counts and accuracy over last N days and per-day breakdown
        from datetime import datetime, timedelta
        now = datetime.utcnow()
        start_date = (now - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)

        total = 0
        evaluated = 0
        correct = 0
        per_day = []

        for i in range(days):
            day_start = start_date + timedelta(days=i)
            day_end = day_start + timedelta(days=1)

            day_preds = db.query(TrendPrediction).filter(
                TrendPrediction.predicted_at >= day_start,
                TrendPrediction.predicted_at < day_end
            ).all()

            day_total = len(day_preds)
            day_evaluated = 0
            day_correct = 0
            for p in day_preds:
                if p.actually_hot is not None:
                    day_evaluated += 1
                    if p.is_predicted_hot == p.actually_hot:
                        day_correct += 1

            day_accuracy = (day_correct / day_evaluated) if day_evaluated > 0 else None
            per_day.append({
                "date": day_start.date().isoformat(),
                "total": day_total,
                "evaluated": day_evaluated,
                "correct": day_correct,
                "accuracy": day_accuracy,
            })

            total += day_total
            evaluated += day_evaluated
            correct += day_correct

        accuracy = (correct / evaluated) if evaluated > 0 else None
        return {"total": total, "evaluated": evaluated, "correct": correct, "accuracy": accuracy, "per_day": per_day}
