from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.config import config
from app.models.user import User
from app.services.behavior_service import BehaviorService
from app.services.email_service import EmailService
from app.services.jwt_service import (
    create_email_verification_token,
    create_token,
    verify_email_verification_token,
)
from app.services.password_service import hash_password, verify_password


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
            password_hash=hash_password(password),
            is_verified=False,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_email_verification_token(user.id, user.email)
        verification_url = f"{config.FRONTEND_URL}/verify-email?token={token}"
        email_sent = EmailService.send_verification_email(user.email, user.username, verification_url)

        return {
            "message": "Dang ky thanh cong. Vui long kiem tra email de xac thuc tai khoan.",
            "email_sent": email_sent,
        }

    @staticmethod
    def login(email: str, password: str, db: Session) -> dict:
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(401, "Invalid credentials")
        if not user.is_active:
            raise HTTPException(403, "Tai khoan cua ban da bi khoa. Vui long lien he Admin.")
        if not user.is_verified:
            raise HTTPException(403, "Tai khoan chua duoc xac thuc. Vui long kiem tra email cua ban.")

        token = create_token(user.id, user.email)
        BehaviorService.log_login(user.id, db)
        return {"user_id": user.id, "username": user.username, "role": user.role, "access_token": token}

    @staticmethod
    def verify_email(token: str, db: Session) -> dict:
        payload = verify_email_verification_token(token)
        if not payload:
            raise HTTPException(400, "Lien ket xac thuc khong hop le hoac da het han.")

        user = db.query(User).filter(
            User.id == payload.get("user_id"),
            User.email == payload.get("sub"),
        ).first()
        if not user:
            raise HTTPException(404, "Khong tim thay tai khoan can xac thuc.")

        if user.is_verified:
            return {"message": "Tai khoan da duoc xac thuc truoc do. Ban co the dang nhap."}

        user.is_verified = True
        user.email_verified_at = datetime.utcnow()
        db.commit()

        return {"message": "Xac thuc email thanh cong. Vui long quay lai trang dang nhap de dang nhap."}
