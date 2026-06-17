# backend/app/controllers/auth_controller.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.services.password_service import hash_password, verify_password
from app.services.jwt_service import create_token
from app.services.behavior_service import BehaviorService
class AuthController:
    
    @staticmethod
    def register(username: str, email: str, password: str, db: Session) -> dict:
        existing = db.query(User).filter(
            (User.email == email) | (User.username == username)
        ).first()
        if existing:
            raise HTTPException(400, "Email or username already exists")
        
        user = User(
            username=username,
            email=email,
            password_hash=hash_password(password)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        token = create_token(user.id, user.email)
        return {"user_id": user.id, "username": user.username, "role": user.role,"access_token": token}
    
    @staticmethod
    def login(email: str, password: str, db: Session) -> dict:
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(401, "Invalid credentials")
        if not user.is_active:
            raise HTTPException(403, "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.")
        
        token = create_token(user.id, user.email)
        BehaviorService.log_login(user.id, db)
        return {"user_id": user.id, "username": user.username, "role": user.role, "access_token": token}