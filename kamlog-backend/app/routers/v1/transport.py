from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="", tags=["Transport"])

_missions = [
    {
        "id": 1,
        "reference": "MIS-2026-001",
        "camion": "LT-802-AA",
        "chauffeur": "EBOUE Alain",
        "origine": "Port de Douala",
        "destination": "Yaoundé Depot SABC",
        "fret": "Boissons & Brasserie",
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
        "statut": "PLANIFIE",
        "created_at": datetime.utcnow().isoformat()
    }
]

@router.get("")
@router.get("/")
@router.get("/missions")
def list_missions():
    return {"items": _missions, "total": len(_missions)}

@router.get("/kpis")
def get_transport_kpis():
    return {
        "missions_actives": len([m for m in _missions if m["statut"] == "EN_COURS"]),
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
