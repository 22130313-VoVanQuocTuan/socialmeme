from fastapi import APIRouter, Depends, HTTPException, Query
from starlette.responses import StreamingResponse
from sqlalchemy.orm import Session
import json
import asyncio

from app.database import get_db, SessionLocal
from app.models.notification import Notification
from app.services.jwt_service import get_current_user, get_user_from_token
from app.services.notification_service import NotificationService
from app.models.user import User

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


def serialize_notification(notification: Notification) -> dict:
    return {
        "id": notification.id,
        "type": notification.type,
        "title": notification.title,
        "message": notification.message,
        "extra_data": notification.extra_data or {},
        "is_read": notification.is_read,
        "is_sent": notification.is_sent,
        "created_at": notification.created_at.isoformat() if notification.created_at else None,
    }


def format_sse(event: str, data: dict) -> str:
    payload = json.dumps(data, ensure_ascii=False)
    return f"event: {event}\ndata: {payload}\n\n"


@router.get("/")
def list_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notifications = NotificationService.get_notifications_for_user(current_user.id, db=db)
    return {
        "notifications": [serialize_notification(notification) for notification in notifications],
        "unread_count": NotificationService.get_unread_count(current_user.id, db=db),
    }


@router.post("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notification = NotificationService.mark_read(notification_id, current_user.id, db=db)
    return serialize_notification(notification)


@router.get("/stream")
def notification_stream(token: str = Query(...)):
    db = SessionLocal()
    user = get_user_from_token(token, db)
    if not user:
        db.close()
        raise HTTPException(status_code=401, detail="Invalid token")

    async def event_generator():
        try:
            while True:
                notifications = (
                    db.query(Notification)
                    .filter(Notification.user_id == user.id, Notification.is_sent == False)
                    .order_by(Notification.created_at)
                    .all()
                )
                for notification in notifications:
                    notification.is_sent = True
                    db.commit()
                    yield format_sse("notification", serialize_notification(notification))
                await asyncio.sleep(2)
        finally:
            db.close()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
