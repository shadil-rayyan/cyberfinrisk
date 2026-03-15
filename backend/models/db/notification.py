from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import uuid


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_uuid = Column(String, ForeignKey("users.uuid"), nullable=False)
    type = Column(String, default="info", nullable=False)  # 'invite', 'info', 'alert'
    title = Column(String, nullable=False)
    body = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    link = Column(String, nullable=True)  # optional deeplink
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
