# app/models/agency.py - Modèle pour les agences (multi-tenancy)
from sqlalchemy import String, Boolean, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.models.base import BaseModel


class Agency(BaseModel):
    __tablename__ = "agencies"

    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    nom: Mapped[str] = mapped_column(String(200), nullable=False)
    adresse: Mapped[str] = mapped_column(String(500), nullable=True)
    ville: Mapped[str] = mapped_column(String(100), nullable=True)
    pays: Mapped[str] = mapped_column(String(100), default="Cameroun")
    telephone: Mapped[str] = mapped_column(String(20), nullable=True)
    email: Mapped[str] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    date_creation: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    date_modification: Mapped[DateTime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    # Relations
    users = relationship("User", back_populates="agency")
    audit_logs = relationship("AuditLog", back_populates="agency")
