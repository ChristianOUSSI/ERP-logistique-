# app/schemas/shared.py - Schémas partagés entre modules pour les passerelles
from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from enum import Enum


class TypePasserelle(str, Enum):
    """Types de passerelles entre modules"""
    COMMANDE_FACTURE = "COMMANDE_FACTURE"
    COMMANDE_LIVRAISON = "COMMANDE_LIVRAISON"
    RECEPTION_STOCK = "RECEPTION_STOCK"
    FACTURE_PAIEMENT = "FACTURE_PAIEMENT"
    MISSION_FACTURE = "MISSION_FACTURE"
    BON_LIVRAISON_FACTURE = "BON_LIVRAISON_FACTURE"


class StatutPasserelle(str, Enum):
    """Statuts des passerelles"""
    EN_ATTENTE = "EN_ATTENTE"
    TRAITE = "TRAITE"
    ECHOUE = "ECHOUE"
    ANNULE = "ANNULE"


class PasserelleBase(BaseModel):
    """Base pour les passerelles entre modules"""
    type_passerelle: TypePasserelle
    source_module: str = Field(..., description="Module source")
    source_id: int = Field(..., description="ID de l'entité source")
    cible_module: str = Field(..., description="Module cible")
    cible_id: Optional[int] = Field(None, description="ID de l'entité cible")
    statut: StatutPasserelle = StatutPasserelle.EN_ATTENTE
    donnees: Optional[dict] = Field(None, description="Données supplémentaires")
    message_erreur: Optional[str] = Field(None, description="Message d'erreur si échec")


class PasserelleCreate(PasserelleBase):
    pass


class PasserelleUpdate(BaseModel):
    cible_id: Optional[int] = None
    statut: Optional[StatutPasserelle] = None
    donnees: Optional[dict] = None
    message_erreur: Optional[str] = None


class Passerelle(PasserelleBase):
    id: int
    date_creation: datetime
    date_traitement: Optional[datetime] = None
    traite_par: Optional[str] = None

    class Config:
        from_attributes = True


# ============ DTOs pour les passerelles spécifiques ============

class CommandeFactureDTO(BaseModel):
    """DTO pour passerelle Commande → Facture"""
    commande_id: int
    client_id: int
    numero_commande: str
    montant_total: Decimal
    tva: Decimal = Field(default=Decimal("19.25"), description="TVA en %")
    date_commande: datetime
    lignes: List[dict] = Field(default_factory=list)


class CommandeLivraisonDTO(BaseModel):
    """DTO pour passerelle Commande → Livraison"""
    commande_id: int
    client_id: int
    numero_commande: str
    adresse_livraison: str
    date_livraison_souhaitee: datetime
    lignes: List[dict] = Field(default_factory=list)


class ReceptionStockDTO(BaseModel):
    """DTO pour passerelle Réception → Stock"""
    reception_id: int
    magasin_id: int
    numero_reception: str
    lignes: List[dict] = Field(default_factory=list)


class FacturePaiementDTO(BaseModel):
    """DTO pour passerelle Facture → Paiement"""
    facture_id: int
    client_id: int
    numero_facture: str
    montant_du: Decimal
    montant_paye: Decimal = Field(default=Decimal("0"))
    date_echeance: datetime


class MissionFactureDTO(BaseModel):
    """DTO pour passerelle Mission → Facture"""
    mission_id: int
    client_id: int
    numero_mission: str
    distance_km: Decimal
    tarif_km: Decimal
    montant_total: Decimal
    date_mission: datetime


class BonLivraisonFactureDTO(BaseModel):
    """DTO pour passerelle Bon de Livraison → Facture"""
    bon_livraison_id: int
    commande_id: int
    client_id: int
    numero_bl: str
    montant_total: Decimal
    date_livraison: datetime
