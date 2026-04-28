from sqlalchemy import Column, DateTime, func
from app.database import Base

class TimestampMixin:
    """Mixin tự động thêm created_at, updated_at"""
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)