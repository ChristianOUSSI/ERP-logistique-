# app/models/parc.py  Modèles K-Parc (Yard & Warehouse Management - Inspiration Navis N4)
import enum
from decimal import Decimal
from sqlalchemy import String, Integer, Numeric, ForeignKey, Index, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


# ─── Énumérations ─────────────────────────────────────────────

class TypeZoneParc(str, enum.Enum):
    ZONE_CONTENEURS = "ZONE_CONTENEURS"
    ZONE_VRAC_SOLIDE = "ZONE_VRAC_SOLIDE"
    ZONE_VRAC_LIQUIDE = "ZONE_VRAC_LIQUIDE"
    HANGAR_CONVENTIONNEL = "HANGAR_CONVENTIONNEL"


class StatutEmplacement(str, enum.Enum):
    LIBRE = "LIBRE"
    OCCUPE = "OCCUPE"
    RESERVE_PLANIFIE = "RESERVE_PLANIFIE"
    MAINTENANCE = "MAINTENANCE"


class TypeMouvementParc(str, enum.Enum):
    ENTREE_GATE = "ENTREE_GATE"
    RECONSOLIDATION = "RECONSOLIDATION"
    VISITE_DOUANE = "VISITE_DOUANE"
    SORTIE_GATE = "SORTIE_GATE"


# ─── TABLE A : Zones Physiques du Parc ────────────────────────

class ZoneParc(BaseModel):
    """
    Définition des zones physiques du parc KAMLOG.
    Chaque zone a un type (conteneurs, vrac, hangar) et une capacité.
    """
    __tablename__ = "zones_parc"

    code_zone: Mapped[str] = mapped_column(
        String(10), unique=True, nullable=False,
        comment="Ex: BLOC-A, SILO-NORD, HANGAR-02"
    )
    nom_zone: Mapped[str] = mapped_column(String(100), nullable=False)
    type_zone: Mapped[TypeZoneParc] = mapped_column(nullable=False)
    capacite_maximale_evp: Mapped[int | None] = mapped_column(
        Integer, comment="Uniquement si ZONE_CONTENEURS"
    )
    # Ajout pour le vrac et conventionnel
    capacite_maximale_tonnes: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2), comment="Si Vrac / Conventionnel"
    )
    # Anciens alias compatibilité
    capacite_evp: Mapped[int | None] = mapped_column(Integer)
    description: Mapped[str | None] = mapped_column(String(500))
    est_active: Mapped[bool] = mapped_column(default=True)


# ─── TABLE B : Emplacements (Grille 3D & Alvéoles) ───────────

class EmplacementParc(BaseModel):
    """
    Cartographie fine des emplacements.
    Format d'adresse universel KAMLOG :
      - Conteneurs : "A-04-02-3" (Bloc A, Bay 04, Row 02, Tier 3)
      - Hangar    : "H02-Z05" (Hangar 02, Zone 05 au sol)
    """
    __tablename__ = "emplacements_parc"

    zone_id: Mapped[int] = mapped_column(
        ForeignKey("zones_parc.id", ondelete="RESTRICT"), nullable=False
    )
    code_emplacement: Mapped[str] = mapped_column(
        String(30), unique=True, nullable=False
    )

    # Coordonnées cartésiennes 3D (Zone Conteneurs - Logique Navis N4)
    bay: Mapped[int | None] = mapped_column(
        Integer, comment="Position longitudinale"
    )
    row: Mapped[int | None] = mapped_column(
        Integer, comment="Position transversale"
    )
    # Anciens alias
    rangee: Mapped[str | None] = mapped_column(String(10))
    tier: Mapped[int | None] = mapped_column(
        Integer, comment="Position verticale (hauteur d'empilement)"
    )

    statut: Mapped[StatutEmplacement] = mapped_column(
        default=StatutEmplacement.LIBRE
    )

    __table_args__ = (
        Index("idx_emplacements_coords", "bay", "row", "tier"),
        Index("ix_emplacements_zone", "zone_id"),
        Index("ix_emplacements_statut", "statut"),
    )


# ─── TABLE C : Stock Physique du Parc ─────────────────────────

