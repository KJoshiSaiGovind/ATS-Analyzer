import os
import shutil
import PyPDF2
from fastapi import UploadFile, HTTPException, status
from typing import List
from app.repositories.resume_repository import ResumeRepository
from app.schemas.resume import ResumeResponse
from app.models.user import User

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class ResumeService:
    def __init__(self, resume_repository: ResumeRepository):
        self.resume_repository = resume_repository

    def extract_text_from_pdf(self, file_path: str) -> str:
        text = ""
        try:
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() or ""
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text

    def normalize_text(self, text: str) -> str:
        text = text.lower()
        # Replace common punctuation with spaces to ensure clean word boundaries
        for char in [',', '.', ';', ':', '(', ')', '[', ']', '{', '}', '/', '\n', '\t']:
            text = text.replace(char, ' ')
        return text

    def extract_skills(self, text: str) -> List[str]:
        normalized_text = self.normalize_text(text)
        master_skills = self.resume_repository.get_all_master_skills()
        
        # Pad with spaces to perform exact word boundary matching 
        # (e.g. preventing 'c' from matching inside 'react')
        padded_text = f" {normalized_text} "
        
        found_skills = []
        for skill in master_skills:
            if f" {skill} " in padded_text:
                found_skills.append(skill)
                
        return found_skills

    def upload_resume(self, file: UploadFile, current_user: User) -> ResumeResponse:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
            
        file_location = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")
        
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        text = self.extract_text_from_pdf(file_location)
        skills = self.extract_skills(text)
        
        resume = self.resume_repository.create(
            user_id=current_user.id,
            file_name=file.filename,
            file_path=file_location,
            skills=skills
        )
        return self._to_response(resume)

    def get_my_resumes(self, current_user: User) -> List[ResumeResponse]:
        resumes = self.resume_repository.get_by_user(current_user.id)
        return [self._to_response(r) for r in resumes]

    def get_resume(self, resume_id: int, current_user: User) -> ResumeResponse:
        resume = self.resume_repository.get_by_id(resume_id)
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        if resume.user_id != current_user.id and current_user.role.name != "Recruiter":
            raise HTTPException(status_code=403, detail="Not authorized")
        return self._to_response(resume)

    def delete_resume(self, resume_id: int, current_user: User):
        resume = self.resume_repository.get_by_id(resume_id)
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        if resume.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
            
        if os.path.exists(resume.file_path):
            os.remove(resume.file_path)
            
        self.resume_repository.delete(resume_id)

    def _to_response(self, resume) -> ResumeResponse:
        skills = [rs.skill.name for rs in resume.resume_skills] if resume.resume_skills else []
        return ResumeResponse(
            id=resume.id,
            user_id=resume.user_id,
            file_name=resume.file_name,
            skills=skills,
            created_at=resume.created_at
        )
