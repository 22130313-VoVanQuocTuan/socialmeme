from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.comment import Comment
from app.models.meme import Meme
from app.services.comment_moderation_service import CommentModerationService
from app.services.notification_service import NotificationService


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
    def create_comment(user_id: int, username: str, meme_id: int, content: str, db: Session) -> dict:
        normalized_content = content.strip() if content else ""
        if not normalized_content:
            raise HTTPException(400, "Bình luận không được để trống")

        moderation_result = CommentModerationService.check_comment(normalized_content)
        if not moderation_result["is_allowed"]:
            raise HTTPException(400, moderation_result["reason"])

        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Không tìm thấy bài viết (Meme)")

        comment = Comment(user_id=user_id, meme_id=meme_id, content=normalized_content)
        db.add(comment)
        db.commit()
        db.refresh(comment)

        if meme.user_id != user_id:
            NotificationService.create_notification(
                user_id=meme.user_id,
                type="comment",
                title="Bình luận mới",
                message=f"{username} đã bình luận trên meme của bạn.",
                extra_data={
                    "meme_id": meme.id,
                    "comment_id": comment.id,
                    "actor_id": user_id,
                    "action": "comment",
                },
                db=db,
            )

        return CommentController.serialize_comment(comment)

    @staticmethod
    def get_comments_for_meme(meme_id: int, db: Session) -> list:
        meme = db.query(Meme).filter(Meme.id == meme_id).first()
        if not meme:
            raise HTTPException(404, "Không tìm thấy bài viết (Meme)")

        comments = (
            db.query(Comment)
            .filter(Comment.meme_id == meme_id)
            .order_by(Comment.created_at.desc())
            .all()
        )
        return [CommentController.serialize_comment(comment) for comment in comments]

    @staticmethod
    def delete_comment(comment_id: int, user_id: int, user_role: str, db: Session) -> dict:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise HTTPException(404, "Không tìm thấy bình luận")

        if comment.user_id != user_id and user_role != "admin":
            raise HTTPException(403, "Bạn không có quyền xóa bình luận này")

        db.delete(comment)
        db.commit()
        return {"message": "Xóa bình luận thành công"}