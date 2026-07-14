from pydantic import BaseModel
from typing import List

class AtsAnalyzeRequest(BaseModel):
    job_description: str

class AtsAnalyzeResponse(BaseModel):
    ats_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    suggestions: List[str]
