from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["K-Magasin WMS"])

class StockCreate(BaseModel):
    sku: str
    designation: str
    quantite: float
    emplacement: Optional[str] = "MAG3-A01"
    unite: Optional[str] = "UN"
    seuil_critique: Optional[float] = 10.0
    categorie: Optional[str] = "MARCHANDISE"

class MouvementCreate(BaseModel):
    sku: str
    type_mouvement: str  # ENTREE, SORTIE, TRANSFERT
    quantite: float
    origine: Optional[str] = None
    destination: Optional[str] = None
    commentaire: Optional[str] = None

_stocks = [
    {"id": 1, "sku": "CONT-40HQ-001", "designation": "Conteneur 40ft High Cube", "quantite": 12, "emplacement": "YARD-A01", "unite": "UN", "seuil_critique": 5, "categorie": "CONTENEUR", "statut": "DISPONIBLE", "updated_at": datetime.utcnow().isoformat()},
    {"id": 2, "sku": "CONT-20DRY-002", "designation": "Conteneur 20ft Dry", "quantite": 28, "emplacement": "YARD-B02", "unite": "UN", "seuil_critique": 8, "categorie": "CONTENEUR", "statut": "DISPONIBLE", "updated_at": datetime.utcnow().isoformat()},
    {"id": 3, "sku": "PAL-EUR-003", "designation": "Palette Europallet 1200x800", "quantite": 450, "emplacement": "MAG3-A03", "unite": "UN", "seuil_critique": 50, "categorie": "EMBALLAGE", "statut": "DISPONIBLE", "updated_at": datetime.utcnow().isoformat()},
    {"id": 4, "sku": "FUEL-GASOIL-004", "designation": "Gasoil B7 (Carburant)", "quantite": 8500, "emplacement": "CUVE-F01", "unite": "LITRES", "seuil_critique": 1000, "categorie": "CARBURANT", "statut": "DISPONIBLE", "updated_at": datetime.utcnow().isoformat()},
    {"id": 5, "sku": "COLIS-GEN-005", "designation": "Colis Marchandise Générale", "quantite": 1240, "emplacement": "MAG3-C01", "unite": "UN", "seuil_critique": 100, "categorie": "MARCHANDISE", "statut": "DISPONIBLE", "updated_at": datetime.utcnow().isoformat()},
    {"id": 6, "sku": "MAT-SOUDURE-006", "designation": "Matériel de Soudure (Consommables)", "quantite": 4, "emplacement": "ATL-M01", "unite": "KIT", "seuil_critique": 5, "categorie": "CONSOMMABLE", "statut": "CRITIQUE", "updated_at": datetime.utcnow().isoformat()},
]

_mouvements = [
    {"id": 1, "sku": "CONT-40HQ-001", "type_mouvement": "ENTREE", "quantite": 3, "origine": "PORT DOUALA", "destination": "YARD-A01", "commentaire": "Déchargement navire MSC Giovanna", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "sku": "PAL-EUR-003", "type_mouvement": "SORTIE", "quantite": 20, "origine": "MAG3-A03", "destination": "CFAO LOGISTICS", "commentaire": "BL-2026-0441", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "sku": "FUEL-GASOIL-004", "type_mouvement": "SORTIE", "quantite": 450, "origine": "CUVE-F01", "destination": "DLA-TRK-007", "commentaire": "Ticket carburant #FUEL-2026-088", "created_at": datetime.utcnow().isoformat()},
]

_emplacements = [
    {"id": 1, "code": "YARD-A01", "zone": "YARD", "type": "CONTENEUR", "capacite": 20, "occupe": 12, "statut": "PARTIELLEMENT_PLEIN"},
    {"id": 2, "code": "MAG3-A01", "zone": "MAGASIN_3", "type": "PALETTES", "capacite": 100, "occupe": 45, "statut": "DISPONIBLE"},
    {"id": 3, "code": "MAG3-C01", "zone": "MAGASIN_3", "type": "COLIS", "capacite": 2000, "occupe": 1240, "statut": "PARTIELLEMENT_PLEIN"},
    {"id": 4, "code": "CUVE-F01", "zone": "CARBURANT", "type": "LIQUIDE", "capacite": 20000, "occupe": 8500, "statut": "DISPONIBLE"},
    {"id": 5, "code": "ATL-M01", "zone": "ATELIER", "type": "DIVERS", "capacite": 50, "occupe": 4, "statut": "DISPONIBLE"},
]

