# app/models/reception_mag3.py - Modèle pour les réceptions Mag3
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base


class StatutReceptionMag3(str, enum.Enum):
    """Statuts des réceptions Mag3"""
    EN_ATTENTE = "EN_ATTENTE"
    EN_COURS = "EN_COURS"
    COMPLETEE = "COMPLETEE"
    ANNULEE = "ANNULEE"


class ReceptionMag3(Base):
    """Modèle pour les réceptions de marchandises quittant Mag3"""
    __tablename__ = "receptions_mag3"

    id = Column(Integer, primary_key=True, index=True)
    numero_reception = Column(String(50), unique=True, nullable=False, index=True)
    
    # Lien avec le bon d'enlèvement
    removal_slip_id = Column(Integer, ForeignKey("removal_slips.id"), nullable=False)
    
    # Magasins
    magasin_source = Column(String(20), default='MAG3', nullable=False)
    magasin_destination = Column(String(20), nullable=False)
    
    # Article et quantités
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    quantite_attendue = Column(Numeric(15, 3), nullable=False)
    quantite_recue = Column(Numeric(15, 3), nullable=False)
    unite = Column(String(20), nullable=False)
    
    # Déclaration douanière
    declaration_douaniere = Column(String(50))
    
    # Réception
    recu_par = Column(String(100))
    date_reception = Column(DateTime(timezone=True), nullable=False)
    
    # Observations et statut
    observations = Column(Text)
    statut = Column(SQLEnum(StatutReceptionMag3), default=StatutReceptionMag3.EN_ATTENTE)
    
    # Traçabilité
    cree_par = Column(String(100))
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    removal_slip = relationship("RemovalSlip", back_populates="receptions")
    article = relationship("Article")
