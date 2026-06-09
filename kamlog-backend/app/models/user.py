# app/models/user.py  Modèle User pour Authentification
import enum
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel


class Role(str, enum.Enum):
    ADMIN = "admin"
    DISPATCHER = "dispatcher"
    FINANCE = "finance"
    DOUANE = "douane"
    GATE_AGENT = "gate_agent"


class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(200))
    role: Mapped[Role] = mapped_column(String(20), default=Role.GATE_AGENT)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # MFA fields
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    mfa_secret: Mapped[str] = mapped_column(String(255), nullable=True)
    mfa_backup_codes: Mapped[str] = mapped_column(String(1000), nullable=True)  # JSON string
