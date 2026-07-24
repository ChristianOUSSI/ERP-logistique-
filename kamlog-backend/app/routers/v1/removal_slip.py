from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Removal Slip - Bons d'Enlèvement"])

class RemovalSlipCreate(BaseModel):
    client_nom: str
    client_ref: Optional[str] = None
    conteneur_ref: Optional[str] = None
    nature_marchandise: str
    poids_kg: Optional[float] = None
    emplacement_actuel: Optional[str] = "MAG3"
    chauffeur_nom: Optional[str] = None
    vehicule_immat: Optional[str] = None
    numero_manifeste: Optional[str] = None

_removal_slips = [
    {"id": 1, "reference": "BL-2026-0441", "client_nom": "CFAO LOGISTICS CAMEROUN", "client_ref": "CFAO-PO-2026-188", "conteneur_ref": "CONT-40HQ-001", "nature_marchandise": "Marchandise Générale – Électroménager", "poids_kg": 18500, "emplacement_actuel": "YARD-A01", "chauffeur_nom": "Jean-Marc MVONDO", "vehicule_immat": "DLA-TRK-001", "numero_manifeste": "MAN-2026-0441", "statut": "VALIDE", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "BL-2026-0442", "client_nom": "GUINNESS CAMEROUN SA", "client_ref": "GCSA-2026-034", "conteneur_ref": "CONT-20DRY-002", "nature_marchandise": "Matières Premières Brasserie", "poids_kg": 22000, "emplacement_actuel": "YARD-B02", "chauffeur_nom": "Martin EBANG", "vehicule_immat": "DLA-TRK-002", "numero_manifeste": "MAN-2026-0438", "statut": "EN_ATTENTE", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "reference": "BL-2026-0443", "client_nom": "ORANGE CAMEROUN", "client_ref": "OCM-2026-091", "conteneur_ref": None, "nature_marchandise": "Équipements Télécom – Antennes 5G", "poids_kg": 3400, "emplacement_actuel": "MAG3-A03", "chauffeur_nom": None, "vehicule_immat": None, "numero_manifeste": None, "statut": "BROUILLON", "created_at": datetime.utcnow().isoformat()},
]

_next_id = 4

@router.get("/")
def list_removal_slips(statut: Optional[str] = None, client_nom: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _removal_slips[:]
    if statut:
        results = [r for r in results if r["statut"].upper() == statut.upper()]
    if client_nom:
        results = [r for r in results if client_nom.upper() in r["client_nom"].upper()]
    return {"total": len(results), "removal_slips": results[skip:skip+limit]}

@router.get("/{slip_id}")
def get_removal_slip(slip_id: int):
    s = next((s for s in _removal_slips if s["id"] == slip_id), None)
    if not s:
        raise HTTPException(status_code=404, detail="Bon d'enlèvement non trouvé")
    return s

@router.post("/")
def create_removal_slip(data: RemovalSlipCreate):
    global _next_id
    ref = f"BL-{datetime.now().year}-{_next_id:04d}"
    slip = {**data.dict(), "id": _next_id, "reference": ref, "statut": "BROUILLON", "created_at": datetime.utcnow().isoformat()}
    _removal_slips.append(slip)
    _next_id += 1
    return slip

@router.patch("/{slip_id}/valider")
def valider_bon(slip_id: int):
    s = next((s for s in _removal_slips if s["id"] == slip_id), None)
    if not s:
        raise HTTPException(status_code=404, detail="Bon d'enlèvement non trouvé")
    s["statut"] = "VALIDE"
    return s

@router.patch("/{slip_id}/statut")
def update_removal_slip_statut(slip_id: int, statut: str):
    s = next((s for s in _removal_slips if s["id"] == slip_id), None)
    if not s:
        raise HTTPException(status_code=404, detail="Bon d'enlèvement non trouvé")
    s["statut"] = statut.upper()
    return s