class StockPhysiqueParc(BaseModel):
    """
    Inventaire physique du parc en temps réel.
    Une marchandise spécifique ne peut être qu'à un seul endroit à la fois (UNIQUE).
    """
    __tablename__ = "stock_physique_parc"

    emplacement_id: Mapped[int] = mapped_column(
        ForeignKey("emplacements_parc.id", ondelete="RESTRICT"), nullable=False
    )
    marchandise_id: Mapped[int | None] = mapped_column(
        ForeignKey("marchandises.id", ondelete="RESTRICT"), unique=True,
        comment="Une marchandise à un seul endroit à la fois"
    )
    dossier_id: Mapped[int | None] = mapped_column(
        ForeignKey("dossiers_operationnels.id", ondelete="RESTRICT"),
        comment="Lien direct avec le dossier opérationnel client"
    )

    # Anciens champs conservés pour compatibilité
    numero_conteneur: Mapped[str | None] = mapped_column(String(20), unique=True)
    type_conteneur: Mapped[str | None] = mapped_column(String(20))
    etat: Mapped[str | None] = mapped_column(String(20))
    poids_tare_kg: Mapped[int | None] = mapped_column(Integer)
    date_gate_in: Mapped[str | None] = mapped_column(DateTime(timezone=True))
    date_gate_out: Mapped[str | None] = mapped_column(DateTime(timezone=True))

    quantite_stockee: Mapped[Decimal] = mapped_column(
        Numeric(12, 3), default=1.000,
        comment="1 pour conteneur/véhicule, ou X tonnes/m³ pour le vrac"
    )

    __table_args__ = (
        Index("idx_stock_marchandise", "marchandise_id"),
        Index("idx_stock_emplacement", "emplacement_id"),
    )


# ─── TABLE D : Historique Immuable des Mouvements ─────────────

class MouvementParc(BaseModel):
    """
    Historique immuable des mouvements de parc (Track & Trace).
    Sert de preuve en cas de litige commercial.
    RÈGLE : Uniquement des INSERT. Les UPDATE/DELETE sont INTERDITS.
    """
    __tablename__ = "mouvements_parc"

    marchandise_id: Mapped[int | None] = mapped_column(
        ForeignKey("marchandises.id", ondelete="RESTRICT")
    )
    type_mouvement: Mapped[str] = mapped_column(String(20), nullable=False)

    # Traçabilité origine ↔ destination
    emplacement_source_id: Mapped[int | None] = mapped_column(
        ForeignKey("emplacements_parc.id"),
        comment="NULL si entrée initiale (Gate In)"
    )
    emplacement_dest_id: Mapped[int | None] = mapped_column(
        ForeignKey("emplacements_parc.id"),
        comment="NULL si sortie définitive (Gate Out)"
    )

    quantite_deplacee: Mapped[Decimal] = mapped_column(
        Numeric(12, 3), default=1.000
    )
    engin_identifiant: Mapped[str | None] = mapped_column(
        String(30), comment="ID du Reach Stacker, élévateur ou grue"
    )
    operateur_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    operateur_identifiant: Mapped[str | None] = mapped_column(
        String(50), comment="ID de l'agent ou du cariste"
    )
    date_mouvement: Mapped[str | None] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    # Anciens champs conservés pour compatibilité
    reference: Mapped[str | None] = mapped_column(String(30), unique=True)
    conteneur_id: Mapped[int | None] = mapped_column(
        ForeignKey("stock_physique_parc.id")
    )
    notes: Mapped[str | None] = mapped_column(String(500))

    __table_args__ = (
        Index("idx_mvmt_date", "date_mouvement"),
        Index("idx_mvmt_marchandise", "marchandise_id"),
    )


# ─── Réparations Atelier (conservé de l'existant) ─────────────

class ReparationAtelier(BaseModel):
    __tablename__ = "reparations_atelier"

    reference: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    camion_id: Mapped[int] = mapped_column(Integer, nullable=False)
    type_intervention: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(String(500))
    statut: Mapped[str] = mapped_column(String(30), default="EN_ATTENTE")
    cout_estime: Mapped[int | None] = mapped_column(Integer)
    date_entree: Mapped[str] = mapped_column(String(50))
    date_sortie_prevue: Mapped[str | None] = mapped_column(String(50))
    mecanicien_en_charge: Mapped[str | None] = mapped_column(String(100))
