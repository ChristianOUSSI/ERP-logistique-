# app/config.py  Configuration Pydantic Settings KAMLOG
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Configuration centrale KAMLOG EM-ERP."""
    
    # Application
    APP_NAME: str = "KAMLOG EM-ERP"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database
    DB_NAME: str = "kamlog_erp"
    DB_USER: str = "kamlog"
    DB_PASSWORD: str = "kamlog_secret"
    DATABASE_URL: str = "postgresql+asyncpg://kamlog:kamlog_secret@localhost:5432/kamlog_erp"
    
    # Redis
    REDIS_PASSWORD: str = "redis_secret"
    REDIS_URL: str = "redis://:redis_secret@localhost:6379/0"
    
    # JWT Auth
    JWT_SECRET_KEY: str = "CHANGE_ME_super_secret_jwt_key_min_32_chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # MinIO
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "kamlog_minio"
    MINIO_SECRET_KEY: str = "minio_secret_2026"
    MINIO_BUCKET_DOCUMENTS: str = "kamlog-documents"
    MINIO_SECURE: bool = False
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "noreply@kamlog.cm"
    SMTP_PASSWORD: str = "CHANGE_ME_email_password"
    SMTP_FROM: str = "KAMLOG ERP <noreply@kamlog.cm>"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "https://kamlog-erp.cm"]
    
    # Celery
    CELERY_BROKER_URL: str = "redis://:redis_secret@localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://:redis_secret@localhost:6379/2"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
