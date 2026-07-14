from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    file_name = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=False)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="resumes"
    )

    resume_skills = relationship(
        "ResumeSkill",
        back_populates="resume",
        cascade="all, delete-orphan"
    )