# app/models/documents_sortants.py  Documents Sortants KAMLOG
# Bon de Livraison, Interchange, Lettre de Voiture, Ticket Pont-Bascule
import enum
from sqlalchemy import String, Integer, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


class TypeDocument(str, enum.Enum):
    """Types de documents officiels KAMLOG"""
    BON_DE_LIVRAISON = "BON_DE_LIVRAISON"
    INTERCHANGE_OUT = "INTERCHANGE_OUT"  # Reçu d'échange conteneur (Navis N4 Style)
    LETTRE_DE_VOITURE = "LETTRE_DE_VOITURE"
    TICKET_PONT_BASCULE = "TICKET_PONT_BASCULE"


class DocumentSortant(BaseModel):
    """
    Documents générés automatiquement lors de la sortie de marchandise.
    Génération PDF automatique au Gate Out.

    - BON DE LIVRAISON : Prouve que KAMLOG a livré la bonne quantité en bon état.
      Contenu : Logo, client, dossier, marchandise, poids, chauffeur, zone signature.
      → 3 exemplaires (KAMLOG, Chauffeur, Client)

    - INTERCHANGE : Transfert de responsabilité conteneur au Gate Out.
      Contenu : N° conteneur, plomb, date/heure de sortie, état des structures.
      → 2 exemplaires (KAMLOG, Chauffeur)
    """
    __tablename__ = "documents_sortants"

    numero_document: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False,
        comment="Ex: BL-KAMLOG-2026-00045 ou INT-2026-8891"
    )
    type_document: Mapped[TypeDocument] = mapped_column(nullable=False)

    # ── LIAISONS MAÎTRESSES ───────────────────────────────────────
    dossier_id: Mapped[int] = mapped_column(
        ForeignKey("dossiers_operationnels.id", ondelete="RESTRICT"),
        nullable=False,
        comment="Le dossier client à l'origine de la livraison"
    )
    marchandise_id: Mapped[int] = mapped_column(
        ForeignKey("marchandises.id", ondelete="RESTRICT"),
        nullable=False,
        comment="La marchandise spécifique qui sort"
    )
    mission_transport_id: Mapped[int | None] = mapped_column(
        ForeignKey("missions_transport.id", ondelete="SET NULL"),
        comment="Le camion/chauffeur KAMLOG (si applicable)"
    )

    # ── DONNÉES DE SÉCURITÉ & ÉTAT PHYSIQUE ───────────────────────
    numero_plomb_effectif: Mapped[str | None] = mapped_column(
        String(50),
        comment="Numéro du scellé vérifié visuellement au Gate"
    )
    etat_critique_marchandise: Mapped[str | None] = mapped_column(
        Text,
        comment="Remarques si dommage (ex: Flanc gauche bosselé)"
    )

    # ── MÉTADONNÉES DE GÉNÉRATION ─────────────────────────────────
    chemin_stockage_pdf: Mapped[str | None] = mapped_column(
        String(255),
        comment="Lien vers le fichier PDF généré"
    )
    genere_par_utilisateur: Mapped[str] = mapped_column(
        String(50), nullable=False,
        comment="ID de l'agent de guérite (Gate Agent)"
    )
    nombre_impressions: Mapped[int] = mapped_column(Integer, default=1)

    # ── RELATIONS ─────────────────────────────────────────────────
    dossier = relationship("DossierOperationnel")
    marchandise = relationship("Marchandise")

    # ── INDEX ─────────────────────────────────────────────────────
    __table_args__ = (
        Index("idx_docs_numero", "numero_document"),
        Index("idx_docs_marchandise", "marchandise_id"),
    )
