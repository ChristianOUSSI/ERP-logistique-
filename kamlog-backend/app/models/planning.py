# app/models/planning.py  K-Planning Global KAMLOG (Inspiration SAP PP)
import enum
from decimal import Decimal
from sqlalchemy import String, Numeric, Text, ForeignKey, Index, DateTime, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


# ─── Énumérations ─────────────────────────────────────────────

class DepartementKamlog(str, enum.Enum):
    """Département KAMLOG qui planifie"""
    ACCONAGE = "ACCONAGE"
    TRANSIT = "TRANSIT"
    TRANSPORT = "TRANSPORT"
    PARC_YARD = "PARC_YARD"
    APPROVISIONNEMENT = "APPROVISIONNEMENT"


class StatutPlan(str, enum.Enum):
    """Statut de validation de la planification"""
    BROUILLON_PREVISIONNEL = "BROUILLON_PREVISIONNEL"
    CONFIRME_PLANIFIE = "CONFIRME_PLANIFIE"
    EN_COURS_EXECUTION = "EN_COURS_EXECUTION"
    TERMINE = "TERMINE"
    ANNULE = "ANNULE"


# ─── TABLE A : Plan de Charge Global ─────────────────────────

class PlanningGlobal(BaseModel):
    """
    Le cœur du module K-Planning (SAP PP).
    Chaque plan de charge correspond à une demande de prestation planifiée
    pour un département donné, liée à un dossier opérationnel client.
    """
    __tablename__ = "planning_global"

    code_plan: Mapped[str] = mapped_column(
        String(30), unique=True, nullable=False, index=True,
        comment="Ex: PLN-KAM-2026-00512"
    )

    # Origine de la demande
    departement_concerne: Mapped[DepartementKamlog] = mapped_column(nullable=False)
    dossier_id: Mapped[int] = mapped_column(
        ForeignKey("dossiers_operationnels.id", ondelete="RESTRICT"),
        nullable=False,
        comment="Lien vers le dossier opérationnel du client"
    )

    # Fenêtre temporelle planifiée
    date_heure_debut_prevue: Mapped[str] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    date_heure_fin_prevue: Mapped[str] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    # Objectif
    description_objectif: Mapped[str] = mapped_column(
        Text, nullable=False,
        comment="Ex: Décharger 500T clinker, Livrer Garoua"
    )
    statut_validation: Mapped[StatutPlan] = mapped_column(
        default=StatutPlan.BROUILLON_PREVISIONNEL, nullable=False
    )

    # ── RELATIONS ─────────────────────────────────────────────────
    dossier = relationship("DossierOperationnel")
    ressources = relationship(
        "PlanningRessource", back_populates="planning",
        cascade="all, delete-orphan"
    )
    cotation = relationship(
        "PlanningCotation", back_populates="planning",
        uselist=False, cascade="all, delete-orphan"
    )

    # ── CONTRAINTES ───────────────────────────────────────────────
    __table_args__ = (
        CheckConstraint(
            "date_heure_fin_prevue > date_heure_debut_prevue",
            name="chk_dates_coherentes"
        ),
        Index("idx_planning_departement", "departement_concerne"),
        Index("idx_planning_dates", "date_heure_debut_prevue", "date_heure_fin_prevue"),
    )


# ─── TABLE B : Allocation Prévisionnelle des Ressources ───────

class PlanningRessource(BaseModel):
    """
    Allocation matérielle et humaine pour un plan de charge.
    Camions (Transport), Emplacements (Parc), Engins de quai (Acconage).
    """
    __tablename__ = "planning_ressources_allouees"

    planning_global_id: Mapped[int] = mapped_column(
        ForeignKey("planning_global.id", ondelete="CASCADE"),
        nullable=False
    )

    # Allocation Matérielle
    camion_id: Mapped[int | None] = mapped_column(
        ForeignKey("camions_flotte.id", ondelete="RESTRICT"),
        comment="Si département TRANSPORT"
    )
    emplacement_parc_id: Mapped[int | None] = mapped_column(
        ForeignKey("emplacements_parc.id", ondelete="RESTRICT"),
        comment="Si département PARC (Réservation de place)"
    )
    identifiant_engin_quai: Mapped[str | None] = mapped_column(
        String(30),
        comment="Si ACCONAGE/MANUTENTION (ex: Portique P01)"
    )

    # Allocation Humaine
    brigade_ou_shift_nom: Mapped[str] = mapped_column(
        String(50), nullable=False,
        comment="Ex: Équipe A, Chauffeur NDI, Agent Transit TOKO"
    )

    # ── RELATIONS ─────────────────────────────────────────────────
    planning = relationship("PlanningGlobal", back_populates="ressources")


# ─── TABLE C : Pré-Cotation & Estimation Budgétaire ──────────

class PlanningCotation(BaseModel):
    """
    Pré-cotation (tarification planifiée).
    Permet de figer les tarifs et coûts AVANT l'exécution.
    Inspiration SAP SD/CO.
    """
    __tablename__ = "planning_cotations"

    planning_global_id: Mapped[int] = mapped_column(
        ForeignKey("planning_global.id", ondelete="CASCADE"),
        unique=True, nullable=False,
        comment="Une cotation par plan de charge"
    )

    # Volet Chiffre d'Affaires Planifié (Ventes)
    montant_estime_recette: Mapped[Decimal] = mapped_column(
        Numeric(15, 2), default=0.00,
        comment="Ce que le client va payer (XAF)"
    )

    # Volet Coût de Revient Planifié (Contrôle de gestion SAP CO)
    cout_carburant_prevu: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), default=0.00
    )
    cout_manutention_prevu: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), default=0.00
    )
    cout_sous_traitance_prevu: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), default=0.00
    )

    devise: Mapped[str] = mapped_column(String(3), default="XAF")

    # ── RELATIONS ─────────────────────────────────────────────────
    planning = relationship("PlanningGlobal", back_populates="cotation")
