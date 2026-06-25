# app/models/suppliers.py - Modèle pour les fournisseurs (séparé des clients)
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, Enum as SQLEnum, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base


class StatutSupplier(str, enum.Enum):
    """Statuts des fournisseurs"""
    ACTIF = "ACTIF"
    BLOQUE = "BLOQUE"
    INACTIF = "INACTIF"
    EN_VALIDATION = "EN_VALIDATION"


class CategorieSupplier(str, enum.Enum):
    """Catégories de fournisseurs"""
    TRANSPORT = "TRANSPORT"
    ACQUISITION = "ACQUISITION"
    SERVICE = "SERVICE"
    EQUIPEMENT = "EQUIPEMENT"
    FOURNITURE = "FOURNITURE"


class Supplier(Base):
    """Modèle pour les fournisseurs (séparé des clients du magasin)"""
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    code_fournisseur = Column(String(20), unique=True, nullable=False, index=True)
    
    # Identification légale
    raison_sociale = Column(String(200), nullable=False, index=True)
    acronyme = Column(String(50))
    type_entite = Column(String(50))
    niu = Column(String(20), unique=True, nullable=False, index=True)
    rccm = Column(String(50))
    id_fiscal = Column(String(50))
    
    # Contact
    adresse = Column(Text)
    boite_postale = Column(String(50))
    ville = Column(String(100))
    region = Column(String(100))
    pays = Column(String(100), default='Cameroun')
    telephone = Column(String(30))
    email = Column(String(100))
    
    # Conditions financières
    conditions_paiement = Column(String(50))
    devise = Column(String(10), default='XAF')
    limite_credit_xaf = Column(Numeric(15, 2), default=0)
    
    # Banque
    compte_bancaire = Column(String(50))
    nom_banque = Column(String(100))
    
    # Catégorie et statut
    categorie = Column(SQLEnum(CategorieSupplier), nullable=True)
    statut = Column(SQLEnum(StatutSupplier), default=StatutSupplier.EN_VALIDATION)
    est_actif = Column(Boolean, default=True)
    
    # Traçabilité
    cree_par = Column(String(100))
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    profiles = relationship("SupplierProfile", back_populates="supplier", cascade="all, delete-orphan")


class SupplierProfile(Base):
    """Extension du profil fournisseur avec évaluations"""
    __tablename__ = "supplier_profiles"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    
    # Évaluation
    categorie_fournisseur = Column(String(50))
    delai_moyen_livraison = Column(Integer)  # en jours
    qualite_service = Column(String(20))  # EXCELLENT, BON, MOYEN, FAIBLE
    
    # Notes et évaluation
    notes = Column(Text)
    date_evaluation = Column(DateTime(timezone=True))
    
    # Traçabilité
    cree_par = Column(String(100))
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    supplier = relationship("Supplier", back_populates="profiles")
