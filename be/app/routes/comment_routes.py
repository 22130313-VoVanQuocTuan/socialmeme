from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.comment_controller import CommentController
from app.services.jwt_service import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/comments", tags=["comments"])

@router.get("/meme/{meme_id}")
def get_comments(meme_id: int, db: Session = Depends(get_db)):
    return CommentController.get_comments_for_meme(meme_id, db)

@router.post("/meme/{meme_id}")
def create_comment(
    meme_id: int,
    content: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return CommentController.create_comment(current_user.id, meme_id, content, db)

@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return CommentController.delete_comment(comment_id, current_user.id, current_user.role, db)
