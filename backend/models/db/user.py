from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    uuid = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    tokens = relationship("PersonalAccessToken", back_populates="user", cascade="all, delete-orphan")

class PersonalAccessToken(Base):
    __tablename__ = "personal_access_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_uuid = Column(String, ForeignKey("users.uuid"), nullable=False)
    name = Column(String, nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="tokens")
