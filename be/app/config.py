import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/socialmeme_db")
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey_change_me_in_production")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    EMAIL_VERIFICATION_EXPIRE_HOURS = int(os.getenv("EMAIL_VERIFICATION_EXPIRE_HOURS", "24"))
    
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "True").lower() in ("true", "1", "t")
    SMTP_USE_SSL = os.getenv("SMTP_USE_SSL", "False").lower() in ("true", "1", "t")
    SMTP_USERNAME = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "SocialMeme")
    EMAIL_FROM_EMAIL = os.getenv("EMAIL_FROM_EMAIL", "noreply@smartmeme.io.vn")

    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    GITHUB_MODELS_ENDPOINT = os.getenv("GITHUB_MODELS_ENDPOINT", "https://models.inference.ai.azure.com")
    GPT_MODEL = os.getenv("GPT_MODEL", "gpt-4o-mini")

config = Config()
