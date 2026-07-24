from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Acconage & Quai"])

class ManifestQuaiCreate(BaseModel):
    navire: str
    numero_escale: Optional[str] = None
    armateur: Optional[str] = None
    quai_affecte: Optional[str] = "QUAI-3"
    date_arrivee: Optional[str] = None
    date_depart_prevue: Optional[str] = None
    nombre_conteneurs: Optional[int] = None
    tonnage_brut_tonnes: Optional[float] = None
    agent_consignataire: Optional[str] = None

class OperationQuaiCreate(BaseModel):
    navire: str
    type_operation: str  # DECHARGEMENT, CHARGEMENT, TRANSROULAGE
    conteneur_ref: str
    grue_utilisee: Optional[str] = "GRUE-1"
    operateur: Optional[str] = None

_manifests_quai = [
    {"id": 1, "reference": "ESC-2026-0441", "navire": "MSC GIOVANNA", "numero_escale": "DLA-2026-441", "armateur": "MSC Mediterranean Shipping Company", "quai_affecte": "QUAI-3", "date_arrivee": "2026-08-15T06:00:00", "date_depart_prevue": "2026-08-18T12:00:00", "nombre_conteneurs": 42, "tonnage_brut_tonnes": 1240.5, "agent_consignataire": "SAGA CAMEROUN", "statut": "PROGRAMME", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "ESC-2026-0442", "navire": "CMA CGM DAKAR", "numero_escale": "DLA-2026-442", "armateur": "CMA CGM Group", "quai_affecte": "QUAI-1", "date_arrivee": "2026-08-22T08:00:00", "date_depart_prevue": "2026-08-25T16:00:00", "nombre_conteneurs": 8, "tonnage_brut_tonnes": 320.0, "agent_consignataire": "DELMAS CAMEROUN", "statut": "PROGRAMME", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "reference": "ESC-2026-0438", "navire": "BOLLORE AFRIK EXPRESS", "numero_escale": "DLA-2026-438", "armateur": "Bolloré Transport & Logistics", "quai_affecte": "QUAI-2", "date_arrivee": "2026-08-05T04:00:00", "date_depart_prevue": "2026-08-07T20:00:00", "nombre_conteneurs": 60, "tonnage_brut_tonnes": 2400.0, "agent_consignataire": "BOLLORE LOGISTICS", "statut": "DEPART", "created_at": datetime.utcnow().isoformat()},
]

_operations_quai = [
    {"id": 1, "navire": "BOLLORE AFRIK EXPRESS", "type_operation": "DECHARGEMENT", "conteneur_ref": "BSCU4521873", "grue_utilisee": "GRUE-2", "operateur": "MESSI André", "statut": "COMPLETE", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "navire": "MSC GIOVANNA", "type_operation": "DECHARGEMENT", "conteneur_ref": "MSCU7834561", "grue_utilisee": "GRUE-1", "operateur": "BIYA Jules", "statut": "PLANIFIE", "created_at": datetime.utcnow().isoformat()},
]

_next_manifest_id = 4
_next_op_id = 3

@router.get("/")
def acconage_dashboard():
    navires_actifs = len([m for m in _manifests_quai if m["statut"] in ["PROGRAMME", "EN_QUAI"]])
    conteneurs_a_decharger = sum(m["nombre_conteneurs"] or 0 for m in _manifests_quai if m["statut"] == "PROGRAMME")
    return {
        "kpis": {
            "navires_programmes": navires_actifs,
            "conteneurs_a_decharger": conteneurs_a_decharger,
            "quais_occupes": 1,
            "quais_disponibles": 2,
            "operations_en_cours": len([o for o in _operations_quai if o["statut"] == "EN_COURS"]),
        },
        "prochains_navires": [m for m in _manifests_quai if m["statut"] == "PROGRAMME"][:3],
        "operations_recentes": _operations_quai[:5],
    }

@router.get("/manifests")
def list_manifests_quai(statut: Optional[str] = None, quai: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _manifests_quai[:]
    if statut:
        results = [m for m in results if m["statut"].upper() == statut.upper()]
    if quai:
        results = [m for m in results if quai.upper() in m["quai_affecte"].upper()]
    return {"total": len(results), "manifests": results[skip:skip+limit]}

@router.get("/manifests/{manifest_id}")
def get_manifest(manifest_id: int):
    m = next((m for m in _manifests_quai if m["id"] == manifest_id), None)
    if not m:
        raise HTTPException(status_code=404, detail="Manifeste quai non trouvé")
    return m

@router.post("/manifests")
def create_manifest_quai(data: ManifestQuaiCreate):
    global _next_manifest_id
    ref = f"ESC-{datetime.now().year}-{_next_manifest_id:04d}"
    manifest = {**data.dict(), "id": _next_manifest_id, "reference": ref, "statut": "PROGRAMME", "created_at": datetime.utcnow().isoformat()}
    _manifests_quai.append(manifest)
    _next_manifest_id += 1
    return manifest

@router.get("/operations")
def list_operations_quai(type_operation: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _operations_quai[:]
    if type_operation:
        results = [o for o in results if o["type_operation"].upper() == type_operation.upper()]
    return {"total": len(results), "operations": results[skip:skip+limit]}

@router.post("/operations")
def create_operation_quai(data: OperationQuaiCreate):
    global _next_op_id
    op = {**data.dict(), "id": _next_op_id, "statut": "PLANIFIE", "created_at": datetime.utcnow().isoformat()}
    _operations_quai.append(op)
    _next_op_id += 1
    return op

@router.get("/quais")
def list_quais():
    return {
        "quais": [
            {"numero": "QUAI-1", "longueur_m": 220, "tirant_eau_m": 12.5, "statut": "DISPONIBLE", "navire_actuel": None},
            {"numero": "QUAI-2", "longueur_m": 280, "tirant_eau_m": 14.0, "statut": "DISPONIBLE", "navire_actuel": None},
            {"numero": "QUAI-3", "longueur_m": 350, "tirant_eau_m": 15.5, "statut": "OCCUPE", "navire_actuel": "MSC GIOVANNA"},
        ]
    }
