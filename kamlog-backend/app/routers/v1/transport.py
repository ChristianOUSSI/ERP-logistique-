from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Optional, Dict
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="", tags=["Transport"])

class MissionUpdateStatus(BaseModel):
    statut: str  # PLANIFIE, EN_COURS, LIVREE, ANNULEE
    epod_signature: Optional[str] = None
    epod_note: Optional[str] = None
    montant_fret_xaf: Optional[float] = 1500000.0
    client_nom: Optional[str] = "CLIENT LOGISTIQUE CEMAC"

_missions = [
    {
        "id": 1,
        "reference": "MIS-2026-001",
        "camion": "LT-802-AA",
        "chauffeur": "EBOUE Alain",
        "origine": "Port de Douala",
        "destination": "Yaoundé Depot SABC",
        "fret": "Boissons & Brasserie",
        "client": "SABC CAMEROUN",
        "montant_fret_xaf": 1850000.0,
        "statut": "EN_COURS",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": 2,
        "reference": "MIS-2026-002",
        "camion": "OU-112-BB",
        "chauffeur": "NGUEMA Paul",
        "origine": "Kribi Container Terminal",
        "destination": "N'Djamena (Tchad)",
        "fret": "Ciment & Matériaux",
        "client": "CIMENTERIES DU TCHAD",
        "montant_fret_xaf": 4500000.0,
        "statut": "PLANIFIE",
        "created_at": datetime.utcnow().isoformat()
    }
]

@router.get("")
@router.get("/")
@router.get("/missions")
def list_missions():
    return {"items": _missions, "total": len(_missions)}

@router.get("/missions/{mission_id}")
def get_mission(mission_id: int):
    mission = next((m for m in _missions if m["id"] == mission_id), None)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission non trouvée")
    return mission

@router.patch("/missions/{mission_id}/status")
@router.post("/missions/{mission_id}/deliver")
def deliver_mission(mission_id: int, payload: MissionUpdateStatus):
    """Workflow Senior : Passage de la mission en LIVREE et déclenchement facture automatique"""
    mission = next((m for m in _missions if m["id"] == mission_id), None)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission non trouvée")

    mission["statut"] = payload.statut
    mission["delivered_at"] = datetime.utcnow().isoformat()
    if payload.epod_signature:
        mission["epod_signature"] = payload.epod_signature
    if payload.epod_note:
        mission["epod_note"] = payload.epod_note

    # Importer le registre factures finance pour générer la facture brouillon auto
    from app.routers.v1.finance import create_automatic_invoice_from_mission
    invoice = create_automatic_invoice_from_mission(
        mission_ref=mission["reference"],
        client=mission.get("client", payload.client_nom),
        montant_ht=mission.get("montant_fret_xaf", payload.montant_fret_xaf or 1500000.0)
    )

    return {
        "message": f"Mission {mission['reference']} mise à jour ({payload.statut}). Facture automatique créée avec succès.",
        "mission": mission,
        "facture_auto": invoice
    }

@router.get("/kpis")
def get_transport_kpis():
    return {
        "missions_actives": len([m for m in _missions if m["statut"] == "EN_COURS"]),
        "missions_livrees": len([m for m in _missions if m["statut"] == "LIVREE"]),
        "missions_total": len(_missions),
        "taux_ponctualite_pct": 98.2,
        "consommation_moyenne_litres_100km": 32.4
    }

@router.get("/trucks")
@router.get("/camions")
def list_trucks():
    return {
        "items": [
            {"id": 1, "immatriculation": "LT-802-AA", "marque": "Mercedes-Benz Actros", "actif": True, "statut": "DISPONIBLE"},
            {"id": 2, "immatriculation": "OU-112-BB", "marque": "Volvo FH16", "actif": True, "statut": "EN_MISSION"},
            {"id": 3, "immatriculation": "LT-902-CC", "marque": "MAN TGS 33.440", "actif": False, "statut": "MAINTENANCE"}
        ]
    }

@router.get("/drivers")
@router.get("/chauffeurs")
def list_drivers():
    return {
        "items": [
            {"id": 1, "nom": "EBOUE Alain", "permis": "CE-9812", "statut": "EN_ROUTE"},
            {"id": 2, "nom": "NGUEMA Paul", "permis": "CE-4412", "statut": "DISPONIBLE"}
        ]
    }
