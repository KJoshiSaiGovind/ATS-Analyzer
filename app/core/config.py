from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str

    DEBUG: bool

    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "ats_db"
    DB_USER: str = "root"
    DB_PASSWORD: str = "root"

    DATABASE_URL: str | None = None

    SECRET_KEY: str
    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"


settings = Settings()