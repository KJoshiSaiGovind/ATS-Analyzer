from sqlalchemy.orm import Session
from app.models.user import User
from app.models.resume import Resume
from app.models.application import Application
from app.models.job import Job
from app.schemas.dashboard import DashboardResponse
from app.services.resume_service import ResumeService
from app.repositories.resume_repository import ResumeRepository

ROLE_MAPPINGS = {
    "Backend Developer": ["python", "java", "node", "fastapi", "sql", "mysql", "aws", "docker"],
    "Frontend Developer": ["react", "javascript", "html", "css", "vue"],
    "Data Scientist": ["python", "machine learning", "data analysis", "sql", "r"],
    "DevOps Engineer": ["docker", "kubernetes", "aws", "git", "linux", "github"],
    "Full Stack Developer": ["python", "react", "javascript", "sql", "node", "html", "css"]
}

class DashboardService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard(self, current_user: User) -> DashboardResponse:
        # Get latest resume
        resume = self.db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).first()
        
        if not resume:
            return DashboardResponse(
                resume_status="Not Uploaded",
                resume_name=None,
                upload_date=None,
                detected_skills=[],
                recommended_roles=[],
                last_ats_score=None,
                last_matched_skills=[],
                last_missing_skills=[],
                last_suggestions=[]
            )
            
        detected_skills = [rs.skill.name for rs in resume.resume_skills]
        
        # Calculate recommended roles
        recommended_roles = []
        user_skills_set = set([s.lower() for s in detected_skills])
        for role, required in ROLE_MAPPINGS.items():
            req_set = set(required)
            overlap = req_set.intersection(user_skills_set)
            if len(overlap) >= 2: # At least 2 matching skills
                recommended_roles.append(role)
        
        # Get latest analysis from Application history
        app = self.db.query(Application).filter(Application.user_id == current_user.id).order_by(Application.id.desc()).first()
        
        last_ats_score = None
        last_matched_skills = []
        last_missing_skills = []
        last_suggestions = []
        
        if app:
            last_ats_score = app.ats_score
            job = self.db.query(Job).filter(Job.id == app.job_id).first()
            if job:
                # Recalculate missing/matched on the fly for the dashboard
                resume_service = ResumeService(ResumeRepository(self.db))
                req_skills = set(resume_service.extract_skills(job.description))
                res_skills = set([s.lower() for s in detected_skills])
                
                matched = req_skills.intersection(res_skills)
                missing = req_skills.difference(res_skills)
                
                last_matched_skills = list(matched)
                last_missing_skills = list(missing)
                last_suggestions = [f"Learn {ms.title()}" for ms in missing]
                
        return DashboardResponse(
            resume_status="Uploaded",
            resume_name=resume.file_name,
            upload_date=resume.created_at,
            detected_skills=detected_skills,
            recommended_roles=recommended_roles,
            last_ats_score=last_ats_score,
            last_matched_skills=last_matched_skills,
            last_missing_skills=last_missing_skills,
            last_suggestions=last_suggestions
        )
