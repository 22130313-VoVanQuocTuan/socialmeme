# backend/app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.config import config

# Tạo engine
engine = create_engine(
    config.DATABASE_URL,
    pool_pre_ping=True,      # Kiểm tra connection trước khi dùng
    echo=False               # Set True để log SQL 
)

# SessionLocal để inject vào các controller
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class cho các model
Base = declarative_base()

# Dependency: lấy session cho mỗi request
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()