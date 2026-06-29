# app/schemas/transport.py  Schémas Transport
from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from app.models.transport import TypeVehicule, StatutMission


class CamionBase(BaseModel):
    immatriculation: str = Field(..., max_length=20)
    type_vehicule: TypeVehicule
    marque: str = Field(..., max_length=50)
    modele: str = Field(..., max_length=50)
    charge_utile_kg: Decimal = Field(..., ge=0)
    volume_reservoir_litres: Decimal = Field(..., ge=0)
    conso_theorique_l_100: Decimal = Field(..., ge=0)


class CamionCreate(CamionBase):
    pass


class CamionFlotteCreate(CamionBase):
    pass


class CamionFlotteUpdate(BaseModel):
    immatriculation: str | None = Field(None, max_length=20)
    type_vehicule: TypeVehicule | None = None
    marque: str | None = Field(None, max_length=50)
    modele: str | None = Field(None, max_length=50)
    charge_utile_kg: Decimal | None = Field(None, ge=0)
    volume_reservoir_litres: Decimal | None = Field(None, ge=0)
    conso_theorique_l_100: Decimal | None = Field(None, ge=0)
    statut: str | None = None
    actif: bool | None = None


class CamionResponse(CamionBase):
    id: int
    statut: str
    actif: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ChauffeurBase(BaseModel):
    nom: str = Field(..., max_length=100)
    prenom: str = Field(..., max_length=100)
    numero_permis: str = Field(..., max_length=50)
    categorie_permis: str = Field(..., max_length=10)
    telephone: str = Field(..., max_length=30)


class ChauffeurCreate(ChauffeurBase):
    pass


class ChauffeurProfilCreate(ChauffeurBase):
    pass


class ChauffeurProfilUpdate(BaseModel):
    nom: str | None = Field(None, max_length=100)
    prenom: str | None = Field(None, max_length=100)
    numero_permis: str | None = Field(None, max_length=50)
    categorie_permis: str | None = Field(None, max_length=10)
    telephone: str | None = Field(None, max_length=30)
    actif: bool | None = None


class ChauffeurResponse(ChauffeurBase):
    id: int
    actif: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class MissionBase(BaseModel):
    reference: str = Field(..., max_length=30)
    tiers_id: int
    camion_id: int
    chauffeur_id: int
    origine: str = Field(..., max_length=200)
    destination: str = Field(..., max_length=200)
    distance_km: Decimal = Field(..., ge=0)
    type_marchandise: str = Field(..., max_length=50)
    poids_kg: Decimal | None = Field(None, ge=0)
    notes: str | None


class MissionCreate(MissionBase):
    dossier_id: int | None = None


class MissionUpdate(BaseModel):
    statut: StatutMission
    notes: str | None


class MissionResponse(MissionBase):
    id: int
    statut: StatutMission
    dossier_id: int | None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
