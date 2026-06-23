# app/models/dossier.py - Modèle pour les dossiers opérationnels (Transit / Transport)
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel


class DossierOperationnel(BaseModel):
    __tablename__ = "dossiers_operationnels"

    reference: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    statut: Mapped[str] = mapped_column(String(30), default="OUVERT")
