from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        unique=True,
        nullable=False
    )

    resume_skills = relationship(
        "ResumeSkill",
        back_populates="skill",
        cascade="all, delete-orphan"
    )

    job_skills = relationship(
        "JobSkill",
        back_populates="skill",
        cascade="all, delete-orphan"
    )