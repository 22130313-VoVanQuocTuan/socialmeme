# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import config
from app.routes import auth_routes, meme_routes, feed_routes, comment_routes
from app.routes import like_routes, share_routes
from app.routes import view_routes
from app.routes import auth_routes, meme_routes, feed_routes, comment_routes, admin_routes

app = FastAPI(title="SocialMeme API", version="1.0.0")
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (cho ảnh meme)
os.makedirs("uploads/memes", exist_ok=True)
os.makedirs("uploads/temp", exist_ok=True)
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

@app.get("/")
def root():
    return {"message": "SocialMeme API running"}

@app.get("/health")
def health():
    return {"status": "ok"}