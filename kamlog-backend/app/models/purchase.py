# app/models/purchase.py - Modèles pour le module K-Achats
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Boolean, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base


class StatutFicheBesoin(enum.Enum):
    """Statuts des fiches de besoin"""
    BROUILLON = "BROUILLON"
    EN_ATTENTE_APPROBATION = "EN_ATTENTE_APPROBATION"
    APPROUVEE = "APPROUVEE"
    REJETEE = "REJETEE"
    TRANSFORMEE_EN_COMMANDE = "TRANSFORMEE_EN_COMMANDE"


class PrioriteFicheBesoin(enum.Enum):
    """Priorités des fiches de besoin"""
    BASSE = "BASSE"
    NORMALE = "NORMALE"
    HAUTE = "HAUTE"
    CRITIQUE = "CRITIQUE"


class FicheBesoin(Base):
    """
    Fiche de besoin (Purchase Requisition)
    Document demandant l'achat de biens/services
    """
    __tablename__ = "fiches_besoin"

    # Champs métier
    matricule: Column = Column(String(50), unique=True, nullable=False, index=True, comment="Numéro unique de la fiche")
    titre: Column = Column(String(255), nullable=False, comment="Titre de la demande")
    description: Column = Column(Text, nullable=True, comment="Description détaillée")
    
    # Relations
    demandeur_id: Column = Column(Integer, ForeignKey("users.id"), nullable=False, comment="ID du demandeur")
    agence_id: Column = Column(Integer, ForeignKey("agencies.id"), nullable=False, comment="ID de l'agence")
    
    # Workflow
    statut: Column = Column(Enum(StatutFicheBesoin), default=StatutFicheBesoin.BROUILLON, nullable=False, index=True)
    priorite: Column = Column(Enum(PrioriteFicheBesoin), default=PrioriteFicheBesoin.NORMALE, nullable=False)
    
    # Budget
    montant_estime: Column = Column(Numeric(15, 2), nullable=True, comment="Montant estimé total")
    devise: Column = Column(String(3), default="XAF", nullable=False, comment="Devise (XAF, EUR, USD)")
    
    # Dates
    date_soumission: Column = Column(DateTime(timezone=True), nullable=True, comment="Date de soumission pour approbation")
    date_approbation: Column = Column(DateTime(timezone=True), nullable=True, comment="Date d'approbation")
    date_besoin: Column = Column(DateTime(timezone=True), nullable=True, comment="Date souhaitée de réception")
    
    # Approbation
    approbateur_id: Column = Column(Integer, ForeignKey("users.id"), nullable=True, comment="ID de l'approbateur")
    notes_approbation: Column = Column(Text, nullable=True, comment="Notes de l'approbateur/rejet")
    
    # Transformation en commande
    commande_fournisseur_id: Column = Column(Integer, nullable=True, comment="ID de la commande fournisseur générée")
    
    # Audit
    cree_par: Column = Column(String(255), nullable=False, comment="Username du créateur")
    modifie_par: Column = Column(String(255), nullable=True, comment="Username du dernier modificateur")

    # Relations
    demandeur = relationship("User", foreign_keys=[demandeur_id], backref="fiches_besoin_demandees")
    approbateur = relationship("User", foreign_keys=[approbateur_id], backref="fiches_besoin_approuvees")
    agence = relationship("Agency", backref="fiches_besoin")
    lignes = relationship("LigneFicheBesoin", back_populates="fiche_besoin", cascade="all, delete-orphan")


class LigneFicheBesoin(Base):
    """
    Ligne de fiche de besoin (Purchase Requisition Line)
    Détail des articles/services demandés
    """
    __tablename__ = "lignes_fiches_besoin"

    fiche_besoin_id: Column = Column(Integer, ForeignKey("fiches_besoin.id"), nullable=False)
    
    # Description de l'article/service
    code_article: Column = Column(String(50), nullable=True, comment="Code article si existant")
    designation: Column = Column(String(255), nullable=False, comment="Désignation de l'article/service")
    description: Column = Column(Text, nullable=True, comment="Description détaillée")
    
    # Quantité et prix
    quantite_demandee: Column = Column(Integer, nullable=False, comment="Quantité demandée")
    unite: Column = Column(String(20), nullable=True, comment="Unité de mesure (UDB, KG, etc.)")
    prix_unitaire_estime: Column = Column(Numeric(12, 2), nullable=True, comment="Prix unitaire estimé")
    montant_total_estime: Column = Column(Numeric(15, 2), nullable=True, comment="Montant total estimé (quantité * prix)")
    
    # Spécifications
    specifications: Column = Column(Text, nullable=True, comment="Spécifications techniques")
    reference_fabricant: Column = Column(String(100), nullable=True, comment="Référence fabricant")
    
    # Relation
    fiche_besoin = relationship("FicheBesoin", back_populates="lignes")
