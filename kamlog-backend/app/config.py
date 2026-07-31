import os
from typing import List, Optional

class Settings:
    PROJECT_NAME: str = "EVO-LOG SaaS Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "evo-log-secret-key-super-secure-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./evo_log_erp.db")
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", None)
    SEED_DATA: bool = os.getenv("SEED_DATA", "false").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

settings = Settings()
