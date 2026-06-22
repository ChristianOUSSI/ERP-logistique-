# app/schemas/removal_slip.py - Schemas pour les bons d'enlèvement
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class StatutRemovalSlip(str):
    """Statuts des bons d'enlèvement"""
    EN_ATTENTE = "EN_ATTENTE"
    AUTORISE = "AUTORISE"
    EN_COURS = "EN_COURS"
    COMPLETE = "COMPLETE"
    ANNULE = "ANNULE"


class RemovalSlipBase(BaseModel):
    """Base schema pour les bons d'enlèvement"""
    magasin_source: str = Field(default="MAG3")
    magasin_destination: str = Field(..., min_length=1)
    article_id: int = Field(..., gt=0)
    quantite: Decimal = Field(..., gt=0)
    unite: str
    declaration_douaniere: str = Field(..., min_length=1)
    motif: Optional[str] = None
    observations: Optional[str] = None
    date_bon: datetime


class RemovalSlipCreate(RemovalSlipBase):
    """Schema pour créer un bon d'enlèvement"""
    pass


class RemovalSlipUpdate(BaseModel):
    """Schema pour mettre à jour un bon d'enlèvement"""
    magasin_destination: Optional[str] = None
    article_id: Optional[int] = None
    quantite: Optional[Decimal] = None
    unite: Optional[str] = None
    declaration_douaniere: Optional[str] = None
    motif: Optional[str] = None
    observations: Optional[str] = None
    statut: Optional[str] = None
    autorise_par: Optional[str] = None
    date_autorisation: Optional[datetime] = None


class RemovalSlipResponse(RemovalSlipBase):
    """Schema pour répondre avec un bon d'enlèvement"""
    id: int
    numero_bon: str
    statut: str
    autorise_par: Optional[str] = None
    date_autorisation: Optional[datetime] = None
    cree_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    
    class Config:
        from_attributes = True
