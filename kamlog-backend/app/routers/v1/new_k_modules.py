from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["New K-Modules"])

# --- Schemas ---
class CotationCreate(BaseModel):
    client_nom: str
    origine: str
    destination: str
    nature_fret: str
    montant_estime_xaf: float
    marge_nette_pct: Optional[float] = 15.0

class EPodCreate(BaseModel):
    reference_mission: str
    nom_destinataire: str
    signature_url: Optional[str] = None
    photo_livraison_url: Optional[str] = None
    longitude: Optional[float] = 9.704
    latitude: Optional[float] = 4.051

class FuelSensorCreate(BaseModel):
    immatriculation_camion: str
    niveau_actuel_litres: float
    derniere_station: Optional[str] = "TotalEnergies Douala Port"

class PurchaseOrderCreate(BaseModel):
    fournisseur: str
    description: str
    montant_total_xaf: float

class ComplianceAuditCreate(BaseModel):
    dossier_reference: str
    type_reglementation: Optional[str] = "ZLECAF / CEMAC"
    score_conformite_pct: Optional[float] = 98.5

# --- In-Memory State for Demo/Live Integration ---
_cotations = [
    {
        "id": 1,
        "reference": "COT-2026-001",
        "client_nom": "CFAO LOGISTICS CAMEROUN",
        "origine": "Port de Douala",
        "destination": "N'Djamena (Tchad)",
        "nature_fret": "Conteneur 40ft High Cube",
        "montant_estime_xaf": 4850000.0,
        "marge_nette_pct": 18.5,
        "statut": "ACCEPTE",
        "created_at": datetime.utcnow().isoformat()
    }
]

_epods = [
    {
        "id": 1,
        "reference_mission": "OT-2026-00401",
        "nom_destinataire": "Jean-Marc MVONDO",
        "signature_url": "/signatures/sig_00401.png",
        "photo_livraison_url": "/photos/delivery_00401.jpg",
        "longitude": 9.7042,
        "latitude": 4.0511,
        "statut": "LIVRE_AVEC_SIGNATURE",
        "timestamp": datetime.utcnow().isoformat()
    }
]

_fuel_sensors = [
    {
        "id": 1,
        "immatriculation_camion": "LT-802-AA",
        "niveau_actuel_litres": 340.0,
        "capacite_totale_litres": 400.0,
        "alerte_vol_detectee": False,
        "derniere_station": "TotalEnergies Douala Port",
        "updated_at": datetime.utcnow().isoformat()
    }
]

_procurements = [
    {
        "id": 1,
        "numero_po": "PO-2026-089",
        "fournisseur": "MICHELIN CAMEROUN",
        "description": "8 Pneumatiques Poids Lourds 315/80 R22.5",
        "montant_total_xaf": 2400000.0,
        "match_3_voies": True,
        "statut": "APPROUVE",
        "created_at": datetime.utcnow().isoformat()
    }
]

_compliance_audits = [
    {
        "id": 1,
        "dossier_reference": "DOS-DOUANE-9021",
        "type_reglementation": "ZLECAF / CEMAC",
        "score_conformite_pct": 99.2,
        "exemption_valide": True,
        "statut": "VALIDE",
        "created_at": datetime.utcnow().isoformat()
    }
]

# --- Endpoints K-Cotations ---
@router.get("/cotations")
def get_cotations():
    return {"items": _cotations}

@router.post("/cotations")
def create_cotation(payload: CotationCreate):
    new_item = {
        "id": len(_cotations) + 1,
        "reference": f"COT-2026-00{len(_cotations) + 1}",
        **payload.dict(),
        "statut": "SOUMIS",
        "created_at": datetime.utcnow().isoformat()
    }
    _cotations.append(new_item)
    return new_item

# --- Endpoints K-Tracking & e-POD ---
@router.get("/tracking/epod")
def get_epods():
    return {"items": _epods}

@router.post("/tracking/epod")
def create_epod(payload: EPodCreate):
    new_item = {
        "id": len(_epods) + 1,
        **payload.dict(),
        "statut": "LIVRE_AVEC_SIGNATURE",
        "timestamp": datetime.utcnow().isoformat()
    }
    _epods.append(new_item)
    return new_item

# --- Endpoints K-FuelGuard ---
@router.get("/fuel-guard/sensors")
def get_fuel_sensors():
    return {"items": _fuel_sensors}

@router.post("/fuel-guard/sensors")
def create_fuel_sensor(payload: FuelSensorCreate):
    new_item = {
        "id": len(_fuel_sensors) + 1,
        **payload.dict(),
        "capacite_totale_litres": 400.0,
        "alerte_vol_detectee": False,
        "updated_at": datetime.utcnow().isoformat()
    }
    _fuel_sensors.append(new_item)
    return new_item

# --- Endpoints K-Procurement ---
@router.get("/procurement/orders")
def get_procurement_orders():
    return {"items": _procurements}

@router.post("/procurement/orders")
def create_procurement_order(payload: PurchaseOrderCreate):
    new_item = {
        "id": len(_procurements) + 1,
        "numero_po": f"PO-2026-0{len(_procurements) + 90}",
        **payload.dict(),
        "match_3_voies": True,
        "statut": "APPROUVE",
        "created_at": datetime.utcnow().isoformat()
    }
    _procurements.append(new_item)
    return new_item

# --- Endpoints K-Compliance ---
@router.get("/compliance/audits")
def get_compliance_audits():
    return {"items": _compliance_audits}

@router.post("/compliance/audits")
def create_compliance_audit(payload: ComplianceAuditCreate):
    new_item = {
        "id": len(_compliance_audits) + 1,
        **payload.dict(),
        "exemption_valide": True,
        "statut": "VALIDE",
        "created_at": datetime.utcnow().isoformat()
    }
    _compliance_audits.append(new_item)
    return new_item

# --- Endpoints K-Analytics BI ---
@router.get("/bi-analytics/executive-summary")
def get_bi_summary():
    return {
        "chiffre_affaires_cumule_xaf": 142500000.0,
        "marge_brute_globale_pct": 22.4,
        "volume_fret_evp": 1280,
        "taux_livraison_ponctuel_pct": 97.8,
        "economie_carburant_xaf": 8400000.0
    }
