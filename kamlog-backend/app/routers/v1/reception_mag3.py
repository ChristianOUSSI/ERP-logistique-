from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Reception MAG3"])

class ReceptionCreate(BaseModel):
    numero_bl: str
    navire: str
    numero_conteneur: Optional[str] = None
    type_conteneur: Optional[str] = "20DRY"
    client_nom: str
    nature_marchandise: str
    poids_kg: Optional[float] = None
    nombre_colis: Optional[int] = None
    emplacement_destination: Optional[str] = "MAG3"
    agent_reception: Optional[str] = None

_receptions = [
    {"id": 1, "reference": "REC-MAG3-2026-001", "numero_bl": "BL-2026-0438", "navire": "BOLLORE AFRIK EXPRESS", "numero_conteneur": "BSCU4521873", "type_conteneur": "20DRY", "client_nom": "SOCIETE CAMEROUNAISE DE PALME (SCP)", "nature_marchandise": "Huile de Palme Brute", "poids_kg": 21000, "nombre_colis": 1, "emplacement_destination": "MAG3-C01", "agent_reception": "ONDOUA Pierre-Marie", "statut": "RECEPTIONNE", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "REC-MAG3-2026-002", "numero_bl": "BL-2026-0441", "navire": "MSC GIOVANNA", "numero_conteneur": "MSCU7834561", "type_conteneur": "40HQ", "client_nom": "CFAO LOGISTICS CAMEROUN", "nature_marchandise": "Électroménager – Réfrigérateurs, Climatiseurs", "poids_kg": 18500, "nombre_colis": 240, "emplacement_destination": "YARD-A01", "agent_reception": "MVONGO Sarah", "statut": "EN_COURS", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "reference": "REC-MAG3-2026-003", "numero_bl": "BL-2026-0442", "navire": "CMA CGM DAKAR", "numero_conteneur": None, "type_conteneur": "20DRY", "client_nom": "GUINNESS CAMEROUN SA", "nature_marchandise": "Orge Maltée pour Brasserie", "poids_kg": 22000, "nombre_colis": 800, "emplacement_destination": "MAG3-A03", "agent_reception": None, "statut": "PLANIFIE", "created_at": datetime.utcnow().isoformat()},
]

_next_id = 4

@router.get("/")
def list_receptions(statut: Optional[str] = None, navire: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _receptions[:]
    if statut:
        results = [r for r in results if r["statut"].upper() == statut.upper()]
    if navire:
        results = [r for r in results if navire.upper() in r["navire"].upper()]
    return {"total": len(results), "receptions": results[skip:skip+limit]}

@router.get("/{rec_id}")
def get_reception(rec_id: int):
    r = next((r for r in _receptions if r["id"] == rec_id), None)
    if not r:
        raise HTTPException(status_code=404, detail="Réception MAG3 non trouvée")
    return r

@router.post("/")
def create_reception(data: ReceptionCreate):
    global _next_id
    ref = f"REC-MAG3-{datetime.now().year}-{_next_id:03d}"
    rec = {**data.dict(), "id": _next_id, "reference": ref, "statut": "PLANIFIE", "created_at": datetime.utcnow().isoformat()}
    _receptions.append(rec)
    _next_id += 1
    return rec

@router.patch("/{rec_id}/confirmer")
def confirmer_reception(rec_id: int):
    r = next((r for r in _receptions if r["id"] == rec_id), None)
    if not r:
        raise HTTPException(status_code=404, detail="Réception non trouvée")
    r["statut"] = "RECEPTIONNE"
    return r

@router.patch("/{rec_id}/statut")
def update_reception_statut(rec_id: int, statut: str):
    r = next((r for r in _receptions if r["id"] == rec_id), None)
    if not r:
        raise HTTPException(status_code=404, detail="Réception non trouvée")
    r["statut"] = statut.upper()
    return r
