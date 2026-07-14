from fastapi import APIRouter, Depends, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, require_roles, get_current_user
from app.models.user import User
from app.schemas.resume import ResumeResponse
from app.repositories.resume_repository import ResumeRepository
from app.services.resume_service import ResumeService

router = APIRouter(prefix="/resumes", tags=["Resumes"])

def get_resume_service(db: Session = Depends(get_db)) -> ResumeService:
    return ResumeService(ResumeRepository(db))

@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(require_roles("Candidate")),
    resume_service: ResumeService = Depends(get_resume_service)
):
    return resume_service.upload_resume(file, current_user)

@router.get("/me", response_model=List[ResumeResponse])
def get_my_resumes(
    current_user: User = Depends(require_roles("Candidate")),
    resume_service: ResumeService = Depends(get_resume_service)
):
    return resume_service.get_my_resumes(current_user)

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    resume_service: ResumeService = Depends(get_resume_service)
):
    return resume_service.get_resume(resume_id, current_user)

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: int,
    current_user: User = Depends(require_roles("Candidate")),
    resume_service: ResumeService = Depends(get_resume_service)
):
    resume_service.delete_resume(resume_id, current_user)
