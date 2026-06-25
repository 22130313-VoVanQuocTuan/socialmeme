# backend/app/routes/auth_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.auth_controller import AuthController
from app.schemas.user_schema import UserRegister, UserLogin

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    return AuthController.register(data.username, data.email, data.password, db)

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    return AuthController.login(data.email, data.password, db)

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    return AuthController.verify_email(token, db)
