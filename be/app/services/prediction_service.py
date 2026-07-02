import os
from datetime import datetime, timedelta
from pathlib import Path
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sqlalchemy import func
from app.database import SessionLocal
from app.models.meme import Meme
from app.models.trend_prediction import TrendPrediction
from app.models.user import User


class PredictionService:
    MODEL_PATH_ENV = "MODEL_DU_DOAN_HOT_PATH"
    BASE_DIR = Path(__file__).resolve().parents[2]
    MODEL_PATH = BASE_DIR / "app" / "models" / "prediction" / "model_du_doan_hot.pkl"
    @staticmethod
    def _load_model():
        path = Path(os.getenv(PredictionService.MODEL_PATH_ENV, str(PredictionService.MODEL_PATH)))
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
        print("Prediction job started")
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
        print("Daily evaluation job started")
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

    @staticmethod
    def calculate_accuracy():
        """Tính toán độ chính xác của model từ các dự báo đã được đánh giá."""
        db = SessionLocal()
        try:
            # Lấy tất cả predictions đã được evaluated
            evaluated_preds = db.query(TrendPrediction).filter(
                TrendPrediction.evaluated_at.is_not(None),
                TrendPrediction.actually_hot.is_not(None)
            ).all()

            if len(evaluated_preds) == 0:
                print("No evaluated predictions found")
                return None

            # Tính toán số lần dự báo đúng
            correct_count = sum(1 for p in evaluated_preds if p.is_predicted_hot == p.actually_hot)
            accuracy = correct_count / len(evaluated_preds)

            print(f"Current model accuracy: {accuracy:.4f} ({correct_count}/{len(evaluated_preds)})")
            return accuracy

        except Exception as e:
            print(f"Error calculating accuracy: {e}")
            return None
        finally:
            db.close()

    @staticmethod
    def _prepare_training_data(min_samples=100):
        """Chuẩn bị dữ liệu huấn luyện từ TrendPrediction đã được evaluated."""
        db = SessionLocal()
        try:
            # Lấy predictions đã được evaluated
            evaluated_preds = db.query(TrendPrediction).filter(
                TrendPrediction.evaluated_at.is_not(None),
                TrendPrediction.actually_hot.is_not(None)
            ).all()

            if len(evaluated_preds) < min_samples:
                print(f"Not enough evaluated predictions ({len(evaluated_preds)}/{min_samples})")
                return None

            # Chuyển thành DataFrame
            data = []
            for p in evaluated_preds:
                data.append({
                    'likes_1h': p.likes_1h or 0,
                    'views_1h': p.views_1h or 0,
                    'shares_1h': p.shares_1h or 0,
                    'like_rate_1h': p.like_rate_1h or 0,
                    'share_rate_1h': p.share_rate_1h or 0,
                    'view_velocity': p.view_velocity or 0,
                    'hour_post': p.hour_post or 0,
                    'day_of_week': p.day_of_week or 0,
                    'user_avg_likes': p.user_avg_likes or 0,
                    'actually_hot': int(p.actually_hot)
                })

            df = pd.DataFrame(data)
            print(f"Prepared {len(df)} samples for training")
            return df

        except Exception as e:
            print(f"Error preparing training data: {e}")
            return None
        finally:
            db.close()

    @staticmethod
    def _retrain_model(df):
        """Huấn luyện lại model từ dữ liệu mới."""
        try:
            features = [
                'likes_1h', 'views_1h', 'shares_1h', 'like_rate_1h', 
                'share_rate_1h', 'view_velocity', 'hour_post', 'day_of_week', 
                'user_avg_likes'
            ]

            X = df[features].fillna(0)
            y = df['actually_hot'].astype(int)

            # Chia train/test
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )

            # Huấn luyện model
            model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                min_samples_split=2,
                min_samples_leaf=1,
                max_features='sqrt',
                random_state=42,
                n_jobs=-1
            )

            model.fit(X_train, y_train)

            # Đánh giá
            y_pred = model.predict(X_test)
            new_accuracy = accuracy_score(y_test, y_pred)

            print(f"New model accuracy on test set: {new_accuracy:.4f}")

            # Lưu model
            model_path = PredictionService.MODEL_PATH
            model_path.parent.mkdir(parents=True, exist_ok=True)
            joblib.dump(model, str(model_path))
            print(f"Model saved to {model_path}")

            return True, new_accuracy

        except Exception as e:
            print(f"Error retraining model: {e}")
            return False, None

    @staticmethod
    def retrain_model_if_needed(accuracy_threshold=0.85):
        """
        Kiểm tra độ chính xác và tái huấn luyện model nếu dưới ngưỡng.
        Args:
            accuracy_threshold: Ngưỡng độ chính xác (mặc định 85%)
        """
        print(f"\n--- Checking model accuracy (threshold: {accuracy_threshold:.1%}) ---")
        
        # Tính toán accuracy hiện tại
        current_accuracy = PredictionService.calculate_accuracy()
        
        if current_accuracy is None:
            print("Cannot calculate accuracy, skipping retrain check")
            return

        if current_accuracy >= accuracy_threshold:
            print(f"Model accuracy ({current_accuracy:.1%}) is good, no retrain needed")
            return

        print(f"Model accuracy ({current_accuracy:.1%}) is below threshold ({accuracy_threshold:.1%})")
        print("Preparing to retrain model...")

        # Chuẩn bị dữ liệu
        df = PredictionService._prepare_training_data(min_samples=100)
        if df is None:
            print("Cannot prepare training data, skipping retrain")
            return

        # Huấn luyện lại
        success, new_accuracy = PredictionService._retrain_model(df)
        if success:
            print(f"Model retrained successfully! New accuracy: {new_accuracy:.1%}")
        else:
            print("Model retrain failed")
