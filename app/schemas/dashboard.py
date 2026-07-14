from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DashboardResponse(BaseModel):
    resume_status: str
    resume_name: Optional[str]
    upload_date: Optional[datetime]
    detected_skills: List[str]
    recommended_roles: List[str]
    last_ats_score: Optional[float]
    last_matched_skills: List[str]
    last_missing_skills: List[str]
    last_suggestions: List[str]
