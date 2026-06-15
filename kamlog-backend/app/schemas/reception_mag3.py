# app/schemas/reception_mag3.py - Schemas pour les réceptions Mag3
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class StatutReceptionMag3(str):
    """Statuts des réceptions Mag3"""
    EN_ATTENTE = "EN_ATTENTE"
    EN_COURS = "EN_COURS"
    COMPLETEE = "COMPLETEE"
    ANNULEE = "ANNULEE"


class ReceptionMag3Base(BaseModel):
    """Base schema pour les réceptions Mag3"""
    removal_slip_id: int = Field(..., gt=0)
    magasin_source: str = Field(default="MAG3")
    magasin_destination: str = Field(..., min_length=1)
    article_id: int = Field(..., gt=0)
    quantite_attendue: Decimal = Field(..., gt=0)
    quantite_recue: Decimal = Field(..., gt=0)
    unite: str
    declaration_douaniere: Optional[str] = None
    date_reception: datetime
    observations: Optional[str] = None


class ReceptionMag3Create(ReceptionMag3Base):
    """Schema pour créer une réception Mag3"""
    pass


class ReceptionMag3Update(BaseModel):
    """Schema pour mettre à jour une réception Mag3"""
    magasin_destination: Optional[str] = None
    article_id: Optional[int] = None
    quantite_attendue: Optional[Decimal] = None
    quantite_recue: Optional[Decimal] = None
    unite: Optional[str] = None
    declaration_douaniere: Optional[str] = None
    recu_par: Optional[str] = None
    date_reception: Optional[datetime] = None
    observations: Optional[str] = None
    statut: Optional[str] = None


class ReceptionMag3Response(ReceptionMag3Base):
    """Schema pour répondre avec une réception Mag3"""
    id: int
    numero_reception: str
    recu_par: Optional[str] = None
    statut: str
    cree_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    
    class Config:
        from_attributes = True
