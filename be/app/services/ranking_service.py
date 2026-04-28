# backend/app/services/ranking_service.py
from sqlalchemy.orm import Session
from sqlalchemy import update
from app.models.meme import Meme
from datetime import datetime, timedelta

class RankingService:
    
    WEIGHTS = {
        'view': 1,
        'like': 2,
        'share': 3,
        'new_bonus': 5
    }
    
    @staticmethod
    def calculate_score(meme: Meme, age_hours: float) -> int:
        """Tính điểm cho meme"""
        score = (
            meme.view_count * RankingService.WEIGHTS['view'] +
            meme.like_count * RankingService.WEIGHTS['like'] +
            meme.share_count * RankingService.WEIGHTS['share']
        )
        
        # Bonus cho meme mới (24h đầu)
        if age_hours < 24:
            score += RankingService.WEIGHTS['new_bonus']
        
        # Decay: giảm dần theo thời gian
        decay = max(0.3, 1 - (age_hours / 168))  # 7 days decay
        score = int(score * decay)
        
        return score
    
    @staticmethod
    def update_all_scores(db: Session):
        """Cập nhật điểm cho tất cả meme"""
        memes = db.query(Meme).all()
        now = datetime.now()
        
        for meme in memes:
            age_hours = (now - meme.created_at).total_seconds() / 3600
            meme.trending_score = RankingService.calculate_score(meme, age_hours)
        
        db.commit()
        return len(memes)