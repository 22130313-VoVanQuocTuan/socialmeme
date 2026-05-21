from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.comment import Comment
from app.models.meme import Meme

class CommentController:

    @staticmethod
    def serialize_comment(comment: Comment) -> dict:
        return {
            "id": comment.id,
            "meme_id": comment.meme_id,
            "user_id": comment.user_id,
            "username": comment.user.username if comment.user else "Người dùng",
            "content": comment.content,
            "created_at": comment.created_at.isoformat() if comment.created_at else None,
        }

    @staticmethod
    def create_comment(user_id: int, meme_id: int, content: str, db: Session) -> dict:
        if not content or not content.strip():
            raise HTTPException(400, "Bình luận không được để trống")

        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")

        comment = Comment(user_id=user_id, meme_id=meme_id, content=content.strip())
        db.add(comment)
        db.commit()
        db.refresh(comment)

        return CommentController.serialize_comment(comment)

    @staticmethod
    def get_comments_for_meme(meme_id: int, db: Session) -> list:
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Meme not found")

        comments = db.query(Comment).filter(Comment.meme_id == meme_id).order_by(Comment.created_at.desc()).all()
        return [CommentController.serialize_comment(comment) for comment in comments]

    @staticmethod
    def delete_comment(comment_id: int, user_id: int, user_role: str, db: Session) -> dict:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise HTTPException(404, "Comment not found")

        if comment.user_id != user_id and user_role != "admin":
            raise HTTPException(403, "Bạn không có quyền xóa bình luận này")

        db.delete(comment)
        db.commit()
        return {"message": "Comment deleted"}
