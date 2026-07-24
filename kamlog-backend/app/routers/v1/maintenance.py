from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Maintenance Atelier"])

class OrdreReparationCreate(BaseModel):
    vehicule_immat: str
    type_travaux: str  # PREVENTIVE, CORRECTIVE, PNEUS, CARROSSERIE, ELECTRIQUE
    description: str
    priorite: Optional[str] = "NORMALE"  # URGENTE, HAUTE, NORMALE
    cout_estime_xaf: Optional[float] = None
    mecanicien_assigne: Optional[str] = None
    pieces_necessaires: Optional[List[str]] = None

class PieceRechangeCreate(BaseModel):
    reference: str
    designation: str
    quantite_stock: float
    seuil_critique: Optional[float] = 2
    cout_unitaire_xaf: Optional[float] = None
    fournisseur: Optional[str] = None

_ordres_reparation = [
    {"id": 1, "reference": "OR-2026-001", "vehicule_immat": "DLA-TRK-007", "type_travaux": "PREVENTIVE", "description": "Vidange moteur complète + remplacement filtre huile, gasoil et air", "priorite": "HAUTE", "cout_estime_xaf": 185000, "mecanicien_assigne": "NKOA Bertrand", "pieces_necessaires": ["Huile Moteur 15W40", "Filtre à huile", "Filtre gasoil"], "statut": "EN_COURS", "debut_at": datetime.utcnow().isoformat(), "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "OR-2026-002", "vehicule_immat": "DLA-TRK-001", "type_travaux": "PNEUS", "description": "Remplacement 4 pneumatiques avant + équilibrage roues", "priorite": "URGENTE", "cout_estime_xaf": 480000, "mecanicien_assigne": "NGONO Serge", "pieces_necessaires": ["Pneu Michelin 315/70R22.5 x4"], "statut": "EN_ATTENTE_PIECES", "debut_at": None, "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "reference": "OR-2026-003", "vehicule_immat": "DLA-TRK-002", "type_travaux": "ELECTRIQUE", "description": "Diagnostic panneau de bord – voyant moteur allumé", "priorite": "NORMALE", "cout_estime_xaf": 75000, "mecanicien_assigne": None, "pieces_necessaires": [], "statut": "PLANIFIE", "debut_at": None, "created_at": datetime.utcnow().isoformat()},
]

_pieces_rechange = [
    {"id": 1, "reference": "PR-HUILE-001", "designation": "Huile Moteur 15W40 (bidon 20L)", "quantite_stock": 8, "seuil_critique": 3, "cout_unitaire_xaf": 45000, "fournisseur": "TOTALENERGIES CAMEROUN", "statut": "DISPONIBLE"},
    {"id": 2, "reference": "PR-PNEU-001", "designation": "Pneu Michelin 315/70R22.5", "quantite_stock": 1, "seuil_critique": 4, "cout_unitaire_xaf": 120000, "fournisseur": "MICHELIN AFRIQUE CENTRALE", "statut": "CRITIQUE"},
    {"id": 3, "reference": "PR-FILTRE-001", "designation": "Filtre à huile Volvo FH16", "quantite_stock": 6, "seuil_critique": 2, "cout_unitaire_xaf": 12000, "fournisseur": "VOLVO TRUCKS CAMEROUN", "statut": "DISPONIBLE"},
    {"id": 4, "reference": "PR-FREIN-001", "designation": "Plaquettes de frein DAF XF", "quantite_stock": 2, "seuil_critique": 2, "cout_unitaire_xaf": 85000, "fournisseur": "DAF TRUCKS AFRIQUE", "statut": "CRITIQUE"},
]

_next_or_id = 4
_next_piece_id = 5

@router.get("/")
def maintenance_dashboard():
    return {
        "kpis": {
            "ordres_ouverts": len([o for o in _ordres_reparation if o["statut"] in ["EN_ATTENTE_PIECES", "EN_COURS", "PLANIFIE"]]),
            "ordres_urgents": len([o for o in _ordres_reparation if o["priorite"] == "URGENTE"]),
            "pieces_en_rupture_critique": len([p for p in _pieces_rechange if p["statut"] == "CRITIQUE"]),
            "cout_total_estime_xaf": sum(o.get("cout_estime_xaf", 0) or 0 for o in _ordres_reparation if o["statut"] != "CLOTURE"),
        },
        "ordres_urgents": [o for o in _ordres_reparation if o["priorite"] == "URGENTE"],
        "pieces_critiques": [p for p in _pieces_rechange if p["statut"] == "CRITIQUE"],
    }

@router.get("/ordres")
def list_ordres_reparation(statut: Optional[str] = None, priorite: Optional[str] = None, vehicule: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _ordres_reparation[:]
    if statut:
        results = [o for o in results if o["statut"].upper() == statut.upper()]
    if priorite:
        results = [o for o in results if o["priorite"].upper() == priorite.upper()]
    if vehicule:
        results = [o for o in results if vehicule.upper() in o["vehicule_immat"].upper()]
    return {"total": len(results), "ordres": results[skip:skip+limit]}

@router.get("/ordres/{or_id}")
def get_ordre_reparation(or_id: int):
    o = next((o for o in _ordres_reparation if o["id"] == or_id), None)
    if not o:
        raise HTTPException(status_code=404, detail="Ordre de réparation non trouvé")
    return o

@router.post("/ordres")
def create_ordre_reparation(data: OrdreReparationCreate):
    global _next_or_id
    ref = f"OR-{datetime.now().year}-{_next_or_id:03d}"
    ordre = {**data.dict(), "id": _next_or_id, "reference": ref, "statut": "PLANIFIE", "debut_at": None, "created_at": datetime.utcnow().isoformat()}
    _ordres_reparation.append(ordre)
    _next_or_id += 1
    return ordre

@router.patch("/ordres/{or_id}/statut")
def update_ordre_statut(or_id: int, statut: str):
    o = next((o for o in _ordres_reparation if o["id"] == or_id), None)
    if not o:
        raise HTTPException(status_code=404, detail="Ordre de réparation non trouvé")
    o["statut"] = statut.upper()
    if statut.upper() == "EN_COURS":
        o["debut_at"] = datetime.utcnow().isoformat()
    return o

@router.get("/pieces")
def list_pieces_rechange(statut: Optional[str] = None):
    results = _pieces_rechange[:]
    if statut:
        results = [p for p in results if p["statut"].upper() == statut.upper()]
    return {"total": len(results), "pieces": results}

@router.post("/pieces")
def create_piece_rechange(data: PieceRechangeCreate):
    global _next_piece_id
    statut = "CRITIQUE" if data.quantite_stock <= (data.seuil_critique or 0) else "DISPONIBLE"
    piece = {**data.dict(), "id": _next_piece_id, "statut": statut}
    _pieces_rechange.append(piece)
    _next_piece_id += 1
    return piece
