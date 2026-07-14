from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, require_roles
from app.schemas.ats import AtsAnalyzeRequest, AtsAnalyzeResponse
from app.services.ats_service import AtsService
from app.models.user import User

router = APIRouter(prefix="/ats", tags=["ATS Analysis"])

def get_ats_service(db: Session = Depends(get_db)) -> AtsService:
    return AtsService(db)

@router.post("/analyze", response_model=AtsAnalyzeResponse)
def analyze_resume(
    data: AtsAnalyzeRequest,
    current_user: User = Depends(require_roles("Candidate")),
    ats_service: AtsService = Depends(get_ats_service)
):
    return ats_service.analyze(data, current_user)
