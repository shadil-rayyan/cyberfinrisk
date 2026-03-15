from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OrganizationBase(BaseModel):
    name: str
    slug: str
    plan: str = "free"

class OrganizationCreate(OrganizationBase):
    creator_uuid: str

class OrganizationMemberBase(BaseModel):
    user_uuid: str
    role: str = "member"

class OrganizationResponse(OrganizationBase):
    id: str
    creator_uuid: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class OrganizationMemberResponse(OrganizationMemberBase):
    id: int
    org_id: str
    joined_at: datetime

    class Config:
        from_attributes = True
