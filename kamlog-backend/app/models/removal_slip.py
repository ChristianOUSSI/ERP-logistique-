# app/models/removal_slip.py - Modèle pour les bons d'enlèvement Mag3
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base


class StatutRemovalSlip(str, enum.Enum):
    """Statuts des bons d'enlèvement"""
    EN_ATTENTE = "EN_ATTENTE"
    AUTORISE = "AUTORISE"
    EN_COURS = "EN_COURS"
    COMPLETE = "COMPLETE"
    ANNULE = "ANNULE"


class RemovalSlip(Base):
    """Modèle pour les bons d'enlèvement (Mag3 vers autres magasins)"""
    __tablename__ = "removal_slips"

    id = Column(Integer, primary_key=True, index=True)
    numero_bon = Column(String(50), unique=True, nullable=False, index=True)
    
    # Magasins source et destination
    magasin_source = Column(String(20), default='MAG3', nullable=False)
    magasin_destination = Column(String(20), nullable=False)
    
    # Article et quantité
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    quantite = Column(Numeric(15, 3), nullable=False)
    unite = Column(String(20), nullable=False)
    
    # Déclaration douanière (obligatoire pour Mag3)
    declaration_douaniere = Column(String(50), nullable=False)
    
    # Motif et observations
    motif = Column(Text)
    observations = Column(Text)
    
    # Autorisation
    autorise_par = Column(String(100))
    date_autorisation = Column(DateTime(timezone=True))
    
    # Statut et dates
    statut = Column(SQLEnum(StatutRemovalSlip), default=StatutRemovalSlip.EN_ATTENTE)
    date_bon = Column(DateTime(timezone=True), nullable=False)
    
    # Traçabilité
    cree_par = Column(String(100))
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    article = relationship("Article")
    receptions = relationship("ReceptionMag3", back_populates="removal_slip")
