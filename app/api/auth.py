from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_roles
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import Token, UserLogin, UserRegister, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(UserRepository(db))


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: UserRegister,
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.register(data)


@router.post("/login", response_model=Token)
def login(
    data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.login(data)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        role=current_user.role.name,
        is_active=current_user.is_active,
    )


@router.get("/recruiter-only")
def recruiter_only(current_user: User = Depends(require_roles("Recruiter"))):
    return {"message": f"Hello Recruiter {current_user.full_name}"}
