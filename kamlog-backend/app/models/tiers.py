# app/models/tiers.py  Modèle SQLAlchemy Tiers (Refonte SAP-Style)
import enum
from decimal import Decimal
from sqlalchemy import String, Boolean, Numeric, Text, Integer, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


class StatutTiers(str, enum.Enum):
    EN_ATTENTE_VALIDATION = "EN_ATTENTE_VALIDATION"
    ACTIF = "ACTIF"
    BLOQUE = "BLOQUE"


class Tiers(BaseModel):
    """
    Table maîtresse des Tiers (Clients, Fournisseurs, Partenaires).
    Porte la logique multi-service à la carte.
    Inspiration : SAP Business Partner (BP) + spécifications KAMLOG.
    """
    __tablename__ = "tiers"

    # ── IDENTIFIANTS UNIQUE SYSTÈME ET MÉTIER ─────────────────────
    code_tiers: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False, index=True
    )

    # ── INFORMATIONS LÉGALES (Standard Cameroun / SYSCOHADA) ──────
    raison_sociale: Mapped[str] = mapped_column(String(150), nullable=False)
    sigle_ou_enseigne: Mapped[str | None] = mapped_column(String(50))
    registre_commerce: Mapped[str | None] = mapped_column(String(50))
    # NIU = Numéro Identifiant Unique (Impératif au Cameroun)
    niu: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, comment="NIU fiscal obligatoire"
    )
    # Alias pour compatibilité avec l'ancien champ rccm
    rccm: Mapped[str | None] = mapped_column(String(50))
    regime_fiscal: Mapped[str] = mapped_column(
        String(100), default="Réel - Grandes Entreprises"
    )

    # ── COORDONNÉES & LOCALISATION ────────────────────────────────
    adresse_physique: Mapped[str | None] = mapped_column(Text)
    # Alias pour compatibilité
    adresse: Mapped[str | None] = mapped_column(Text)
    ville: Mapped[str] = mapped_column(String(50), default="Douala")
    pays: Mapped[str] = mapped_column(String(50), default="Cameroun")
    telephone: Mapped[str | None] = mapped_column(
        String(25), comment="Téléphone principal"
    )
    email: Mapped[str | None] = mapped_column(String(100), unique=True)

    # ── CONFIGURATION DES SERVICES À LA CARTE ────────────────────
    autorise_acconage: Mapped[bool] = mapped_column(Boolean, default=False)
    autorise_transit: Mapped[bool] = mapped_column(Boolean, default=False)
    autorise_parc_stockage: Mapped[bool] = mapped_column(Boolean, default=False)
    autorise_manutention: Mapped[bool] = mapped_column(Boolean, default=False)
    autorise_transport: Mapped[bool] = mapped_column(Boolean, default=False)
    # Alias magasinage → parc_stockage pour compatibilité
    autorise_magasinage: Mapped[bool] = mapped_column(Boolean, default=False)

    # ── PARAMÈTRES COMPTABLES & FINANCIERS (SAP FI) ───────────────
    compte_collectif_syscohada: Mapped[str] = mapped_column(
        String(15), default="411100", comment="Compte client SYSCOHADA par défaut"
    )
    # Alias
    compte_syscohada: Mapped[str | None] = mapped_column(String(20))
    limite_credit_maximum: Mapped[Decimal] = mapped_column(
        Numeric(15, 2), default=0.00, comment="Limite de crédit en XAF"
    )
    # Alias
    limite_credit_xaf: Mapped[Decimal] = mapped_column(Numeric(15, 0), default=0)
    delai_paiement_jours: Mapped[int] = mapped_column(
        Integer, default=30, comment="Nombre de jours avant échéance"
    )

    # ── STATUT & AUDIT ────────────────────────────────────────────
    statut: Mapped[StatutTiers] = mapped_column(
        default=StatutTiers.ACTIF, nullable=False
    )

    # ── RELATIONS ─────────────────────────────────────────────────
    marchandises = relationship("Marchandise", back_populates="proprietaire", lazy="dynamic")
    dossiers = relationship("DossierOperationnel", back_populates="tiers", lazy="dynamic")
    factures = relationship("Facture", back_populates="tiers", lazy="dynamic")

    # ── INDEX POUR RECHERCHES RAPIDES ─────────────────────────────
    __table_args__ = (
        Index("ix_tiers_niu", "niu"),
        Index("ix_tiers_statut", "statut"),
        Index("ix_tiers_code", "code_tiers"),
    )
