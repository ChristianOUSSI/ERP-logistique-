from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from typing import List, Optional
import json


class Settings(BaseSettings):
    """Configuration centrale KAMLOG EM-ERP."""

    # Application
    APP_NAME: str = "KAMLOG EM-ERP"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Business Logic
    TVA_RATE: str = "0.1925"  # 19.25%
    CURRENCY: str = "XAF"

    # Database
    DB_NAME: str = "kamlog_erp"
    DB_USER: str = "kamlog"
    DB_PASSWORD: str = Field(default="", description="Database password (optional si DATABASE_URL fourni)")
    DATABASE_URL: str = Field(..., description="Database URL required")

    # Redis - optionnel (Railway fournit REDIS_URL automatiquement)
    REDIS_PASSWORD: str = Field(default="", description="Redis password (optional si REDIS_URL fourni)")
    REDIS_URL: str = Field(default="redis://localhost:6379/0", description="Redis URL")

    # JWT Auth
    JWT_SECRET_KEY: str = Field(..., min_length=32, description="JWT secret key must be at least 32 characters")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # MinIO - optionnel en production Railway
    MINIO_ENABLED: bool = Field(default=True, description="Activer MinIO pour le stockage PDF")
    MINIO_ENDPOINT: str = Field(default="localhost:9000", description="MinIO endpoint")
    MINIO_ACCESS_KEY: str = Field(default="kamlog_minio", description="MinIO access key")
    MINIO_SECRET_KEY: str = Field(default="", description="MinIO secret key (optionnel)")
    MINIO_BUCKET_DOCUMENTS: str = "kamlog-documents"
    MINIO_SECURE: bool = False

    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "noreply@kamlog.cm"
    SMTP_PASSWORD: str = Field(default="", description="SMTP password (optional)")
    SMTP_FROM: str = "KAMLOG ERP <noreply@kamlog.cm>"

    # CORS
    ALLOWED_ORIGINS: str | List[str] = "http://localhost:3000,https://kamlog-erp.cm,https://kamlog.vercel.app"

    # Celery - optionnel, utilise REDIS_URL par défaut
    CELERY_BROKER_URL: str = Field(default="", description="Celery broker URL")
    CELERY_RESULT_BACKEND: str = Field(default="", description="Celery result backend")

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            cleaned = v.strip()
            if cleaned.startswith("'") and cleaned.endswith("'"):
                cleaned = cleaned[1:-1].strip()
            if cleaned.startswith('"') and cleaned.endswith('"'):
                cleaned = cleaned[1:-1].strip()
            try:
                parsed = json.loads(cleaned)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                pass
            if "," in cleaned:
                return [x.strip() for x in cleaned.split(",") if x.strip()]
            if cleaned.startswith("[") and cleaned.endswith("]"):
                cleaned = cleaned[1:-1].strip()
                return [x.strip().strip('"').strip("'") for x in cleaned.split(",") if x.strip()]
            return [cleaned]
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Adapter DATABASE_URL pour asyncpg si nécessaire
        if self.DATABASE_URL and self.DATABASE_URL.startswith("postgresql://"):
            object.__setattr__(
                self,
                "DATABASE_URL",
                self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
            )
        # Si MINIO_SECRET_KEY vide, désactiver MinIO automatiquement
        if not self.MINIO_SECRET_KEY:
            object.__setattr__(self, "MINIO_ENABLED", False)
        # Celery par défaut sur REDIS_URL si non configuré
        if not self.CELERY_BROKER_URL and self.REDIS_URL:
            object.__setattr__(self, "CELERY_BROKER_URL", self.REDIS_URL)
        if not self.CELERY_RESULT_BACKEND and self.REDIS_URL:
            object.__setattr__(self, "CELERY_RESULT_BACKEND", self.REDIS_URL)
        self._validate_secrets()

    def _validate_secrets(self):
        """Valide que les secrets ne sont pas les valeurs par défaut insécurisées."""
        dangerous_defaults = [
            ("CHANGE_ME", "JWT_SECRET_KEY"),
        ]
        for default_value, field_name in dangerous_defaults:
            field_value = getattr(self, field_name, None)
            if field_value and default_value in str(field_value):
                raise ValueError(
                    f"SECURITY WARNING: {field_name} contient une valeur par défaut non sécurisée. "
                    f"Veuillez changer '{default_value}' par une valeur sécurisée."
                )


settings = Settings()
