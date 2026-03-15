from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from models.company import CompanyContext


class ProjectCreate(BaseModel):
    """Payload when saving a new project after scan."""
    repo_url: str
    branch: str = "main"
    company: CompanyContext
    org_id: str
    group_id: str
    created_by: str  # user UUID
    gemini_api_key: Optional[str] = None


class ProjectSummary(BaseModel):
    """Lightweight project view for list endpoints."""
    id: str
    repo_url: str
    branch: str
    org_id: str
    group_id: str
    created_by: str
    created_at: str
    last_scanned_at: Optional[str] = None
    status: str  # "scanning", "completed", "failed"
    vulnerability_count: int = 0
    total_expected_loss: float = 0
    total_fix_cost: float = 0
    gemini_enabled: bool = False


class ProjectDetail(ProjectSummary):
    """Full project including scan results and report."""
    company: dict = {}
    scan_results: list = []
    attack_chains: list = []
    executive_summary: str = ""
    filtered_count: int = 0
