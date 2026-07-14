from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.models.resume_skill import ResumeSkill
from app.models.skill import Skill
from typing import List

class ResumeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_master_skills(self) -> List[str]:
        skills = self.db.query(Skill).all()
        # Seed common skills if the table is completely empty
        if not skills:
            common = ["python", "java", "c++", "sql", "mysql", "fastapi", "react", "node", "aws", "docker", "git", "github", "machine learning"]
            for s in common:
                self.db.add(Skill(name=s))
            self.db.commit()
            skills = self.db.query(Skill).all()
        return [skill.name.lower() for skill in skills]

    def get_by_id(self, resume_id: int) -> Resume:
        return self.db.query(Resume).filter(Resume.id == resume_id).first()

    def get_by_user(self, user_id: int) -> List[Resume]:
        return self.db.query(Resume).filter(Resume.user_id == user_id).all()

    def create(self, user_id: int, file_name: str, file_path: str, skills: List[str]) -> Resume:
        db_resume = Resume(user_id=user_id, file_name=file_name, file_path=file_path)
        self.db.add(db_resume)
        self.db.flush()

        for skill_name in skills:
            skill = self.db.query(Skill).filter(Skill.name == skill_name).first()
            if not skill:
                skill = Skill(name=skill_name)
                self.db.add(skill)
                self.db.flush()
            resume_skill = ResumeSkill(resume_id=db_resume.id, skill_id=skill.id)
            self.db.add(resume_skill)
            
        self.db.commit()
        self.db.refresh(db_resume)
        return db_resume

    def delete(self, resume_id: int):
        resume = self.get_by_id(resume_id)
        if resume:
            self.db.delete(resume)
            self.db.commit()
