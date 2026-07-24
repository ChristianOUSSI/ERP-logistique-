from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Goods Declaration"])

class GoodsDeclarationCreate(BaseModel):
    numero_manifeste: str
    navire: str
    armateur: Optional[str] = None
    port_origine: str
    port_destination: Optional[str] = "Port de Douala"
    date_arrivee_prevue: Optional[str] = None
    nature_marchandise: str
    poids_tonnes: Optional[float] = None
    nombre_conteneurs: Optional[int] = None
    valeur_fob_usd: Optional[float] = None

_declarations = [
    {"id": 1, "numero_manifeste": "MAN-2026-0441", "navire": "MSC GIOVANNA", "armateur": "MSC Mediterranean Shipping", "port_origine": "Rotterdam (Pays-Bas)", "port_destination": "Port de Douala", "date_arrivee_prevue": "2026-08-15", "nature_marchandise": "Conteneurs Marchandise Générale", "poids_tonnes": 1240.5, "nombre_conteneurs": 42, "valeur_fob_usd": 890000, "statut": "EN_ROUTE", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "numero_manifeste": "MAN-2026-0442", "navire": "CMA CGM DAKAR", "armateur": "CMA CGM Cameroun", "port_origine": "Le Havre (France)", "port_destination": "Port de Douala", "date_arrivee_prevue": "2026-08-22", "nature_marchandise": "Véhicules & Pièces Détachées", "poids_tonnes": 320.0, "nombre_conteneurs": 8, "valeur_fob_usd": 1200000, "statut": "CONFIRMEE", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "numero_manifeste": "MAN-2026-0438", "navire": "BOLLORE AFRIK EXPRESS", "armateur": "Bolloré Logistics", "port_origine": "Abidjan (Côte d'Ivoire)", "port_destination": "Port de Douala", "date_arrivee_prevue": "2026-08-05", "nature_marchandise": "Produits Alimentaires (Riz, Farine)", "poids_tonnes": 2400.0, "nombre_conteneurs": 60, "valeur_fob_usd": 450000, "statut": "DEBARQUEE", "created_at": datetime.utcnow().isoformat()},
]

_next_id = 4

@router.get("/")
def list_declarations(statut: Optional[str] = None, navire: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _declarations[:]
    if statut:
        results = [d for d in results if d["statut"].upper() == statut.upper()]
    if navire:
        results = [d for d in results if navire.upper() in d["navire"].upper()]
    return {"total": len(results), "declarations": results[skip:skip+limit]}

@router.get("/{decl_id}")
def get_declaration(decl_id: int):
    d = next((d for d in _declarations if d["id"] == decl_id), None)
    if not d:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    return d

@router.post("/")
def create_declaration(data: GoodsDeclarationCreate):
    global _next_id
    decl = {**data.dict(), "id": _next_id, "statut": "BROUILLON", "created_at": datetime.utcnow().isoformat()}
    _declarations.append(decl)
    _next_id += 1
    return decl

@router.patch("/{decl_id}/statut")
def update_declaration_statut(decl_id: int, statut: str):
    d = next((d for d in _declarations if d["id"] == decl_id), None)
    if not d:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    d["statut"] = statut.upper()
    return d
