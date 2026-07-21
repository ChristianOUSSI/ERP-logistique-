import os
from typing import List, Optional

class Settings:
    PROJECT_NAME: str = "KAMLOG EM-ERP"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "kamlog-secret-key-super-secure-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./kamlog_erp.db")
    SEED_DATA: bool = os.getenv("SEED_DATA", "false").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

settings = Settings()
