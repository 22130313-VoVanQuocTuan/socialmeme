from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, func
from app.models.meme import Meme
from app.models.behavior import UserBehavior
from app.models.like import Like
from app.models.user import User
from app.config import Config
from openai import OpenAI
import json

class RecommendationService:
    """
    Service để gợi ý meme dựa trên AI (GPT-4.1) và hành vi người dùng
    """
    
    @staticmethod
    def get_user_behavior_stats(user_id: int, db: Session):
        """
        Lấy thống kê hành vi của người dùng (meme nào họ xem, like, share)
        để hiểu sở thích của họ
        """
        # Lấy danh sách meme mà user đã like
        liked_memes = db.query(Like.meme_id).filter(
            Like.user_id == user_id
        ).all()
        liked_meme_ids = [m[0] for m in liked_memes]
        
        # Lấy hành vi xem meme của user
        viewed_behaviors = db.query(UserBehavior.meme_id).filter(
            and_(
                UserBehavior.user_id == user_id,
                UserBehavior.action_type == "view",
                UserBehavior.meme_id.isnot(None)
            )
        ).all()
        viewed_meme_ids = [b[0] for b in viewed_behaviors]
        
        # Lấy thông tin meme đã like để phân tích
        liked_memes_info = db.query(Meme).filter(
            Meme.id.in_(liked_meme_ids)
        ).all() if liked_meme_ids else []
        
        return {
            "liked_meme_ids": liked_meme_ids,
            "viewed_meme_ids": viewed_meme_ids,
            "interaction_count": len(liked_meme_ids) + len(viewed_meme_ids),
            "liked_memes_info": liked_memes_info
        }
    @staticmethod
    def _get_github_models_client():
        """Khởi tạo client cho GitHub Models (tương thích OpenAI SDK)"""
        if not Config.GITHUB_TOKEN:
            print("GITHUB_TOKEN not found, GitHub Models unavailable")
            return None
        
        # Dùng OpenAI SDK nhưng đổi base URL và API key [citation:3]
        return OpenAI(
            base_url=Config.GITHUB_MODELS_ENDPOINT,
            api_key=Config.GITHUB_TOKEN,
        )
        
    @staticmethod
    def _get_gpt_recommendations(user_behavior: dict, candidate_memes: list):
        """Dùng GitHub Models (GPT-4.1) để gợi ý meme"""
        try:
            # Kiểm tra token thay vì OPENAI_API_KEY
            if not Config.GITHUB_TOKEN:
                print("No GITHUB_TOKEN, skipping GPT recommendation")
                return None
            
            # Chuẩn bị prompt (giữ nguyên phần này)
            liked_captions = []
            if user_behavior["liked_memes_info"]:
                liked_captions = [m.caption for m in user_behavior["liked_memes_info"][:10]]
            
            candidate_info = []
            for meme in candidate_memes[:30]:
                candidate_info.append({
                    "id": meme.id,
                    "caption": meme.caption,
                    "likes": meme.like_count,
                    "views": meme.view_count,
                    "trending_score": meme.trending_score
                })
            
            prompt = f"""Bạn là một AI chuyên gợi ý meme dựa trên sở thích của người dùng.

Meme mà người dùng đã like (yêu thích):
{json.dumps(liked_captions[:5], ensure_ascii=False, indent=2)}

Thống kê hành vi người dùng:
- Số meme đã like: {len(user_behavior['liked_meme_ids'])}
- Số meme đã xem: {len(user_behavior['viewed_meme_ids'])}

Danh sách meme candidate để gợi ý:
{json.dumps(candidate_info, ensure_ascii=False, indent=2)}

Dựa trên sở thích của người dùng, hãy chọn 10 meme ID phù hợp nhất từ danh sách candidate.
Trả lời chỉ là một JSON array của meme IDs, ví dụ: [123, 456, 789, ...]
Không cần giải thích thêm."""

            client = RecommendationService._get_github_models_client()
            if not client:
                return None
            
            # Gọi API với model name đúng format của GitHub Models [citation:1]
            response = client.chat.completions.create(
                model=Config.GPT_MODEL,  # "openai/gpt-4.1"
                messages=[
                    {"role": "system", "content": "Bạn là một AI chuyên gợi ý nội dung. Trả lời chỉ là JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500,
                timeout=30.0  # Tăng timeout lên 30s vì GitHub Models có thể chậm hơn
            )
            
            # Parse kết quả (giữ nguyên phần này)
            response_text = response.choices[0].message.content.strip()
            import re
            json_match = re.search(r'\[.*?\]', response_text, re.DOTALL)
            if json_match:
                recommended_ids = json.loads(json_match.group())
                return [int(id) for id in recommended_ids if isinstance(id, (int, float))]
            
            return None
            
        except Exception as e:
            print(f"github-models recommendation error: {str(e)}")
            return None
    
    @staticmethod
    def get_recommended_memes(user_id: int, db: Session, limit: int = 20):
        """
        Gợi ý meme dựa trên AI (GPT-4.1):
        1. Phân tích hành vi người dùng (meme nào họ like, view)
        2. GPT-4.1 phân tích sở thích và đề xuất meme phù hợp
        3. Fallback về trending nếu user mới hoặc GPT thất bại
        """
        
        # Lấy hành vi người dùng
        user_behavior = RecommendationService.get_user_behavior_stats(user_id, db)
        liked_meme_ids = user_behavior["liked_meme_ids"]
        viewed_meme_ids = user_behavior["viewed_meme_ids"]
        
        # Nếu user chưa có hành vi nào, không gợi ý meme
        if user_behavior["interaction_count"] == 0:
            return []
        
        # Lấy danh sách meme đã được xem hoặc like
        user_interacted_meme_ids = set(liked_meme_ids + viewed_meme_ids)
        
        # Lấy danh sách candidate meme (trending, chưa xem)
        candidate_memes = db.query(Meme).filter(
            and_(
                Meme.is_public == True,
                Meme.status == "active",
                Meme.id.notin_(user_interacted_meme_ids),
                Meme.user_id != user_id
            )
        ).order_by(
            desc(Meme.trending_score),
            desc(Meme.like_count),
            desc(Meme.view_count),
            desc(Meme.created_at)
        ).limit(100).all()  # Lấy 100 candidate để GPT chọn
        
        # Gọi GPT-4.1 để gợi ý
        recommended_ids = RecommendationService._get_gpt_recommendations(user_behavior, candidate_memes)
        
        if recommended_ids:
            # Lấy meme theo order từ GPT gợi ý
            meme_map = {meme.id: meme for meme in candidate_memes}
            recommended = []
            for meme_id in recommended_ids[:limit]:
                if meme_id in meme_map:
                    recommended.append(meme_map[meme_id])
            
            # Nếu GPT gợi ý ít hơn limit, thêm meme trending
            if len(recommended) < limit:
                for meme in candidate_memes:
                    if meme.id not in [m.id for m in recommended]:
                        recommended.append(meme)
                        if len(recommended) >= limit:
                            break
            
            return recommended[:limit]
        
        # Fallback: trả về candidate memes nếu GPT thất bại
        return candidate_memes[:limit]
    
    @staticmethod
    def _get_trending_for_new_user(db: Session, limit: int = 20):
        """
        Lấy meme trending cho người dùng mới (chưa có hành vi nào)
        """
        memes = db.query(Meme).filter(
            and_(
                Meme.is_public == True,
                Meme.status == "active"
            )
        ).order_by(
            desc(Meme.trending_score),
            desc(Meme.like_count),
            desc(Meme.view_count),
            desc(Meme.created_at)
        ).limit(limit).all()
        
        return memes if memes else []
