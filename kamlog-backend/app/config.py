# app/config.py  Configuration Pydantic Settings KAMLOG
from pydantic_settings import BaseSettings, Field
from typing import List


class Settings(BaseSettings):
    """Configuration centrale KAMLOG EM-ERP."""
    
    # Application
    APP_NAME: str = "KAMLOG EM-ERP"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Business Logic
    TVA_RATE: str = "0.1925" # 19.25%
    CURRENCY: str = "XAF"

    # Database
    DB_NAME: str = "kamlog_erp"
    DB_USER: str = "kamlog"
    DB_PASSWORD: str = Field(..., description="Database password required")
    DATABASE_URL: str = Field(..., description="Database URL required")
    
    # Redis
    REDIS_PASSWORD: str = Field(..., description="Redis password required")
    REDIS_URL: str = Field(..., description="Redis URL required")
    
    # JWT Auth
    JWT_SECRET_KEY: str = Field(..., min_length=32, description="JWT secret key must be at least 32 characters")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # MinIO
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = Field(..., description="MinIO access key required")
    MINIO_SECRET_KEY: str = Field(..., description="MinIO secret key required")
    MINIO_BUCKET_DOCUMENTS: str = "kamlog-documents"
    MINIO_SECURE: bool = False
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "noreply@kamlog.cm"
    SMTP_PASSWORD: str = Field(default="", description="SMTP password (optional)")
    SMTP_FROM: str = "KAMLOG ERP <noreply@kamlog.cm>"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "https://kamlog-erp.cm"]
    
    # Celery
    CELERY_BROKER_URL: str = Field(..., description="Celery broker URL required")
    CELERY_RESULT_BACKEND: str = Field(..., description="Celery result backend required")
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._validate_secrets()
    
    def _validate_secrets(self):
        """Valide que les secrets ne sont pas les valeurs par défaut."""
        default_values = [
            ("CHANGE_ME", "JWT_SECRET_KEY"),
            ("CHANGE_ME", "DB_PASSWORD"),
            ("CHANGE_ME", "REDIS_PASSWORD"),
            ("CHANGE_ME", "MINIO_SECRET_KEY"),
            ("kamlog_secret", "DB_PASSWORD"),
            ("redis_secret", "REDIS_PASSWORD"),
            ("minio_secret_2026", "MINIO_SECRET_KEY"),
        ]
        
        for default_value, field_name in default_values:
            field_value = getattr(self, field_name, None)
            if field_value and default_value in str(field_value):
                raise ValueError(
                    f"SECURITY WARNING: {field_name} contient une valeur par défaut non sécurisée. "
                    f"Veuillez changer '{default_value}' par une valeur sécurisée dans votre fichier .env"
                )


settings = Settings()
