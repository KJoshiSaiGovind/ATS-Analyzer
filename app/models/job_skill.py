from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class JobSkill(Base):
    __tablename__ = "job_skills"

    job_id = Column(
        Integer,
        ForeignKey("jobs.id", ondelete="CASCADE"),
        primary_key=True
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True
    )

    job = relationship(
        "Job",
        back_populates="job_skills"
    )

    skill = relationship(
        "Skill",
        back_populates="job_skills"
    )
