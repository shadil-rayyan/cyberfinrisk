from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import uuid

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    plan = Column(String, default="free", nullable=False) # e.g., 'free', 'pro', 'enterprise'
    creator_uuid = Column(String, ForeignKey("users.uuid"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")
    groups = relationship("Group", back_populates="organization", cascade="all, delete-orphan")

class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    user_uuid = Column(String, ForeignKey("users.uuid"), nullable=False)
    role = Column(String, default="member", nullable=False) # e.g., 'admin', 'member'
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    organization = relationship("Organization", back_populates="members")
    user = relationship("User")


class Group(Base):
    __tablename__ = "groups"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    creator_uuid = Column(String, ForeignKey("users.uuid"), nullable=False)
    auto_scan = Column(Boolean, default=True, nullable=False)
    enforce_policies = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    organization = relationship("Organization", back_populates="groups")
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")


class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(String, ForeignKey("groups.id"), nullable=False)
    user_uuid = Column(String, ForeignKey("users.uuid"), nullable=False)
    role = Column(String, default="member", nullable=False)  # 'admin', 'member'
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    group = relationship("Group", back_populates="members")
    user = relationship("User")


class OrgInvite(Base):
    __tablename__ = "org_invites"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    invited_email = Column(String, nullable=False, index=True)
    inviter_uuid = Column(String, ForeignKey("users.uuid"), nullable=False)
    role = Column(String, default="member", nullable=False)
    token = Column(String, unique=True, default=lambda: str(uuid.uuid4()), nullable=False)
    status = Column(String, default="pending", nullable=False)  # 'pending', 'accepted', 'expired'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    organization = relationship("Organization")
    inviter = relationship("User", foreign_keys=[inviter_uuid])
