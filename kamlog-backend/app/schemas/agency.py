# app/schemas/agency.py - Schémas Pydantic pour les agences
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AgencyBase(BaseModel):
    code: str
    nom: str
    adresse: Optional[str] = None
    ville: Optional[str] = None
    pays: str = "Cameroun"
    telephone: Optional[str] = None
    email: Optional[str] = None
    is_active: bool = True


class AgencyCreate(AgencyBase):
    pass


class AgencyUpdate(BaseModel):
    nom: Optional[str] = None
    adresse: Optional[str] = None
    ville: Optional[str] = None
    pays: Optional[str] = None
    telephone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None


class AgencyResponse(AgencyBase):
    id: int
    date_creation: datetime
    date_modification: Optional[datetime] = None

    class Config:
        from_attributes = True