# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
try:
    from apscheduler.schedulers.background import BackgroundScheduler
    from apscheduler.triggers.cron import CronTrigger
    _APSCHEDULER_AVAILABLE = True
except ModuleNotFoundError:
    _APSCHEDULER_AVAILABLE = False

from app.services.prediction_service import PredictionService

from app.config import config
from app.routes import auth_routes, meme_routes, feed_routes, comment_routes
from app.routes import like_routes, share_routes
from app.routes import view_routes, prediction_routes
from app.routes import auth_routes, meme_routes, feed_routes, comment_routes, admin_routes
from app.routes import notification_routes, user_routes

app = FastAPI(title="SocialMeme API", version="1.0.0")
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://smartmeme.io.vn", "http://www.smartmeme.io.vn"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (cho ảnh meme)
os.makedirs("uploads/memes", exist_ok=True)
os.makedirs("uploads/temp", exist_ok=True)
os.makedirs("uploads/avatars", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routes
app.include_router(auth_routes.router)
app.include_router(meme_routes.router)
app.include_router(feed_routes.router)
app.include_router(like_routes.router)
app.include_router(share_routes.router)
app.include_router(comment_routes.router)
app.include_router(view_routes.router)

app.include_router(admin_routes.router)
app.include_router(notification_routes.router)
app.include_router(user_routes.router)
app.include_router(prediction_routes.router)

# Start background scheduler for predictions and daily evaluation (optional)
if _APSCHEDULER_AVAILABLE:
    scheduler = BackgroundScheduler()
    # hourly prediction job
    scheduler.add_job(PredictionService.run_hourly_predictions, 'interval', hours=1, next_run_time=None)
    # daily evaluation at 00:00
    scheduler.add_job(PredictionService.run_daily_evaluation, CronTrigger(hour=0, minute=0), next_run_time=None)

    @app.on_event("startup")
    def start_scheduler():
        try:
            if not getattr(app.state, "scheduler_started", False):
                scheduler.start()
                app.state.scheduler_started = True
                print("APScheduler started")
        except Exception as e:
            print(f"Failed to start APScheduler at startup: {e}")

    @app.on_event("shutdown")
    def stop_scheduler():
        try:
            if getattr(app.state, "scheduler_started", False):
                scheduler.shutdown(wait=False)
                app.state.scheduler_started = False
                print("APScheduler stopped")
        except Exception as e:
            print(f"Failed to stop APScheduler at shutdown: {e}")
else:
    print("APScheduler not available — scheduler disabled. Install 'apscheduler' and 'setuptools' to enable background jobs.")




@app.get("/")
def root():
    return {"message": "SocialMeme API running"}

@app.get("/health")
def health():
    return {"status": "ok"}
