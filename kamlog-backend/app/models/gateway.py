# app/models/gateway.py - Modèles pour les passerelles inter-modules
from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum

from app.models.base import BaseModel
from app.schemas.shared import TypePasserelle, StatutPasserelle


class Passerelle(BaseModel):
    """Modèle pour les passerelles entre modules"""
    __tablename__ = "passerelles"

    id = Column(Integer, primary_key=True, index=True)
    
    # Type de passerelle
    type_passerelle = Column(SQLEnum(TypePasserelle), nullable=False, index=True)
    
    # Module source
    source_module = Column(String(50), nullable=False, index=True)
    source_id = Column(Integer, nullable=False, index=True)
    
    # Module cible
    cible_module = Column(String(50), nullable=False, index=True)
    cible_id = Column(Integer, nullable=True, index=True)
    
    # Statut
    statut = Column(SQLEnum(StatutPasserelle), default=StatutPasserelle.EN_ATTENTE, index=True)
    
    # Données supplémentaires (JSON)
    donnees = Column(JSON, nullable=True)
    
    # Gestion des erreurs
    message_erreur = Column(Text, nullable=True)
    
    # Dates
    date_creation = Column(DateTime, default=datetime.utcnow, nullable=False)
    date_traitement = Column(DateTime, nullable=True)
    
    # Traitement
    traite_par = Column(String(100), nullable=True)

    def __repr__(self):
        return f"<Passerelle {self.type_passerelle} {self.source_module}→{self.cible_module}>"


# ============ Tables de liaison pour les passerelles spécifiques ============

class CommandeFacture(BaseModel):
    """Liaison entre commande et facture"""
    __tablename__ = "commande_factures"

    id = Column(Integer, primary_key=True, index=True)
    commande_id = Column(Integer, ForeignKey("commandes.id"), nullable=False)
    facture_id = Column(Integer, ForeignKey("factures.id"), nullable=True)
    passerelle_id = Column(Integer, ForeignKey("passerelles.id"), nullable=False)
    
    montant_commande = Column(Integer, nullable=False)
    montant_facture = Column(Integer, nullable=True)
    tva = Column(Integer, default=19.25)
    
    date_creation = Column(DateTime, default=datetime.utcnow, nullable=False)
    date_facturation = Column(DateTime, nullable=True)
    
    # Relations
    passerelle = relationship("Passerelle", backref="commande_factures")


class CommandeLivraison(BaseModel):
    """Liaison entre commande et livraison"""
    __tablename__ = "commande_livraisons"

    id = Column(Integer, primary_key=True, index=True)
    commande_id = Column(Integer, ForeignKey("commandes.id"), nullable=False)
    livraison_id = Column(Integer, ForeignKey("bandes_livraison.id"), nullable=True)
    passerelle_id = Column(Integer, ForeignKey("passerelles.id"), nullable=False)
    
    date_creation = Column(DateTime, default=datetime.utcnow, nullable=False)
    date_livraison = Column(DateTime, nullable=True)
    
    # Relations
    passerelle = relationship("Passerelle", backref="commande_livraisons")


class ReceptionStock(BaseModel):
    """Liaison entre réception et stock"""
    __tablename__ = "reception_stocks"

    id = Column(Integer, primary_key=True, index=True)
    reception_id = Column(Integer, ForeignKey("receptions.id"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=True)
    passerelle_id = Column(Integer, ForeignKey("passerelles.id"), nullable=False)
    
    date_creation = Column(DateTime, default=datetime.utcnow, nullable=False)
    date_maj_stock = Column(DateTime, nullable=True)
    
    # Relations
    passerelle = relationship("Passerelle", backref="reception_stocks")


class FacturePaiement(BaseModel):
    """Liaison entre facture et paiement"""
    __tablename__ = "facture_paiements"

    id = Column(Integer, primary_key=True, index=True)
    facture_id = Column(Integer, ForeignKey("factures.id"), nullable=False)
    paiement_id = Column(Integer, ForeignKey("encaissements.id"), nullable=True)
    passerelle_id = Column(Integer, ForeignKey("passerelles.id"), nullable=False)
    
    montant_facture = Column(Integer, nullable=False)
    montant_paye = Column(Integer, default=0)
    
    date_creation = Column(DateTime, default=datetime.utcnow, nullable=False)
    date_paiement = Column(DateTime, nullable=True)
    
    # Relations
    passerelle = relationship("Passerelle", backref="facture_paiements")


class MissionFacture(BaseModel):
    """Liaison entre mission et facture"""
    __tablename__ = "mission_factures"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions_transport.id"), nullable=False)
    facture_id = Column(Integer, ForeignKey("factures.id"), nullable=True)
    passerelle_id = Column(Integer, ForeignKey("passerelles.id"), nullable=False)
    
    distance_km = Column(Integer, nullable=False)
    tarif_km = Column(Integer, nullable=False)
    montant_total = Column(Integer, nullable=False)
    
    date_creation = Column(DateTime, default=datetime.utcnow, nullable=False)
    date_facturation = Column(DateTime, nullable=True)
    
    # Relations
    passerelle = relationship("Passerelle", backref="mission_factures")
