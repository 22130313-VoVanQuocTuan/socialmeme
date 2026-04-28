# backend/app/utils/time_utils.py
from datetime import datetime, timedelta
import pytz

VN_TZ = pytz.timezone('Asia/Ho_Chi_Minh')

def to_vietnam_time(utc_time: datetime) -> datetime:
    """Chuyển đổi UTC sang giờ Việt Nam"""
    if utc_time is None:
        return None
    if utc_time.tzinfo is None:
        utc_time = pytz.UTC.localize(utc_time)
    return utc_time.astimezone(VN_TZ)

def now_vn() -> datetime:
    """Lấy thời gian hiện tại theo giờ Việt Nam"""
    return datetime.now(VN_TZ)