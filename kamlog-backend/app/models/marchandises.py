# app/models/marchandises.py  Table Polymorphe des Marchandises KAMLOG
# Inspiration : Architecture SAP flexible + spécifications KAMLOG
import enum
from decimal import Decimal
from sqlalchemy import String, Numeric, Integer, Text, ForeignKey, Index, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


# ─── Énumérations ─────────────────────────────────────────────

class TypeMarchandise(str, enum.Enum):
    """Classification de la nature de la marchandise"""
    CONTENEUR = "CONTENEUR"
    VRAC_SOLIDE = "VRAC_SOLIDE"
    VRAC_LIQUIDE = "VRAC_LIQUIDE"
    CONVENTIONNEL_VEHICULE = "CONVENTIONNEL_VEHICULE"
    CONVENTIONNEL_PALETTE = "CONVENTIONNEL_PALETTE"


class UniteMesureFacturation(str, enum.Enum):
    """Unités de mesure pour facturation et pesage"""
    EVP = "EVP"                 # Equivalent Vingt Pieds (conteneurs)
    TONNE = "TONNE"             # Vrac ou colis lourds
    METRE_CUBE = "METRE_CUBE"   # Vrac liquide ou cubage
    UNITE_PIECE = "UNITE_PIECE" # Véhicules, palettes uniques


# ─── Modèle Principal ─────────────────────────────────────────

class Marchandise(BaseModel):
    """
    Table racine polymorphe des marchandises.
    Gère conteneurs, vrac solide/liquide, conventionnel.
    Le champ JSONB `specifications_techniques` stocke les détails
    spécifiques sans saturer la table de colonnes vides.

    Exemples JSONB :
      CONTENEUR  : {"taille": "40", "type": "REEFER", "temperature_cible": -18}
      VÉHICULE   : {"marque": "Toyota", "modele": "Hilux", "couleur": "Blanc"}
      VRAC LIQ   : {"densite": 0.85, "point_eclair": 55}
    """
    __tablename__ = "marchandises"

    # ── LIAISON CLIENT (Obligatoire) ──────────────────────────────
    tiers_id: Mapped[int] = mapped_column(
        ForeignKey("tiers.id", ondelete="RESTRICT"),
        nullable=False,
        comment="Qui possède cette marchandise ?"
    )

    # ── TYPOLOGIE ET CLASSIFICATION ───────────────────────────────
    nature_marchandise: Mapped[TypeMarchandise] = mapped_column(nullable=False)
    code_sh: Mapped[str | None] = mapped_column(
        String(10), comment="Code Système Harmonisé (Douane)"
    )
    description_commerciale: Mapped[str] = mapped_column(
        Text, nullable=False,
        comment="Ex: Ciment Clinker, Cacao en fèves"
    )

    # ── IDENTIFIANT UNIQUE DE TERRAIN (Clé métier) ────────────────
    identifiant_metier: Mapped[str | None] = mapped_column(
        String(50), index=True,
        comment="N° conteneur (MSKU1234567) ou N° châssis (VIN)"
    )

    # ── PARAMÈTRES DE MESURE ET VOLUMÉTRIE ────────────────────────
    poids_brut_declare: Mapped[Decimal] = mapped_column(
        Numeric(12, 3), nullable=False,
        comment="En Tonnes ou KG (doc transport)"
    )
    poids_net_verifie: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 3),
        comment="Issu du pesage physique / Pont-Bascule KAMLOG"
    )
    volume_m3: Mapped[Decimal | None] = mapped_column(
        Numeric(18, 4),
        comment="Crucial pour le vrac liquide et le conventionnel"
    )
    nombre_colis: Mapped[int] = mapped_column(
        Integer, default=1,
        comment="Nombre de pièces (ex: 20 palettes)"
    )
    unite_facturation: Mapped[UniteMesureFacturation] = mapped_column(nullable=False)

    # ── EXTENSION POLYMORPHE (JSONB) ──────────────────────────────
    specifications_techniques: Mapped[dict | None] = mapped_column(
        JSON, default={},
        comment="Détails spécifiques selon la nature (Reefer, véhicule, etc.)"
    )

    # ── RELATIONS ─────────────────────────────────────────────────
    proprietaire = relationship("Tiers", back_populates="marchandises")

    # ── INDEX POUR RECHERCHES RAPIDES ─────────────────────────────
    __table_args__ = (
        Index("idx_marchandises_identifiant", "identifiant_metier"),
        Index("idx_marchandises_nature", "nature_marchandise"),
        Index("idx_marchandises_tiers", "tiers_id"),
    )
