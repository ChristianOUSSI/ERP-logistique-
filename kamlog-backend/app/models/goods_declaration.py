# app/models/goods_declaration.py - Modèle pour les déclarations de marchandises
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base


class StatutGoodsDeclaration(str, enum.Enum):
    """Statuts des déclarations de marchandises"""
    BROUILLON = "BROUILLON"
    VALIDEE = "VALIDEE"
    ANNULEE = "ANNULEE"
    EN_TRANSIT = "EN_TRANSIT"
    ARRIVEE = "ARRIVEE"


class GoodsDeclaration(Base):
    """Modèle pour les déclarations de marchandises (séparé des conteneurs)"""
    __tablename__ = "goods_declarations"

    id = Column(Integer, primary_key=True, index=True)
    numero_declaration = Column(String(50), unique=True, nullable=False, index=True)
    
    # Code article et code transit (obligatoire pour déclaration)
    code_article = Column(String(20), nullable=False, index=True)
    code_transit = Column(String(20), nullable=False, index=True)
    
    # Description et détails
    description = Column(Text)
    quantite = Column(Numeric(15, 3), nullable=False)
    unite = Column(String(20), nullable=False)
    poids_kg = Column(Numeric(15, 3))
    valeur_xaf = Column(Numeric(15, 2))
    
    # Origine et destination
    origine = Column(String(100))
    destination = Column(String(100))
    
    # Conteneur (optionnel - liaison avec déclaration conteneur)
    numero_conteneur = Column(String(50), nullable=True)
    
    # Observations et statut
    observations = Column(Text)
    statut = Column(SQLEnum(StatutGoodsDeclaration), default=StatutGoodsDeclaration.BROUILLON)
    
    # Traçabilité
    cree_par = Column(String(100))
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    lignes = relationship("LigneGoodsDeclaration", back_populates="declaration", cascade="all, delete-orphan")


class LigneGoodsDeclaration(Base):
    """Modèle pour les lignes de déclaration de marchandises"""
    __tablename__ = "lignes_goods_declaration"

    id = Column(Integer, primary_key=True, index=True)
    declaration_id = Column(Integer, ForeignKey("goods_declarations.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    
    quantite_declaree = Column(Numeric(15, 3), nullable=False)
    unite_mesure = Column(String(20), nullable=False)
    poids_kg = Column(Numeric(15, 3))
    valeur_unitaire_xaf = Column(Numeric(15, 2))
    valeur_totale_xaf = Column(Numeric(15, 2))
    
    # Relations
    declaration = relationship("GoodsDeclaration", back_populates="lignes")
