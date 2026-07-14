from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import Token, UserLogin, UserRegister, UserResponse


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register(self, data: UserRegister) -> UserResponse:
        if self.user_repo.get_by_email(data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        role = self.user_repo.get_role_by_name(data.role.value.capitalize())
        if not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role",
            )

        user = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hash_password(data.password),
            role_id=role.id,
        )
        created = self.user_repo.create(user)

        return UserResponse(
            id=created.id,
            full_name=created.full_name,
            email=created.email,
            role=role.name,
            is_active=created.is_active,
        )

    def login(self, data: UserLogin) -> Token:
        user = self.user_repo.get_by_email(data.email)

        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is inactive",
            )

        access_token = create_access_token({"sub": str(user.id)})
        return Token(access_token=access_token)
