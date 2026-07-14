from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "ATS Resume Screening"
    APP_VERSION: str = "1.0.0"

    DEBUG: bool = False

    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "ats_db"
    DB_USER: str = "root"
    DB_PASSWORD: str = "root"

    DATABASE_URL: str | None = None

    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"


settings = Settings()