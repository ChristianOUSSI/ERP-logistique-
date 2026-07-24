from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Incidents & QHSE Events"])

class IncidentCreate(BaseModel):
    titre: str
    description: str
    type_incident: str  # ACCIDENT, INCIDENT_SECURITE, PANNE, ANOMALIE, INCIDENT_ENVIRONNEMENTAL
    gravite: str  # MINEUR, MODERE, MAJEUR, CRITIQUE
    lieu: Optional[str] = None
    vehicule_immat: Optional[str] = None
    personnes_impliquees: Optional[List[str]] = None
    signale_par: Optional[str] = None
    module: Optional[str] = "SECURITE"

_incidents = [
    {"id": 1, "reference": "INC-2026-001", "titre": "Accident de Manœuvre – Quai 2", "description": "Collision légère entre DLA-TRK-001 et balise de quai lors des manœuvres de chargement. Dégâts matériels légers, aucun blessé.", "type_incident": "ACCIDENT", "gravite": "MINEUR", "lieu": "QUAI-2", "vehicule_immat": "DLA-TRK-001", "personnes_impliquees": ["Jean-Marc MVONDO"], "signale_par": "Chef de quai BIYA Jules", "module": "TRANSPORT", "statut": "EN_COURS_TRAITEMENT", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "INC-2026-002", "titre": "Déversement Hydrocarbures – Station Carburant", "description": "Déversement accidentel de ~20L de gasoil lors du remplissage cuve. Zone confinée et nettoyée. Rapport QHSE soumis.", "type_incident": "INCIDENT_ENVIRONNEMENTAL", "gravite": "MODERE", "lieu": "STATION CARBURANT – CUVE-F01", "vehicule_immat": None, "personnes_impliquees": ["Agent NGONO Serge"], "signale_par": "Responsable QHSE", "module": "QHSE", "statut": "CLOTURE", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "reference": "INC-2026-003", "titre": "Tentative Accès Non Autorisé – Zone Sécurisée", "description": "Individu non identifié tenté d'accéder à YARD-A01 sans badge à 23h47. Sécurité intervenue. Rapport transmis à la Police Portuaire.", "type_incident": "INCIDENT_SECURITE", "gravite": "CRITIQUE", "lieu": "YARD-A01", "vehicule_immat": None, "personnes_impliquees": [], "signale_par": "Agent Sécurité MBIDA", "module": "SECURITE", "statut": "EN_COURS_TRAITEMENT", "created_at": datetime.utcnow().isoformat()},
]

_next_id = 4

@router.get("/")
def list_incidents(
    type_incident: Optional[str] = None,
    gravite: Optional[str] = None,
    statut: Optional[str] = None,
    module: Optional[str] = None,
    skip: int = 0, limit: int = 50
):
    results = _incidents[:]
    if type_incident:
        results = [i for i in results if i["type_incident"].upper() == type_incident.upper()]
    if gravite:
        results = [i for i in results if i["gravite"].upper() == gravite.upper()]
    if statut:
        results = [i for i in results if i["statut"].upper() == statut.upper()]
    if module:
        results = [i for i in results if i["module"].upper() == module.upper()]
    return {
        "total": len(results),
        "critiques_actifs": len([i for i in _incidents if i["gravite"] == "CRITIQUE" and i["statut"] != "CLOTURE"]),
        "incidents": results[skip:skip+limit]
    }

@router.get("/{incident_id}")
def get_incident(incident_id: int):
    i = next((i for i in _incidents if i["id"] == incident_id), None)
    if not i:
        raise HTTPException(status_code=404, detail="Incident non trouvé")
    return i

@router.post("/")
def create_incident(data: IncidentCreate):
    global _next_id
    ref = f"INC-{datetime.now().year}-{_next_id:03d}"
    incident = {**data.dict(), "id": _next_id, "reference": ref, "statut": "OUVERT", "created_at": datetime.utcnow().isoformat()}
    _incidents.insert(0, incident)
    _next_id += 1
    return incident

@router.patch("/{incident_id}/cloturer")
def cloturer_incident(incident_id: int):
    i = next((i for i in _incidents if i["id"] == incident_id), None)
    if not i:
        raise HTTPException(status_code=404, detail="Incident non trouvé")
    i["statut"] = "CLOTURE"
    return i

@router.patch("/{incident_id}/statut")
def update_incident_statut(incident_id: int, statut: str):
    i = next((i for i in _incidents if i["id"] == incident_id), None)
    if not i:
        raise HTTPException(status_code=404, detail="Incident non trouvé")
    i["statut"] = statut.upper()
    return i
