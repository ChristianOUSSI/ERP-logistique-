# app/schemas/transport.py  Schémas Transport
from pydantic import BaseModel, Field, ConfigDict, field_validator
from decimal import Decimal
from datetime import datetime, date
from typing import List, Optional
import re
from app.models.transport import TypeMateriel, TypeVehicule, StatutMission, StatutCamion, StatutChauffeur, StatutPanne


# ─── Vehicule & Remorque ────────────────────────────────────

class CamionBase(BaseModel):
    immatriculation: str = Field(..., max_length=20)
    type_materiel: TypeMateriel = TypeMateriel.TRACTEUR
    type_vehicule: TypeVehicule
    marque: str = Field(..., max_length=50)
    modele: str = Field(..., max_length=50)
    charge_utile_kg: Decimal = Field(..., ge=0)
    volume_reservoir_litres: Decimal | None = Field(None, ge=0)
    conso_theorique_l_100: Decimal | None = Field(None, ge=0)
    gps_tracker_id: str | None = None
    remorque_id: int | None = None
    proprietes_dynamiques: Optional[dict] = Field(default_factory=dict)

    @field_validator('immatriculation')
    def validate_immatriculation_cameroun(cls, v):
        # Format: [2 Lettres Région] [2 Lettres Genre] [3 Chiffres] [2 Lettres Série]
        # Ex: LT TR 123 AB, ou avec tirets/sans espaces LTTR123AB
        v_normalized = v.strip().upper()
        # On assouplit la regex pour permettre la création de véhicules facilement (lettres, chiffres, espaces, tirets)
        v_clean = re.sub(r'[\s\-]', '', v_normalized)
        pattern = r"^[A-Z0-9]+$"
        if not re.match(pattern, v_clean):
            raise ValueError("Le format de l'immatriculation est invalide. Lettres et chiffres uniquement.")
        
        return v_normalized


class CamionCreate(CamionBase):
    pass

class CamionFlotteCreate(CamionBase):
    pass

class CamionFlotteUpdate(BaseModel):
    immatriculation: str | None = Field(None, max_length=20)
    type_materiel: TypeMateriel | None = None
    type_vehicule: TypeVehicule | None = None
    marque: str | None = Field(None, max_length=50)
    modele: str | None = Field(None, max_length=50)
    charge_utile_kg: Decimal | None = Field(None, ge=0)
    volume_reservoir_litres: Decimal | None = Field(None, ge=0)
    conso_theorique_l_100: Decimal | None = Field(None, ge=0)
    gps_tracker_id: str | None = None
    remorque_id: int | None = None
    statut: StatutCamion | None = None
    actif: bool | None = None
    proprietes_dynamiques: Optional[dict] = None


class CamionResponse(CamionBase):
    id: int
    statut: StatutCamion
    actif: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ─── Documents Véhicule ─────────────────────────────────────

class VehiculeDocumentBase(BaseModel):
    type_document: str = Field(..., max_length=50)
    numero: str = Field(..., max_length=100)
    date_emission: date
    date_expiration: date
    fichier_url: str | None = None

class VehiculeDocumentCreate(VehiculeDocumentBase):
    vehicule_id: int

class VehiculeDocumentResponse(VehiculeDocumentBase):
    id: int
    vehicule_id: int
    model_config = ConfigDict(from_attributes=True)


# ─── Pannes & HSE ──────────────────────────────────────────

class PanneVehiculeBase(BaseModel):
    description: str
    date_reparation_prevue: date | None = None

class PanneVehiculeCreate(PanneVehiculeBase):
    vehicule_id: int

class PanneVehiculeUpdate(BaseModel):
    statut: StatutPanne | None = None
    notes_resolution: str | None = None
    date_reparation_prevue: date | None = None

class PanneVehiculeResponse(PanneVehiculeBase):
    id: int
    vehicule_id: int
    date_declaration: datetime
    statut: StatutPanne
    declare_par: str | None
    notes_resolution: str | None
    model_config = ConfigDict(from_attributes=True)


