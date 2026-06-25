import json
import re

from openai import OpenAI

from app.config import config


class CommentModerationService:
    FALLBACK_BLOCKED_TERMS = {
        "dit",
        "địt",
        "cac",
        "cặc",
        "lon",
        "lồn",
        "buoi",
        "buồi",
        "me may",
        "mẹ mày",
        "con cho",
        "con chó",
        "thang cho",
        "thằng chó",
        "deo",
        "đéo",
        "dm",
        "dmm",
        "vcl",
        "cc",
    }

    @staticmethod
    def _get_client():
        if not config.GITHUB_TOKEN:
            return None

        return OpenAI(
            base_url=config.GITHUB_MODELS_ENDPOINT,
            api_key=config.GITHUB_TOKEN,
        )

    @staticmethod
    def check_comment(content: str) -> dict:
        normalized_content = content.strip()
        if not normalized_content:
            return {"is_allowed": False, "reason": "Binh luan khong duoc de trong."}

        ai_result = CommentModerationService._check_with_ai(normalized_content)
        if ai_result is not None:
            return ai_result

        return CommentModerationService._check_with_fallback(normalized_content)

    @staticmethod
    def _check_with_ai(content: str):
        client = CommentModerationService._get_client()
        if not client:
            return None

        prompt = f"""
Ban dang kiem duyet binh luan cho mot mang xa hoi meme.

Hay danh gia binh luan sau co tuc tiu, chui boi, xuc pham tho tuc, nhuc ma nhan pham hay khong.
Chi can chan nhung noi dung tho tuc ro rang, chui tuc, lang ma, xuc pham nang.
Noi dung tranh luan binh thuong, che meme nhe, hoac khong tuc tieu thi cho phep.

Binh luan:
\"\"\"{content}\"\"\"

Tra ve duy nhat JSON object theo dung dinh dang:
{{"is_allowed": true, "reason": "..." }}
"""

        try:
            response = client.chat.completions.create(
                model=config.GPT_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Ban la bo loc kiem duyet binh luan. "
                            "Chi tra ve JSON hop le voi hai truong is_allowed va reason."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0,
                max_tokens=120,
                timeout=20.0,
            )

            response_text = response.choices[0].message.content.strip()
            json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
            if not json_match:
                return None

            parsed = json.loads(json_match.group())
            is_allowed = bool(parsed.get("is_allowed"))
            reason = str(parsed.get("reason") or "").strip()

            if is_allowed:
                return {"is_allowed": True, "reason": reason or "Comment accepted."}

            return {
                "is_allowed": False,
                "reason": reason or "Bình luận chứa nội dung tục tĩu hoặc xúc phạm.",
            }
        except Exception:
            return None

    @staticmethod
    def _check_with_fallback(content: str) -> dict:
        lowered = re.sub(r"\s+", " ", content.lower())
        for term in CommentModerationService.FALLBACK_BLOCKED_TERMS:
            if term in lowered:
                return {
                    "is_allowed": False,
                    "reason": "Bình luận chứa nội dung tục tĩu hoặc xúc phạm.",
                }

        return {"is_allowed": True, "reason": "Comment accepted."}
