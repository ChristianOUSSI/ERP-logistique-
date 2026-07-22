from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="", tags=["QHSE"])

class QHSEReportCreate(BaseModel):
    titre: str
    inspecteur: str
    zone_portuaire: Optional[str] = "Port de Douala - Quai 4"
    statut_conformite: Optional[str] = "CONFORME"
    observations: Optional[str] = None
    actions_correctives: Optional[str] = None

class SafetyIncidentCreate(BaseModel):
    titre: str
    severite: Optional[str] = "FAIBLE"
    lieu: str
    description: str

_qhse_reports = [
    {
        "id": 1,
        "reference": "INSP-QHSE-2026-001",
        "titre": "Inspection Sécurité Quai 4 Conteneurs",
        "inspecteur": "KAMGA Paul (QHSE)",
        "zone_portuaire": "Port de Douala - Quai 4",
        "statut_conformite": "CONFORME",
        "observations": "EPI portés à 100%, balisage valide.",
        "actions_correctives": "Aucune action requise.",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": 2,
        "reference": "INSP-QHSE-2026-002",
        "titre": "Contrôle Extincteurs & Zone Carburant Fleet",
        "inspecteur": "QHSE Officer CADC",
        "zone_portuaire": "Parc Logistique Yassa",
        "statut_conformite": "REMARQUES",
        "observations": "2 extincteurs nécessitent une révision annuelle.",
        "actions_correctives": "Planifier remplacement d'ici 48h avec la maintenance.",
        "created_at": datetime.utcnow().isoformat()
    }
]

_incidents = [
    {
        "id": 1,
        "reference": "INC-2026-012",
        "titre": "Fuite d'huile légère sur Chariot Elévateur H-04",
        "severite": "FAIBLE",
        "lieu": "Magasin WMS Yassa",
        "description": "Fuite contenue immédiatement avec kit anti-pollution.",
        "resolu": True,
        "created_at": datetime.utcnow().isoformat()
    }
]

@router.get("")
@router.get("/")
@router.get("/reports")
def list_qhse_reports():
    return {"items": _qhse_reports, "total": len(_qhse_reports)}

@router.post("")
@router.post("/")
@router.post("/reports")
def create_qhse_report(payload: QHSEReportCreate):
    new_report = {
        "id": len(_qhse_reports) + 1,
        "reference": f"INSP-QHSE-2026-00{len(_qhse_reports) + 1}",
        **payload.dict(),
        "created_at": datetime.utcnow().isoformat()
    }
    _qhse_reports.append(new_report)
    return new_report

@router.get("/incidents")
def list_safety_incidents():
    return {"items": _incidents, "total": len(_incidents)}

@router.post("/incidents")
def create_safety_incident(payload: SafetyIncidentCreate):
    new_incident = {
        "id": len(_incidents) + 1,
        "reference": f"INC-2026-00{len(_incidents) + 1}",
        **payload.dict(),
        "resolu": False,
        "created_at": datetime.utcnow().isoformat()
    }
    _incidents.append(new_incident)
    return new_incident

@router.get("/kpis")
def get_qhse_kpis():
    return {
        "taux_conformite_pct": 98.5,
        "incidents_zero_perte": True,
        "inspections_realisees_mois": len(_qhse_reports),
        "score_securite_global": "A+"
    }
