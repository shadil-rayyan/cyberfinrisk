from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OrganizationBase(BaseModel):
    name: str
    slug: str
    plan: str = "free"

class OrganizationCreate(OrganizationBase):
    creator_uuid: str

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    plan: Optional[str] = None

class OrganizationMemberBase(BaseModel):
    user_uuid: str
    role: str = "member"

# ── Group Schemas ────────────────────────────────────────────────────────────

class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class GroupCreate(GroupBase):
    org_id: str
    creator_uuid: str

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    auto_scan: Optional[bool] = None
    enforce_policies: Optional[bool] = None

class GroupResponse(GroupBase):
    id: str
    org_id: str
    creator_uuid: str
    auto_scan: bool
    enforce_policies: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class GroupMemberResponse(BaseModel):
    id: int
    group_id: str
    user_uuid: str
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True

# ── Org Schemas (with groups) ────────────────────────────────────────────────

class OrganizationResponse(OrganizationBase):
    id: str
    creator_uuid: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    groups: List[GroupResponse] = []

    class Config:
        from_attributes = True

class OrganizationMemberResponse(OrganizationMemberBase):
    id: int
    org_id: str
    joined_at: datetime

    class Config:
        from_attributes = True

# ── Member with User Info ────────────────────────────────────────────────────

class MemberResponse(BaseModel):
    id: int
    org_id: str
    user_uuid: str
    role: str
    joined_at: datetime
    # hydrated from User join
    email: Optional[str] = None
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

# ── Invite Schemas ───────────────────────────────────────────────────────────

class OrgInviteCreate(BaseModel):
    invited_email: str
    inviter_uuid: str
    role: str = "member"

class OrgInviteResponse(BaseModel):
    id: str
    org_id: str
    invited_email: str
    inviter_uuid: str
    role: str
    token: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Notification Schemas ─────────────────────────────────────────────────────

class NotificationResponse(BaseModel):
    id: str
    user_uuid: str
    type: str
    title: str
    body: Optional[str] = None
    is_read: bool
    link: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
