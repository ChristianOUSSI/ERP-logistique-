# app/models/finance.py  Modèles K-Finance
import enum
from decimal import Decimal
from sqlalchemy import String, Numeric, Text, ForeignKey, Index, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel


class StatutFacture(str, enum.Enum):
    BROUILLON = "BROUILLON"
    EMISE = "EMISE"
    PARTIELLEMENT_PAYEE = "PARTIELLEMENT_PAYEE"
    PAYEE = "PAYEE"
    ANNULEE = "ANNULEE"


class Facture(BaseModel):
    __tablename__ = "factures"

    numero_facture: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    tiers_id: Mapped[int] = mapped_column(ForeignKey('tiers.id'))
    dossier_id: Mapped[int | None] = mapped_column(ForeignKey('dossiers_operationnels.id'))
    mission_id: Mapped[int | None] = mapped_column(ForeignKey('missions_transport.id'))

    montant_ht_xaf: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    tva_xaf: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    montant_ttc_xaf: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)

    date_emission: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
    date_echeance: Mapped[DateTime] = mapped_column(DateTime(timezone=True))
    statut: Mapped[StatutFacture] = mapped_column(default=StatutFacture.BROUILLON)
    notes: Mapped[str | None] = mapped_column(Text)

    __table_args__ = (Index("ix_factures_statut", "statut"), Index("ix_factures_tiers", "tiers_id"))


class Encaissement(BaseModel):
    __tablename__ = "encaissements"

    reference: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    tiers_id: Mapped[int] = mapped_column(ForeignKey('tiers.id'))
    facture_id: Mapped[int | None] = mapped_column(ForeignKey('factures.id'))

    montant_xaf: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    mode_paiement: Mapped[str] = mapped_column(String(50))  # VIREMENT, ESPECES, MOBILE_MONEY
    date_paiement: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
    reference_paiement: Mapped[str | None] = mapped_column(String(100))
    lettree: Mapped[bool] = mapped_column(default=False)
    notes: Mapped[str | None] = mapped_column(Text)


class GrilleTarifaire(BaseModel):
    __tablename__ = "grilles_tarifaires"

    code_tarif: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    tiers_id: Mapped[int | None] = mapped_column(ForeignKey('tiers.id'))
    service: Mapped[str] = mapped_column(String(50))  # TRANSPORT, TRANSIT, ACCONAGE, MAGASINAGE
    type_marchandise: Mapped[str] = mapped_column(String(50))
    tarif_unitaire_xaf: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    unite: Mapped[str] = mapped_column(String(20))  # KM, TONNE, EVP, HEURE
    date_debut_validite: Mapped[DateTime] = mapped_column(DateTime(timezone=True))
    date_fin_validite: Mapped[DateTime] = mapped_column(DateTime(timezone=True))