_next_stock_id = 7
_next_mouv_id = 4

@router.get("/dashboard")
def magasin_dashboard():
    total_articles = len(_stocks)
    stock_critique = len([s for s in _stocks if s["statut"] == "CRITIQUE"])
    valeur_stock = sum(s["quantite"] * 15000 for s in _stocks)  # XAF estimé
    taux_remplissage = round(sum(e["occupe"]/e["capacite"]*100 for e in _emplacements) / len(_emplacements), 1)
    return {
        "kpis": {
            "total_articles_references": total_articles,
            "articles_en_rupture_ou_critique": stock_critique,
            "valeur_stock_xaf": valeur_stock,
            "taux_remplissage_moyen_pct": taux_remplissage,
            "mouvements_aujourd_hui": len(_mouvements),
            "emplacements_disponibles": len([e for e in _emplacements if e["statut"] == "DISPONIBLE"]),
        },
        "top_mouvements_recents": _mouvements[:5],
        "alertes_stock_critique": [s for s in _stocks if s["statut"] == "CRITIQUE"],
    }

@router.get("/stocks")
def list_stocks(
    statut: Optional[str] = None,
    categorie: Optional[str] = None,
    emplacement: Optional[str] = None,
    skip: int = 0, limit: int = 100
):
    results = _stocks[:]
    if statut:
        results = [s for s in results if s["statut"].upper() == statut.upper()]
    if categorie:
        results = [s for s in results if s["categorie"].upper() == categorie.upper()]
    if emplacement:
        results = [s for s in results if emplacement.upper() in s["emplacement"].upper()]
    return {"total": len(results), "stocks": results[skip:skip+limit]}

@router.get("/stocks/{stock_id}")
def get_stock(stock_id: int):
    s = next((s for s in _stocks if s["id"] == stock_id), None)
    if not s:
        raise HTTPException(status_code=404, detail="Article stock non trouvé")
    return s

@router.post("/stocks")
def create_stock(data: StockCreate):
    global _next_stock_id
    quantite = data.quantite
    statut = "CRITIQUE" if quantite <= data.seuil_critique else "DISPONIBLE"
    stock = {**data.dict(), "id": _next_stock_id, "statut": statut, "updated_at": datetime.utcnow().isoformat()}
    _stocks.append(stock)
    _next_stock_id += 1
    return stock

@router.get("/mouvements")
def list_mouvements(type_mouvement: Optional[str] = None, skip: int = 0, limit: int = 100):
    results = _mouvements[:]
    if type_mouvement:
        results = [m for m in results if m["type_mouvement"].upper() == type_mouvement.upper()]
    return {"total": len(results), "mouvements": results[skip:skip+limit]}

@router.post("/mouvements")
def create_mouvement(data: MouvementCreate):
    global _next_mouv_id
    stock = next((s for s in _stocks if s["sku"] == data.sku), None)
    if stock:
        if data.type_mouvement.upper() == "ENTREE":
            stock["quantite"] += data.quantite
        elif data.type_mouvement.upper() == "SORTIE":
            if stock["quantite"] < data.quantite:
                raise HTTPException(status_code=400, detail="Stock insuffisant")
            stock["quantite"] -= data.quantite
        stock["statut"] = "CRITIQUE" if stock["quantite"] <= stock["seuil_critique"] else "DISPONIBLE"
        stock["updated_at"] = datetime.utcnow().isoformat()
    mouv = {**data.dict(), "id": _next_mouv_id, "created_at": datetime.utcnow().isoformat()}
    _mouvements.insert(0, mouv)
    _next_mouv_id += 1
    return mouv

@router.get("/emplacements")
def list_emplacements(zone: Optional[str] = None, statut: Optional[str] = None):
    results = _emplacements[:]
    if zone:
        results = [e for e in results if e["zone"].upper() == zone.upper()]
    if statut:
        results = [e for e in results if e["statut"].upper() == statut.upper()]
    return {"total": len(results), "emplacements": results}

@router.get("/emplacements/{emplacement_code}/stocks")
def stocks_par_emplacement(emplacement_code: str):
    stocks = [s for s in _stocks if s["emplacement"].upper() == emplacement_code.upper()]
    return {"emplacement": emplacement_code, "stocks": stocks}
