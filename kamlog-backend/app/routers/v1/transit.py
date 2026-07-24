from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Transit & Douane"])

class DossierTransitCreate(BaseModel):
    reference_externe: Optional[str] = None
    type_operation: str  # IMPORT, EXPORT, TRANSIT_CEMAC
    client_nom: str
    marchandise: str
    pays_origine: str
    pays_destination: str
    valeur_douaniere_xaf: Optional[float] = None
    droits_taxes_xaf: Optional[float] = None
    numero_manifeste: Optional[str] = None
    agent_douanier: Optional[str] = None

_dossiers_transit = [
    {"id": 1, "reference": "CEMAC-2026-089", "reference_externe": "CFAO-TR-2026-089", "type_operation": "TRANSIT_CEMAC", "client_nom": "CFAO LOGISTICS CAMEROUN", "marchandise": "Électroménager – Réfrigérateurs", "pays_origine": "Pays-Bas", "pays_destination": "Cameroun", "valeur_douaniere_xaf": 18500000, "droits_taxes_xaf": 2775000, "numero_manifeste": "MAN-2026-0441", "agent_douanier": "NGUEMA Patrick", "statut": "APPROUVE", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "CEMAC-2026-087", "reference_externe": None, "type_operation": "IMPORT", "client_nom": "GUINNESS CAMEROUN SA", "marchandise": "Orge Maltée", "pays_origine": "France", "pays_destination": "Cameroun", "valeur_douaniere_xaf": 44000000, "droits_taxes_xaf": 6600000, "numero_manifeste": "MAN-2026-0442", "agent_douanier": "EKOTTO Jules", "statut": "EN_ATTENTE_PAIEMENT", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "reference": "CEMAC-2026-088", "reference_externe": "OCM-IMPORT-091", "type_operation": "IMPORT", "client_nom": "ORANGE CAMEROUN", "marchandise": "Équipements Télécom – Antennes 5G", "pays_origine": "Chine", "pays_destination": "Cameroun", "valeur_douaniere_xaf": 25000000, "droits_taxes_xaf": 3750000, "numero_manifeste": None, "agent_douanier": None, "statut": "EN_COURS", "created_at": datetime.utcnow().isoformat()},
    {"id": 4, "reference": "CEMAC-2026-090", "reference_externe": None, "type_operation": "EXPORT", "client_nom": "SOCAPALM", "marchandise": "Huile de Palme Brute – Export Europe", "pays_origine": "Cameroun", "pays_destination": "Europe", "valeur_douaniere_xaf": 85000000, "droits_taxes_xaf": 0, "numero_manifeste": None, "agent_douanier": "ONDOUA Marie", "statut": "BROUILLON", "created_at": datetime.utcnow().isoformat()},
]

_next_id = 5

@router.get("/")
def list_dossiers_transit(
    type_operation: Optional[str] = None,
    statut: Optional[str] = None,
    client_nom: Optional[str] = None,
    skip: int = 0, limit: int = 50
):
    results = _dossiers_transit[:]
    if type_operation:
        results = [d for d in results if d["type_operation"].upper() == type_operation.upper()]
    if statut:
        results = [d for d in results if d["statut"].upper() == statut.upper()]
    if client_nom:
        results = [d for d in results if client_nom.upper() in d["client_nom"].upper()]
    return {
        "total": len(results),
        "en_attente": len([d for d in _dossiers_transit if d["statut"] == "EN_ATTENTE_PAIEMENT"]),
        "approuves": len([d for d in _dossiers_transit if d["statut"] == "APPROUVE"]),
        "dossiers": results[skip:skip+limit]
    }

@router.get("/{dossier_id}")
def get_dossier_transit(dossier_id: int):
    d = next((d for d in _dossiers_transit if d["id"] == dossier_id), None)
    if not d:
        raise HTTPException(status_code=404, detail="Dossier transit non trouvé")
    return d

@router.post("/")
def create_dossier_transit(data: DossierTransitCreate):
    global _next_id
    ref = f"CEMAC-{datetime.now().year}-{_next_id:03d}"
    dossier = {**data.dict(), "id": _next_id, "reference": ref, "statut": "BROUILLON", "created_at": datetime.utcnow().isoformat()}
    _dossiers_transit.append(dossier)
    _next_id += 1
    return dossier

@router.patch("/{dossier_id}/statut")
def update_transit_statut(dossier_id: int, statut: str):
    d = next((d for d in _dossiers_transit if d["id"] == dossier_id), None)
    if not d:
        raise HTTPException(status_code=404, detail="Dossier transit non trouvé")
    d["statut"] = statut.upper()
    return d

@router.get("/conformite/douaniere")
def check_douane_conformite():
    return {
        "taux_conformite_pct": 94.5,
        "dossiers_total": len(_dossiers_transit),
        "non_conformes": 2,
        "alertes_delai_depasse": 1,
        "reglement_applicable": "CEMAC 2019, OHADA, ZLECAF",
    }
