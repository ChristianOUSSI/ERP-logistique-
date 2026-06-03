# app/models/parc.py — Modèles K-Parc (Yard Management)
import enum
from sqlalchemy import String, Integer, ForeignKey, Index, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel


class StatutEmplacement(str, enum.Enum):
    LIBRE = "LIBRE"
    OCCUPE = "OCCUPE"
    RESERVE = "RESERVE"
    MAINTENANCE = "MAINTENANCE"


class ZoneParc(BaseModel):
    __tablename__ = "zones_parc"

    code_zone: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    nom_zone: Mapped[str] = mapped_column(String(100))
    type_zone: Mapped[str] = mapped_column(String(50))  # CONTENEURS, VRAC, CONVENTIONNEL
    capacite_evp: Mapped[int] = mapped_column(Integer)
    description: Mapped[str | None] = mapped_column(String(500))


class EmplacementParc(BaseModel):
    __tablename__ = "emplacements_parc"

    code_emplacement: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    zone_id: Mapped[int] = mapped_column(ForeignKey('zones_parc.id'))
    rangee: Mapped[str] = mapped_column(String(10))
    bay: Mapped[int] = mapped_column(Integer)
    tier: Mapped[int] = mapped_column(Integer)
    statut: Mapped[StatutEmplacement] = mapped_column(default=StatutEmplacement.LIBRE)

    __table_args__ = (Index("ix_emplacements_zone", "zone_id"), Index("ix_emplacements_statut", "statut"))


class StockPhysiqueParc(BaseModel):
    __tablename__ = "stock_physique_parc"

    numero_conteneur: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    emplacement_id: Mapped[int] = mapped_column(ForeignKey('emplacements_parc.id'))
    type_conteneur: Mapped[str] = mapped_column(String(20))  # 20, 40, 45
    etat: Mapped[str] = mapped_column(String(20))  # BON, ENDOMMAGE, SALE
    poids_tare_kg: Mapped[int | None] = mapped_column(Integer)
    date_gate_in: Mapped[DateTime] = mapped_column(DateTime(timezone=True))
    date_gate_out: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True))


class MouvementParc(BaseModel):
    __tablename__ = "mouvements_parc"

    reference: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    conteneur_id: Mapped[int] = mapped_column(ForeignKey('stock_physique_parc.id'))
    type_mouvement: Mapped[str] = mapped_column(String(20))  # GATE_IN, GATE_OUT, RELOCATION
    emplacement_source_id: Mapped[int | None] = mapped_column(ForeignKey('emplacements_parc.id'))
    emplacement_dest_id: Mapped[int | None] = mapped_column(ForeignKey('emplacements_parc.id'))
    date_mouvement: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
    operateur_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    notes: Mapped[str | None] = mapped_column(String(500))
