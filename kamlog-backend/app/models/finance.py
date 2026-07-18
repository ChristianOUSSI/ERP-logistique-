# app/models/finance.py  K-Finance & Controlling (Inspiration SAP FICO / SYSCOHADA)
import enum
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Numeric, Text, ForeignKey, Index, DateTime, Date, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


# ─── Énumérations ─────────────────────────────────────────────

class StatutFacture(str, enum.Enum):
    PROFORMA = "PROFORMA"
    BROUILLON = "BROUILLON"
    EMISE = "EMISE"
    VALIDEE_NON_PAYEE = "VALIDEE_NON_PAYEE"
    PARTIELLEMENT_PAYEE = "PARTIELLEMENT_PAYEE"
    PAYE_PARTIEL = "PAYE_PARTIEL"
    PAYE_TOTAL = "PAYE_TOTAL"
    PAYEE = "PAYEE"
    ANNULEE = "ANNULEE"


class ModePaiement(str, enum.Enum):
    VIREMENT_BANCAIRE = "VIREMENT_BANCAIRE"
    CHEQUE = "CHEQUE"
    ESPECES = "ESPECES"
    MOBILE_MONEY = "MOBILE_MONEY"
    COMPTE_CREDIT_INTERNE = "COMPTE_CREDIT_INTERNE"


# ─── TABLE A : Grilles Tarifaires Contractuelles ──────────────

class GrilleTarifaire(BaseModel):
    """
    Grilles tarifaires des contrats clients.
    Inspiration SAP SD - Condition Records.
    """
    __tablename__ = "grilles_tarifaires"

    tiers_id: Mapped[int | None] = mapped_column(
        ForeignKey("tiers.id", ondelete="RESTRICT")
    )

    # Nature du service facturable
    code_prestation: Mapped[str] = mapped_column(
        String(30), nullable=False,
        comment="Ex: MANUT_DECHARG_20, TRANSP_DLA_YDE, MAGASINAGE_PALIER_1"
    )
    # Alias compatibilité
    code_tarif: Mapped[str | None] = mapped_column(String(20), unique=True)
    description_prestation: Mapped[str | None] = mapped_column(String(150))
    # Alias compatibilité
    service: Mapped[str | None] = mapped_column(String(50))
    type_marchandise: Mapped[str | None] = mapped_column(String(50))

    # Modèle de prix
    tarif_unitaire_xaf: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )
    unite_application: Mapped[str | None] = mapped_column(
        String(20), comment="PAR_CONTENEUR, PAR_TONNE, PAR_JOUR"
    )
    # Alias compatibilité
    unite: Mapped[str | None] = mapped_column(String(20))

    # Moteur de tarification complexe (Surcharges)
    pourcentage_surcharge_matiere_dangereuse: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), default=0.0, comment="En %")
    montant_surcharge_fixe: Mapped[Decimal | None] = mapped_column(Numeric(18, 4), default=0.0)
    devise: Mapped[str] = mapped_column(String(3), default="XAF")

    date_debut_validite: Mapped[str | None] = mapped_column(DateTime(timezone=True))
    date_fin_validite: Mapped[str | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (
        CheckConstraint(
            "date_fin_validite >= date_debut_validite",
            name="chk_dates_tarif"
        ),
    )


# ─── TABLE B : Entête des Factures ────────────────────────────

class Facture(BaseModel):
    """
    Entête de facture (Inspiration SAP FI-AR - Accounts Receivable).
    Calcul automatique du magasinage par paliers de tarification.
    """
    __tablename__ = "factures"

    numero_facture: Mapped[str] = mapped_column(
        String(30), unique=True, nullable=False,
        comment="Ex: FAC-KAMLOG-2026-0001"
    )

    # Liaisons d'origines
    tiers_id: Mapped[int] = mapped_column(
        ForeignKey("tiers.id", ondelete="RESTRICT")
    )
    dossier_id: Mapped[int | None] = mapped_column(
        ForeignKey("dossiers_operationnels.id", ondelete="SET NULL"),
        comment="Nullable si facturation directe hors dossier lourd"
    )
    mission_id: Mapped[int | None] = mapped_column(
        ForeignKey("missions_transport.id", ondelete="CASCADE")
    )

    statut: Mapped[StatutFacture] = mapped_column(
        default=StatutFacture.PROFORMA
    )
    # Alias compatibilité
    statut_facture: Mapped[str | None] = mapped_column(String(30))

    # Montants financiers (Francs CFA)
    montant_ht_xaf: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False, default=0.00
    )
    montant_tva: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), default=0.00,
        comment="Généralement 19.25% au Cameroun"
    )
    # Alias
    tva_xaf: Mapped[Decimal] = mapped_column(Numeric(18, 4), default=0.00)
    montant_ttc_xaf: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False, default=0.00
    )

    date_emission: Mapped[str | None] = mapped_column(DateTime(timezone=True))
    date_echeance: Mapped[str | None] = mapped_column(DateTime(timezone=True))
    notes: Mapped[str | None] = mapped_column(Text)

    # ── RELATIONS ─────────────────────────────────────────────────
    tiers = relationship("Tiers", back_populates="factures")
    dossier = relationship("DossierOperationnel", back_populates="factures")
    lignes = relationship(
        "FactureLigne", back_populates="facture",
        cascade="all, delete-orphan"
    )
    encaissements = relationship("Encaissement", back_populates="facture")
    ecritures = relationship("EcritureComptable", back_populates="facture")

    __table_args__ = (
        Index("idx_factures_statut", "statut"),
        Index("ix_factures_tiers", "tiers_id"),
    )


