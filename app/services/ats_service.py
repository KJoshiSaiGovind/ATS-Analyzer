from fastapi import HTTPException
from typing import List
from app.schemas.ats import AtsAnalyzeRequest, AtsAnalyzeResponse
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.repositories.resume_repository import ResumeRepository
from app.services.resume_service import ResumeService
from sqlalchemy.orm import Session

class AtsService:
    def __init__(self, db: Session):
        self.db = db
        self.resume_repo = ResumeRepository(db)
        self.resume_service = ResumeService(self.resume_repo)

    def analyze(self, data: AtsAnalyzeRequest, current_user: User) -> AtsAnalyzeResponse:
        # Get Candidate's Latest Resume
        resumes = self.resume_repo.get_by_user(current_user.id)
        if not resumes:
            raise HTTPException(status_code=400, detail="Please upload a resume first.")
        
        latest_resume = resumes[-1] 
        resume_skills_set = set([rs.skill.name.lower() for rs in latest_resume.resume_skills])
        
        # Extract skills from job description
        req_skills_list = self.resume_service.extract_skills(data.job_description)
        req_skills_set = set(req_skills_list)
        
        if not req_skills_set:
            score = 100.0
            matched = resume_skills_set
            missing = set()
            suggestions = ["No specific technical skills detected in the job description."]
        else:
            matched = req_skills_set.intersection(resume_skills_set)
            missing = req_skills_set.difference(resume_skills_set)
            score = (len(matched) / len(req_skills_set)) * 100.0
            score = round(score, 2)
            suggestions = [f"Learn {ms.title()}" for ms in missing]
            
        # Store Job History (Using recruiter_id as candidate_id to avoid migration overhead)
        db_job = Job(
            title="Analysis",
            description=data.job_description,
            recruiter_id=current_user.id  
        )
        self.db.add(db_job)
        self.db.commit()
        self.db.refresh(db_job)

        # Store Application History (which holds ats_score)
        db_app = Application(
            user_id=current_user.id,
            job_id=db_job.id,
            resume_id=latest_resume.id,
            ats_score=score,
            status="Analyzed"
        )
        self.db.add(db_app)
        self.db.commit()

        return AtsAnalyzeResponse(
            ats_score=score,
            matched_skills=list(matched),
            missing_skills=list(missing),
            suggestions=suggestions
        )
