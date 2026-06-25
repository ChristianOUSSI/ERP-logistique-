# app/models/user.py  Modèle User pour Authentification
import enum
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


class Role(str, enum.Enum):
    ADMIN = "admin"
    DISPATCHER = "dispatcher"
    FINANCE = "finance"
    DOUANE = "douane"
    GATE_AGENT = "gate_agent"


class User(BaseModel):
    __tablename__ = "users"
    
    Role = Role

    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(200))
    role: Mapped[Role] = mapped_column(String(20), default=Role.GATE_AGENT)
    
    # Clé étrangère pour le multi-tenancy
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id"), nullable=False)
    agency = relationship("Agency", back_populates="users")

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # MFA fields
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    mfa_secret: Mapped[str] = mapped_column(String(255), nullable=True)
    mfa_backup_codes: Mapped[str] = mapped_column(String(1000), nullable=True)  # JSON string