# ─── Chauffeur ──────────────────────────────────────────────

class ChauffeurBase(BaseModel):
    nom: str = Field(..., max_length=100)
    prenom: str = Field(..., max_length=100)
    telephone: str = Field(..., max_length=30)
    adresse: str | None = None
    contact_urgence_nom: str | None = Field(None, max_length=100)
    contact_urgence_telephone: str | None = Field(None, max_length=30)
    numero_permis: str = Field(..., max_length=50)
    categorie_permis: str = Field(..., max_length=10)
    specialisation: str | None = Field(None, max_length=100)
    affectation_vehicule_id: int | None = None
    date_entree: date | None = None

class ChauffeurCreate(ChauffeurBase):
    pass

class ChauffeurProfilCreate(ChauffeurBase):
    pass

class ChauffeurProfilUpdate(BaseModel):
    nom: str | None = Field(None, max_length=100)
    prenom: str | None = Field(None, max_length=100)
    telephone: str | None = Field(None, max_length=30)
    adresse: str | None = None
    contact_urgence_nom: str | None = Field(None, max_length=100)
    contact_urgence_telephone: str | None = Field(None, max_length=30)
    numero_permis: str | None = Field(None, max_length=50)
    categorie_permis: str | None = Field(None, max_length=10)
    specialisation: str | None = Field(None, max_length=100)
    affectation_vehicule_id: int | None = None
    date_entree: date | None = None
    statut: StatutChauffeur | None = None
    actif: bool | None = None

class ChauffeurResponse(ChauffeurBase):
    id: int
    statut: StatutChauffeur
    actif: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ChauffeurDocumentBase(BaseModel):
    type_document: str = Field(..., max_length=50)
    numero: str = Field(..., max_length=100)
    date_emission: date
    date_expiration: date
    fichier_url: str | None = None

class ChauffeurDocumentCreate(ChauffeurDocumentBase):
    chauffeur_id: int

class ChauffeurDocumentResponse(ChauffeurDocumentBase):
    id: int
    chauffeur_id: int
    model_config = ConfigDict(from_attributes=True)


# ─── Ordre de Transport (Mission) ───────────────────────────

class MissionBase(BaseModel):
    reference: str = Field(..., max_length=30)
    tiers_id: int
    expediteur_adresse: str | None = None
    destinataire_adresse: str | None = None
    contact_site: str | None = Field(None, max_length=100)

    camion_id: int
    remorque_id: int | None = None
    chauffeur_id: int

    origine: str = Field(..., max_length=200)
    destination: str = Field(..., max_length=200)
    distance_km: Decimal = Field(..., ge=0)
    nature_fret: str = Field(..., max_length=50)
    poids_kg: Decimal | None = Field(None, ge=0)
    volume_m3: Decimal | None = Field(None, ge=0)
    
    date_chargement_prevue: datetime | None = None
    date_livraison_souhaitee: datetime | None = None
    
    montant_fret: Decimal | None = Field(None, ge=0)
    frais_peage: Decimal | None = Field(default=0, ge=0)
    frais_annexes: Decimal | None = Field(default=0, ge=0)
    notes: str | None = None
    proprietes_dynamiques: Optional[dict] = Field(default_factory=dict)


class MissionCreate(MissionBase):
    dossier_id: int | None = None


class MissionUpdate(BaseModel):
    statut: StatutMission | None = None
    notes: str | None = None
    frais_peage: Decimal | None = None
    frais_annexes: Decimal | None = None


class MissionResponse(MissionBase):
    id: int
    statut: StatutMission
    dossier_id: int | None
    created_at: datetime
    updated_at: datetime
    camion: CamionResponse | None = None
    chauffeur: ChauffeurResponse | None = None
    model_config = ConfigDict(from_attributes=True)
