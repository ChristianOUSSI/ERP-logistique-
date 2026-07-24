from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Admin Agences Portuaires"])

class AgenceCreate(BaseModel):
    nom: str
    code: str
    type_agence: str  # CONSIGNATAIRE, TRANSITAIRE, ACCONIER, SHIPPING_LINE, MANUTENTIONNAIRE
    adresse: Optional[str] = None
    ville: Optional[str] = "Douala"
    contact_nom: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    numero_agrement: Optional[str] = None
    port_affecte: Optional[str] = "PORT DOUALA"

_agences = [
    {"id": 1, "nom": "SAGA CAMEROUN", "code": "SAGA-CM", "type_agence": "CONSIGNATAIRE", "adresse": "Zone Portuaire, BP 284", "ville": "Douala", "contact_nom": "Directeur Maritime", "contact_email": "ops@saga-cameroun.cm", "contact_phone": "+237 233 421 100", "numero_agrement": "AGR-PORT-2001-001", "port_affecte": "PORT DOUALA", "statut": "ACTIF", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "nom": "DELMAS CAMEROUN", "code": "DELMAS-CM", "type_agence": "SHIPPING_LINE", "adresse": "Boulevard Général de Gaulle", "ville": "Douala", "contact_nom": "Agent Maritime", "contact_email": "douala@cma-cgm.com", "contact_phone": "+237 233 421 200", "numero_agrement": "AGR-PORT-1995-002", "port_affecte": "PORT DOUALA", "statut": "ACTIF", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "nom": "BOLLORÉ TRANSPORT & LOGISTICS", "code": "BTL-CM", "type_agence": "TRANSITAIRE", "adresse": "Zone Industrielle Bassa", "ville": "Douala", "contact_nom": "Directeur Opérations", "contact_email": "ops.douala@bollore.com", "contact_phone": "+237 233 502 000", "numero_agrement": "AGR-PORT-1998-003", "port_affecte": "PORT DOUALA", "statut": "ACTIF", "created_at": datetime.utcnow().isoformat()},
    {"id": 4, "nom": "PAD – PORT AUTONOME DE DOUALA", "code": "PAD-DLA", "type_agence": "MANUTENTIONNAIRE", "adresse": "Boulevard de la Liberté, BP 4020", "ville": "Douala", "contact_nom": "Direction Générale", "contact_email": "dg@pad.cm", "contact_phone": "+237 233 421 300", "numero_agrement": "AGR-PORT-1999-000", "port_affecte": "PORT DOUALA", "statut": "ACTIF", "created_at": datetime.utcnow().isoformat()},
]

_next_id = 5

@router.get("/")
def list_agences(type_agence: Optional[str] = None, statut: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _agences[:]
    if type_agence:
        results = [a for a in results if a["type_agence"].upper() == type_agence.upper()]
    if statut:
        results = [a for a in results if a["statut"].upper() == statut.upper()]
    return {"total": len(results), "agences": results[skip:skip+limit]}

@router.get("/{agence_id}")
def get_agence(agence_id: int):
    a = next((a for a in _agences if a["id"] == agence_id), None)
    if not a:
        raise HTTPException(status_code=404, detail="Agence non trouvée")
    return a

@router.post("/")
def create_agence(data: AgenceCreate):
    global _next_id
    agence = {**data.dict(), "id": _next_id, "statut": "ACTIF", "created_at": datetime.utcnow().isoformat()}
    _agences.append(agence)
    _next_id += 1
    return agence

@router.put("/{agence_id}")
def update_agence(agence_id: int, data: AgenceCreate):
    a = next((a for a in _agences if a["id"] == agence_id), None)
    if not a:
        raise HTTPException(status_code=404, detail="Agence non trouvée")
    a.update(data.dict())
    return a

@router.delete("/{agence_id}")
def desactiver_agence(agence_id: int):
    a = next((a for a in _agences if a["id"] == agence_id), None)
    if not a:
        raise HTTPException(status_code=404, detail="Agence non trouvée")
    a["statut"] = "INACTIF"
    return {"message": "Agence désactivée"}
