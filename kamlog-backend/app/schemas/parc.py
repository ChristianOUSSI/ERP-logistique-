# app/schemas/parc.py  Schémas Parc
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.parc import StatutEmplacement


class ZoneParcBase(BaseModel):
    code_zone: str = Field(..., max_length=20)
    nom_zone: str = Field(..., max_length=100)
    type_zone: str = Field(..., max_length=50)
    capacite_evp: int = Field(..., ge=0)
    description: str | None = Field(None, max_length=500)


class ZoneParcCreate(ZoneParcBase):
    pass


class ZoneParcResponse(ZoneParcBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class EmplacementParcBase(BaseModel):
    code_emplacement: str = Field(..., max_length=30)
    zone_id: int
    rangee: str = Field(..., max_length=10)
    bay: int = Field(..., ge=0)
    tier: int = Field(..., ge=0)
    statut: StatutEmplacement = StatutEmplacement.LIBRE


class EmplacementParcCreate(EmplacementParcBase):
    pass


class EmplacementParcResponse(EmplacementParcBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class StockPhysiqueParcBase(BaseModel):
    numero_conteneur: str = Field(..., max_length=20)
    emplacement_id: int
    type_conteneur: str = Field(..., max_length=20)
    etat: str = Field(..., max_length=20)
    poids_tare_kg: int | None = Field(None, ge=0)
    date_gate_in: datetime


class StockPhysiqueParcCreate(StockPhysiqueParcBase):
    pass


class StockPhysiqueParcResponse(StockPhysiqueParcBase):
    id: int
    date_gate_out: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True


class GateInRequest(BaseModel):
    numero_conteneur: str = Field(..., max_length=20)
    type_conteneur: str = Field(..., max_length=20)
    etat: str = Field(..., max_length=20)
    poids_tare_kg: int | None = Field(None, ge=0)
    emplacement_id: int


class GateOutRequest(BaseModel):
    numero_conteneur: str = Field(..., max_length=20)
