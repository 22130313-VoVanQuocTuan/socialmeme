from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.services.password_service import hash_password, verify_password
from app.schemas.user_schema import UserUpdate
from app.models.user import User
from app.models.meme import Meme
from app.models.like import Like
from app.models.comment import Comment
from app.models.share import Share

class UserController:
    @staticmethod
    def get_user_stats(user_id: int, db: Session):
        # 1. Basic Stats
        user = db.query(User).filter(User.id == user_id).first()
        total_memes = db.query(Meme).filter(Meme.user_id == user_id).count()
        total_likes_received = db.query(func.sum(Meme.like_count)).filter(Meme.user_id == user_id).scalar() or 0
        total_views_received = db.query(func.sum(Meme.view_count)).filter(Meme.user_id == user_id).scalar() or 0
        
        # 2. Top Interactors
        # Dictionary to store interaction counts: {interactor_id: score}
        interactors = {}
        
        # Likes
        likes = db.query(Like.user_id, func.count(Like.id)).\
            join(Meme, Like.meme_id == Meme.id).\
            filter(Meme.user_id == user_id, Like.user_id != user_id).\
            group_by(Like.user_id).all()
            
        for row in likes:
            uid, count = row
            interactors[uid] = interactors.get(uid, 0) + count
            
        # Comments
        comments = db.query(Comment.user_id, func.count(Comment.id)).\
            join(Meme, Comment.meme_id == Meme.id).\
            filter(Meme.user_id == user_id, Comment.user_id != user_id).\
            group_by(Comment.user_id).all()
            
        for row in comments:
            uid, count = row
            interactors[uid] = interactors.get(uid, 0) + count
            
        # Shares
        shares = db.query(Share.user_id, func.count(Share.id)).\
            join(Meme, Share.meme_id == Meme.id).\
            filter(Meme.user_id == user_id, Share.user_id != user_id).\
            group_by(Share.user_id).all()
            
        for row in shares:
            uid, count = row
            interactors[uid] = interactors.get(uid, 0) + count
            
        # Get user details for top interactors
        top_interactor_ids = sorted(interactors, key=interactors.get, reverse=True)[:5]
        
        top_interactors_result = []
        if top_interactor_ids:
            top_users = db.query(User).filter(User.id.in_(top_interactor_ids)).all()
            for uid in top_interactor_ids:
                u = next((user for user in top_users if user.id == uid), None)
                if u:
                    top_interactors_result.append({
                        "id": u.id,
                        "username": u.username,
                        "avatar_url": u.avatar_url,
                        "interaction_score": interactors[uid]
                    })
                
        return {
            "user": {
                "username": user.username if user else f"User {user_id}",
                "avatar_url": user.avatar_url if user else None
            },
            "total_memes": total_memes,
            "total_likes_received": int(total_likes_received),
            "total_views_received": int(total_views_received),
            "top_interactors": top_interactors_result
        }

    @staticmethod
    def get_interaction_history(user_id: int, db: Session, limit: int = 50):
        history = []
        
        # Likes
        likes = db.query(Like, Meme).join(Meme, Like.meme_id == Meme.id).filter(Like.user_id == user_id).order_by(Like.created_at.desc()).limit(limit).all()
        for like, meme in likes:
            history.append({
                "type": "like",
                "meme": {"id": meme.id, "image_url": meme.image_url, "caption": meme.caption},
                "created_at": like.created_at
            })
            
        # Comments
        comments = db.query(Comment, Meme).join(Meme, Comment.meme_id == Meme.id).filter(Comment.user_id == user_id).order_by(Comment.created_at.desc()).limit(limit).all()
        for comment, meme in comments:
            history.append({
                "type": "comment",
                "content": comment.content,
                "meme": {"id": meme.id, "image_url": meme.image_url, "caption": meme.caption},
                "created_at": comment.created_at
            })
            
        # Shares
        shares = db.query(Share, Meme).join(Meme, Share.meme_id == Meme.id).filter(Share.user_id == user_id).order_by(Share.created_at.desc()).limit(limit).all()
        for share, meme in shares:
            history.append({
                "type": "share",
                "platform": share.platform,
                "meme": {"id": meme.id, "image_url": meme.image_url, "caption": meme.caption},
                "created_at": share.created_at
            })
            
        # Sort by created_at descending and take top 'limit'
        history.sort(key=lambda x: (x["created_at"] is not None, x["created_at"]), reverse=True)
        return history[:limit]

    @staticmethod
    def update_profile(user_id: int, data: UserUpdate, db: Session):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if data.username and data.username != user.username:
            existing = db.query(User).filter(User.username == data.username).first()
            if existing:
                raise HTTPException(status_code=400, detail="Tên người dùng đã tồn tại")
            user.username = data.username
            
        if data.avatar_url is not None:
            user.avatar_url = data.avatar_url
            
        if data.new_password:
            if not data.current_password:
                raise HTTPException(status_code=400, detail="Yêu cầu mật khẩu cũ để đổi mật khẩu mới")
            if not verify_password(data.current_password, user.password_hash):
                raise HTTPException(status_code=400, detail="Mật khẩu cũ không chính xác")
            user.password_hash = hash_password(data.new_password)
            
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_avatar(user_id: int, avatar_url: str, db: Session):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.avatar_url = avatar_url
        db.commit()
        db.refresh(user)
        return user
