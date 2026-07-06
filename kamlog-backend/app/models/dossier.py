# app/models/dossier.py  Dossiers Opérationnels de Service (Inspiration SAP SD/LE)
import enum
from sqlalchemy import String, Boolean, Text, ForeignKey, Index, Table, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel, Base


# ─── Énumérations ─────────────────────────────────────────────

class RegimeDouane(str, enum.Enum):
    """Régimes douaniers camerounais"""
    IM4_MISE_A_LA_CONSOMMATION = "IM4_MISE_A_LA_CONSOMMATION"
    EX1_EXPORT = "EX1_EXPORT"
    TR8_TRANSIT_INTERNATIONAL = "TR8_TRANSIT_INTERNATIONAL"
    AT_ADMISSION_TEMPORAIRE = "AT_ADMISSION_TEMPORAIRE"


class StatutDossier(str, enum.Enum):
    """Cycle de vie du dossier d'exploitation"""
    OUVERT = "OUVERT"
    EN_COURS = "EN_COURS"
    EN_ATTENTE_DOCUMENTS = "EN_ATTENTE_DOCUMENTS"
    DEDOUANE = "DEDOUANE"        # Spécifique transit (BAE obtenu)
    LIVRE = "LIVRE"              # Spécifique transport/manutention
    FACTURE = "FACTURE"
    CLOTURE = "CLOTURE"


class TypeServiceConcerne(str, enum.Enum):
    """Le module KAMLOG qui pilote ce dossier"""
    K_ACCONAGE = "K-ACCONAGE"
    K_TRANSIT = "K-TRANSIT"
    K_TRANSPORT = "K-TRANSPORT"
    K_MANUTENTION = "K-MANUTENTION"


# ─── Table de liaison Many-to-Many : Dossier ↔ Marchandise ───

contenu_dossier_marchandises = Table(
    "contenu_dossier_marchandises",
    Base.metadata,
    # colonnes
    # Note : On utilise Integer car BaseModel utilise des ID entiers auto-incrémentés
    # (pas d'UUID ici pour rester cohérent avec le BaseModel existant)
    # Si migration vers UUID à l'avenir, ces clés seront mises à jour.
    # Pour l'instant on garde la cohérence avec le reste de l'application.
    # La spec originale utilisait UUID mais on s'adapte à l'architecture existante.
    # Le comportement RESTRICT est conservé.
    # Le CASCADE sur dossier_id supprime les associations si le dossier est supprimé.
    # Le RESTRICT sur marchandise_id empêche de supprimer une marchandise engagée.
    *[
        # Workaround: define columns inline
    ]
)

# Note: SQLAlchemy Table() approach above is tricky with our setup.
# Let's use an Association model instead for clarity.


class ContenuDossierMarchandise(BaseModel):
    """
    Table de liaison Many-to-Many entre Dossiers et Marchandises.
    ON DELETE CASCADE sur dossier : si un dossier est supprimé, les associations disparaissent.
    ON DELETE RESTRICT sur marchandise : empêche de supprimer une marchandise engagée dans un dossier.
    """
    __tablename__ = "contenu_dossier_marchandises"

    dossier_id: Mapped[int] = mapped_column(
        ForeignKey("dossiers_operationnels.id", ondelete="CASCADE"),
        nullable=False
    )
    marchandise_id: Mapped[int] = mapped_column(
        ForeignKey("marchandises.id", ondelete="RESTRICT"),
        nullable=False
    )

    # Relations
    dossier = relationship("DossierOperationnel", back_populates="contenus")
    marchandise = relationship("Marchandise")

    __table_args__ = (
        Index("idx_contenu_dossier", "dossier_id"),
        Index("idx_contenu_marchandise", "marchandise_id"),
    )


# ─── Modèle Principal ─────────────────────────────────────────

class DossierOperationnel(BaseModel):
    """
    Dossier Opérationnel de Service (Inspiration SAP SD/LE).
    Point d'entrée unique pour tous les services KAMLOG.
    Un dossier lie un client (Tiers) à ses marchandises à travers un service précis.
    """
    __tablename__ = "dossiers_operationnels"

    numero_dossier: Mapped[str] = mapped_column(
        String(30), unique=True, nullable=False, index=True,
        comment="Format KAMLOG: KAM-2026-TR-0001"
    )

    # ── LIAISONS MAÎTRES ──────────────────────────────────────────
    tiers_id: Mapped[int] = mapped_column(
        ForeignKey("tiers.id", ondelete="RESTRICT"),
        nullable=False,
        comment="Le client KAMLOG propriétaire du dossier"
    )
    escale_id: Mapped[int | None] = mapped_column(
        ForeignKey("escales.id", ondelete="SET NULL"),
        nullable=True,
        comment="Nullable si service purement terrestre"
    )

    # ── ORIENTATION PAR SERVICE UNIQUE ─────────────────────────────
    type_service_concerne: Mapped[str] = mapped_column(
        String(30), nullable=False,
        comment="K-ACCONAGE, K-TRANSIT, K-TRANSPORT, K-MANUTENTION"
    )

    # ── COMPOSANTE DOCUMENTAIRE ET DOUANE (K-Transit) ─────────────
    numero_bl_connaissement: Mapped[str | None] = mapped_column(String(50))
    regime_douane: Mapped[str | None] = mapped_column(String(50))
    numero_declaration_sydonia: Mapped[str | None] = mapped_column(
        String(50), comment="Numéro d'enregistrement douane camerounaise"
    )
    bon_a_enlever_obtenu: Mapped[bool] = mapped_column(
        Boolean, default=False,
        comment="Feu vert douane (BAE)"
    )

    # ── STATUT & CRÉATEUR ─────────────────────────────────────────
    statut_general: Mapped[str] = mapped_column(
        String(30), default="OUVERT"
    )
    # Compatibilité avec l'ancien champ
    statut: Mapped[str] = mapped_column(String(30), default="OUVERT")
    reference: Mapped[str | None] = mapped_column(
        String(50), unique=True, nullable=True, index=True,
        comment="Alias de numero_dossier pour compatibilité"
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    createur_identifiant: Mapped[str | None] = mapped_column(
        String(50), comment="ID de l'agent KAMLOG qui a ouvert le dossier"
    )

    # ── RELATIONS ─────────────────────────────────────────────────
    tiers = relationship("Tiers", back_populates="dossiers")
    escale = relationship("Escale", back_populates="dossiers")
    contenus = relationship(
        "ContenuDossierMarchandise", back_populates="dossier",
        cascade="all, delete-orphan"
    )
    factures = relationship("Facture", back_populates="dossier")

    # ── INDEX ─────────────────────────────────────────────────────
    __table_args__ = (
        Index("idx_dossiers_numero", "numero_dossier"),
        Index("idx_dossiers_service", "type_service_concerne"),
        Index("idx_dossiers_tiers", "tiers_id"),
    )
