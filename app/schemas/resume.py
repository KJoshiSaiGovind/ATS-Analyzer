from pydantic import BaseModel
from typing import List
from datetime import datetime

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    file_name: str
    skills: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True