# ─── TABLE C : Lignes de Détails de la Facture ───────────────

class FactureLigne(BaseModel):
    """
    Lignes de détails de la facture (calcul par prestations).
    """
    __tablename__ = "facture_lignes"

    facture_id: Mapped[int] = mapped_column(
        ForeignKey("factures.id", ondelete="CASCADE"), nullable=False
    )
    grille_tarifaire_id: Mapped[int | None] = mapped_column(
        ForeignKey("grilles_tarifaires.id", ondelete="SET NULL"),
        comment="Optionnel, si tarif hors contrat standard"
    )

    code_prestation: Mapped[str] = mapped_column(String(30), nullable=False)
    quantite: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False,
        comment="Ex: 1.000 conteneur, ou 45.500 tonnes"
    )
    prix_unitaire_applique: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )
    
    # Détails Surcharges (Rate Engine)
    montant_surcharge: Mapped[Decimal] = mapped_column(Numeric(18, 4), default=0.0)
    taux_surcharge_applique: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True, comment="En %")
    
    montant_ligne_ht: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )

    # ── RELATIONS ─────────────────────────────────────────────────
    facture = relationship("Facture", back_populates="lignes")


# ─── TABLE D : Encaissements ─────────────────────────────────

class Encaissement(BaseModel):
    """
    Journal des règlements et encaissements.
    """
    __tablename__ = "encaissements"

    facture_id: Mapped[int] = mapped_column(
        ForeignKey("factures.id", ondelete="RESTRICT"), nullable=False
    )
    tiers_id: Mapped[int | None] = mapped_column(ForeignKey("tiers.id", ondelete="CASCADE"))

    mode_paiement: Mapped[str] = mapped_column(
        String(50), nullable=False,
        comment="VIREMENT, ESPECES, MOBILE_MONEY, CHEQUE"
    )
    reference_paiement: Mapped[str | None] = mapped_column(
        String(100), comment="N° chèque, ID Orange/MTN Money, Réf virement"
    )
    # Alias compatibilité
    reference: Mapped[str | None] = mapped_column(String(30), unique=True)
    montant_encaisse: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )
    # Alias
    montant_xaf: Mapped[Decimal | None] = mapped_column(Numeric(18, 4))
    date_paiement: Mapped[str | None] = mapped_column(DateTime(timezone=True))
    lettree: Mapped[bool] = mapped_column(default=False)
    notes: Mapped[str | None] = mapped_column(Text)

    # ── RELATIONS ─────────────────────────────────────────────────
    facture = relationship("Facture", back_populates="encaissements")
    tiers = relationship("Tiers")


# ─── TABLE E : Grand Livre Comptable (SAP CO - Controlling) ──

class EcritureComptable(BaseModel):
    """
    Grand Livre Comptable Intégré.
    Cœur de SAP CO - Controlling.
    RÈGLE ABSOLUE : Σ(Débit) = Σ(Crédit) pour chaque facture.
    """
    __tablename__ = "ecritures_comptables"

    facture_id: Mapped[int] = mapped_column(
        ForeignKey("factures.id", ondelete="RESTRICT"), nullable=False
    )

    numero_compte_syscohada: Mapped[str] = mapped_column(
        String(15), nullable=False,
        comment="Ex: 411100 (Client), 706000 (Prestation de services)"
    )
    sens_mouvement: Mapped[str] = mapped_column(
        String(6), nullable=False,
        comment="DEBIT ou CREDIT"
    )
    montant: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )

    date_comptabilisation: Mapped[str | None] = mapped_column(
        DateTime(timezone=True)
    )

    # ── RELATIONS ─────────────────────────────────────────────────
    facture = relationship("Facture", back_populates="ecritures")

    __table_args__ = (
        CheckConstraint(
            "sens_mouvement IN ('DEBIT', 'CREDIT')",
            name="chk_sens"
        ),
        Index("idx_ecritures_compte", "numero_compte_syscohada"),
    )


# ─── Avoir (conservé de l'existant) ──────────────────────────

class Avoir(BaseModel):
    __tablename__ = "avoirs"

    numero_avoir: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    facture_origine_id: Mapped[int | None] = mapped_column(ForeignKey("factures.id", ondelete="CASCADE"))
    tiers_id: Mapped[int] = mapped_column(ForeignKey("tiers.id", ondelete="CASCADE"))
    montant_xaf: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    motif: Mapped[str] = mapped_column(String(500), nullable=False)
    est_utilise: Mapped[bool] = mapped_column(default=False)
    cree_par: Mapped[str | None] = mapped_column(String(100))
    date_emission: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
