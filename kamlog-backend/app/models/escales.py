# app/models/escales.py  Escales Maritimes (Inspiration Navis N4)
import enum
from sqlalchemy import String, DateTime, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


class StatutEscale(str, enum.Enum):
    ANNONCE = "ANNONCE"
    A_QUAI = "A_QUAI"
    PARTI = "PARTI"


class Escale(BaseModel):
    """
    Table des Escales Maritimes.
    Chaque escale représente un navire faisant escale au port de Douala ou Kribi.
    Contrainte UNIQUE sur (code_imo, numero_voyage) pour empêcher les doublons.
    """
    __tablename__ = "escales"

    nom_navire: Mapped[str] = mapped_column(String(100), nullable=False)
    code_imo: Mapped[str] = mapped_column(
        String(7), nullable=False, index=True,
        comment="Code international unique du navire (7 chiffres)"
    )
    numero_voyage: Mapped[str] = mapped_column(
        String(20), nullable=False,
        comment="Ex: V-2026-A"
    )
    quai_assigne: Mapped[str] = mapped_column(
        String(10), default="Q01",
        comment="Emplacement au Port de Douala/Kribi"
    )

    date_arrivee_prevue: Mapped[str] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    date_accostage_reel: Mapped[str | None] = mapped_column(
        DateTime(timezone=True)
    )
    date_depart_reel: Mapped[str | None] = mapped_column(
        DateTime(timezone=True)
    )

    statut_escale: Mapped[StatutEscale] = mapped_column(
        default=StatutEscale.ANNONCE, nullable=False
    )

    # ── RELATIONS ─────────────────────────────────────────────────
    dossiers = relationship("DossierOperationnel", back_populates="escale")

    # ── CONTRAINTES ───────────────────────────────────────────────
    __table_args__ = (
        UniqueConstraint("code_imo", "numero_voyage", name="uq_navire_voyage"),
        Index("idx_escales_imo", "code_imo"),
    )
