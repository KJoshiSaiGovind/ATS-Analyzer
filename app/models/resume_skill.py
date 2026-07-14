from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class ResumeSkill(Base):
    __tablename__ = "resume_skills"

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id", ondelete="CASCADE"),
        primary_key=True
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True
    )

    resume = relationship(
        "Resume",
        back_populates="resume_skills"
    )

    skill = relationship(
        "Skill",
        back_populates="resume_skills"
    )