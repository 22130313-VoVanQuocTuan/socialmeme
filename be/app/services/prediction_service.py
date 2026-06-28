import os
from datetime import datetime, timedelta
import joblib
from sqlalchemy import func
from app.database import SessionLocal
from app.models.meme import Meme
from app.models.trend_prediction import TrendPrediction
from app.models.user import User


class PredictionService:
    MODEL_PATH_ENV = "MODEL_DU_DOAN_HOT_PATH"

    @staticmethod
    def _load_model():
        path = os.getenv(PredictionService.MODEL_PATH_ENV, "models/model_du_doan_hot.joblib")
        if not os.path.exists(path):
            print(f"Prediction model not found at {path}, skipping predictions")
            return None
        try:
            model = joblib.load(path)
            print(f"Loaded prediction model from {path}")
            return model
        except Exception as e:
            print(f"Error loading model: {e}")
            return None

    @staticmethod
    def _extract_features(meme: Meme, total_users: int):
        # Simple feature vector: like_count, view_count, share_count, like_rate, view_rate, share_rate, hour_post, day_of_week
        likes = meme.like_count or 0
        views = meme.view_count or 0
        shares = meme.share_count or 0
        like_rate = likes / total_users if total_users > 0 else 0.0
        view_rate = views / total_users if total_users > 0 else 0.0
        share_rate = shares / total_users if total_users > 0 else 0.0
        hour_post = meme.created_at.hour if getattr(meme, 'created_at', None) else 0
        day_of_week = meme.created_at.weekday() if getattr(meme, 'created_at', None) else 0
        return [likes, views, shares, like_rate, view_rate, share_rate, hour_post, day_of_week]

    @staticmethod
    def run_hourly_predictions():
        db = SessionLocal()
        try:
            model = PredictionService._load_model()
            if model is None:
                return

            total_users = db.query(func.count(User.id)).scalar() or 0

            # Select memes that haven't been predicted yet
            memes = db.query(Meme).filter(
                Meme.is_public == True,
                Meme.status == "active",
                Meme.predicted_hot_at.is_(None)
            ).limit(200).all()

            for meme in memes:
                features = PredictionService._extract_features(meme, total_users)
                try:
                    prob = float(model.predict_proba([features])[0][1]) if hasattr(model, 'predict_proba') else float(model.predict([features])[0])
                except Exception:
                    # Fallback: predict returns single probability or label
                    try:
                        pred = model.predict([features])[0]
                        prob = float(pred)
                    except Exception:
                        prob = 0.0

                is_hot = prob >= 0.5

                # Save trend prediction record
                tp = TrendPrediction(
                    meme_id=meme.id,
                    likes_1h=meme.like_count or 0,
                    views_1h=meme.view_count or 0,
                    shares_1h=meme.share_count or 0,
                    like_rate_1h=features[3],
                    share_rate_1h=features[5],
                    view_velocity=0.0,
                    hour_post=features[6],
                    day_of_week=features[7],
                    user_avg_likes=0.0,
                    hot_probability=prob,
                    is_predicted_hot=is_hot
                )
                db.add(tp)

                # Update meme fields
                meme.hot_prediction_probability = prob
                meme.predicted_hot_at = datetime.utcnow()
                if is_hot:
                    meme.is_trending = True

            db.commit()
            print(f"Hourly predictions run: processed {len(memes)} memes")

        except Exception as e:
            print(f"Error in hourly predictions: {e}")
            db.rollback()
        finally:
            db.close()

    @staticmethod
    def run_daily_evaluation():
        db = SessionLocal()
        try:
            total_users = db.query(func.count(User.id)).scalar() or 0
            if total_users == 0:
                print("No users found, skipping evaluation")
                return

            # Evaluate predictions made on previous day which haven't been evaluated yet
            yesterday = (datetime.utcnow() - timedelta(days=1)).date()
            preds = db.query(TrendPrediction).filter(
                TrendPrediction.evaluated_at.is_(None),
                func.date(TrendPrediction.predicted_at) == yesterday
            ).all()

            for p in preds:
                meme = db.query(Meme).filter(Meme.id == p.meme_id).first()
                if not meme:
                    continue

                likes = meme.like_count or 0
                views = meme.view_count or 0
                shares = meme.share_count or 0

                cond_views = views >= 0.20 * total_users
                cond_likes = likes >= 0.15 * total_users
                cond_shares = shares >= 0.05 * total_users

                actually_hot = bool(cond_views and cond_likes and cond_shares)

                p.actually_hot = actually_hot
                p.actual_likes_24h = likes
                p.evaluated_at = datetime.utcnow()

                # Update meme's is_trending according to ground truth
                meme.is_trending = actually_hot

            db.commit()
            print(f"Daily evaluation run: evaluated {len(preds)} predictions")

        except Exception as e:
            print(f"Error in daily evaluation: {e}")
            db.rollback()
        finally:
            db.close()
