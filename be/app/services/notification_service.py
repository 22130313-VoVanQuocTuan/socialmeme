from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.notification import Notification

class NotificationService:
    @staticmethod
    def create_notification(
        user_id: int,
        type: str,
        title: str,
        message: str,
        extra_data: dict = None,
        db: Session = None,
    ) -> Notification:
        if extra_data is None:
            extra_data = {}

        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            extra_data=extra_data,
            is_read=False,
            is_sent=False,
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def get_notifications_for_user(user_id: int, limit: int = 50, db: Session = None):
        return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).limit(limit).all()

    @staticmethod
    def get_unread_count(user_id: int, db: Session = None) -> int:
        return db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).count()

    @staticmethod
    def mark_read(notification_id: int, user_id: int, db: Session = None) -> Notification:
        notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id).first()
        if not notification:
            raise HTTPException(404, "Notification not found")
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def mark_all_read(user_id: int, db: Session = None) -> int:
        notifications = (
            db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read == False)
            .all()
        )
        for notification in notifications:
            notification.is_read = True
        db.commit()
        return len(notifications)
