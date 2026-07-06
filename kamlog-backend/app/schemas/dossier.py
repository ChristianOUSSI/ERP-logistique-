# app/schemas/dossier.py
from pydantic import BaseModel
from typing import Optional, List
from app.models.dossier import RegimeDouane, StatutDossier, TypeServiceConcerne

class DossierBase(BaseModel):
    tiers_id: int
    escale_id: Optional[int] = None
    type_service_concerne: str
    numero_bl_connaissement: Optional[str] = None
    regime_douane: Optional[str] = None
    numero_declaration_sydonia: Optional[str] = None
    description: Optional[str] = None

class DossierCreate(DossierBase):
    numero_dossier: Optional[str] = None

class DossierUpdate(BaseModel):
    escale_id: Optional[int] = None
    type_service_concerne: Optional[str] = None
    numero_bl_connaissement: Optional[str] = None
    regime_douane: Optional[str] = None
    numero_declaration_sydonia: Optional[str] = None
    bon_a_enlever_obtenu: Optional[bool] = None
    statut_general: Optional[str] = None
    statut: Optional[str] = None
    description: Optional[str] = None

class DossierResponse(DossierBase):
    id: int
    numero_dossier: str
    statut_general: str
    statut: str
    reference: Optional[str] = None
    bon_a_enlever_obtenu: bool
    createur_identifiant: Optional[str] = None

    class Config:
        from_attributes = True
