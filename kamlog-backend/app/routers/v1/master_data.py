from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Master Data"])

class ArticleCreate(BaseModel):
    code: str
    designation: str
    categorie: str  # CONTENEUR, EMBALLAGE, CARBURANT, MARCHANDISE, PIECE_RECHANGE
    sous_categorie: Optional[str] = None
    unite: Optional[str] = "UN"
    poids_unitaire_kg: Optional[float] = None
    volume_unitaire_m3: Optional[float] = None
    prix_reference_xaf: Optional[float] = None
    code_douanier: Optional[str] = None
    description: Optional[str] = None

class CategorieCreate(BaseModel):
    nom: str
    code: str
    description: Optional[str] = None

_articles = [
    {"id": 1, "code": "ART-CONT-40HQ", "designation": "Conteneur Maritime 40ft High Cube", "categorie": "CONTENEUR", "sous_categorie": "DRY", "unite": "UN", "poids_unitaire_kg": 3950, "volume_unitaire_m3": 76.3, "prix_reference_xaf": 2500000, "code_douanier": "8609.00.00.00", "description": "Conteneur de transport maritime 40 pieds High Cube – capacité 76,3 m³"},
    {"id": 2, "code": "ART-CONT-20DRY", "designation": "Conteneur Maritime 20ft Dry Standard", "categorie": "CONTENEUR", "sous_categorie": "DRY", "unite": "UN", "poids_unitaire_kg": 2200, "volume_unitaire_m3": 33.2, "prix_reference_xaf": 1500000, "code_douanier": "8609.00.00.00", "description": "Conteneur de transport maritime 20 pieds standard"},
    {"id": 3, "code": "ART-FUEL-GASOIL", "designation": "Gasoil B7 – Carburant Transport", "categorie": "CARBURANT", "sous_categorie": None, "unite": "LITRE", "poids_unitaire_kg": 0.84, "volume_unitaire_m3": 0.001, "prix_reference_xaf": 720, "code_douanier": "2710.19.41.00", "description": "Carburant Gasoil B7 pour moteurs diesel"},
    {"id": 4, "code": "ART-PAL-EUR", "designation": "Palette Europallet 1200x800mm", "categorie": "EMBALLAGE", "sous_categorie": "PALETTE", "unite": "UN", "poids_unitaire_kg": 25, "volume_unitaire_m3": 0.098, "prix_reference_xaf": 15000, "code_douanier": "4415.20.90.00", "description": "Palette en bois EPAL 1200x800mm – norme EUR/EPAL"},
    {"id": 5, "code": "ART-PNEU-315", "designation": "Pneu Michelin 315/70R22.5 XLine Energy D", "categorie": "PIECE_RECHANGE", "sous_categorie": "PNEUMATIQUE", "unite": "UN", "poids_unitaire_kg": 72, "volume_unitaire_m3": 0.18, "prix_reference_xaf": 120000, "code_douanier": "4011.20.00.00", "description": "Pneumatique grande résistance pour essieux moteurs poids lourds"},
    {"id": 6, "code": "ART-FRET-GEN", "designation": "Marchandise Générale (Unité Logistique)", "categorie": "MARCHANDISE", "sous_categorie": "DIVERS", "unite": "KG", "poids_unitaire_kg": 1, "volume_unitaire_m3": None, "prix_reference_xaf": None, "code_douanier": None, "description": "Article générique pour saisie marchandise non cataloguée"},
]

_categories = [
    {"id": 1, "nom": "Conteneurs Maritimes", "code": "CONTENEUR", "description": "Conteneurs de transport maritime (20ft, 40ft, HC, RF...)"},
    {"id": 2, "nom": "Carburants & Lubrifiants", "code": "CARBURANT", "description": "Gasoil, essence, huiles moteur et lubrifiants industriels"},
    {"id": 3, "nom": "Emballages & Conditionnement", "code": "EMBALLAGE", "description": "Palettes, caisses, housses, films d'emballage"},
    {"id": 4, "nom": "Pièces de Rechange", "code": "PIECE_RECHANGE", "description": "Pièces auto et poids lourds, pneumatiques, filtres"},
    {"id": 5, "nom": "Marchandises Générales", "code": "MARCHANDISE", "description": "Marchandises de négoce et fret divers"},
]

_incoterms = ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"]
_types_conteneurs = ["20DRY", "40DRY", "40HC", "20RF", "40RF", "20OT", "40OT", "45HC", "20FR", "40FR"]

_next_art_id = 7
_next_cat_id = 6

@router.get("/articles")
def list_articles(categorie: Optional[str] = None, search: Optional[str] = None, skip: int = 0, limit: int = 100):
    results = _articles[:]
    if categorie:
        results = [a for a in results if a["categorie"].upper() == categorie.upper()]
    if search:
        results = [a for a in results if search.upper() in a["designation"].upper() or search.upper() in a["code"].upper()]
    return {"total": len(results), "articles": results[skip:skip+limit]}

@router.get("/articles/{art_id}")
def get_article(art_id: int):
    a = next((a for a in _articles if a["id"] == art_id), None)
    if not a:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return a

@router.post("/articles")
def create_article(data: ArticleCreate):
    global _next_art_id
    article = {**data.dict(), "id": _next_art_id, "created_at": datetime.utcnow().isoformat()}
    _articles.append(article)
    _next_art_id += 1
    return article

@router.get("/categories")
def list_categories():
    return {"total": len(_categories), "categories": _categories}

@router.post("/categories")
def create_categorie(data: CategorieCreate):
    global _next_cat_id
    cat = {**data.dict(), "id": _next_cat_id}
    _categories.append(cat)
    _next_cat_id += 1
    return cat

@router.get("/incoterms")
def list_incoterms():
    return {"incoterms": _incoterms}

@router.get("/types-conteneurs")
def list_types_conteneurs():
    return {"types_conteneurs": _types_conteneurs}

@router.get("/pays")
def list_pays_cemac():
    return {
        "pays_cemac": [
            {"code": "CM", "nom": "Cameroun", "capitale": "Yaoundé", "devise": "XAF"},
            {"code": "GA", "nom": "Gabon", "capitale": "Libreville", "devise": "XAF"},
            {"code": "CG", "nom": "République du Congo", "capitale": "Brazzaville", "devise": "XAF"},
            {"code": "CF", "nom": "République Centrafricaine", "capitale": "Bangui", "devise": "XAF"},
            {"code": "TD", "nom": "Tchad", "capitale": "N'Djamena", "devise": "XAF"},
            {"code": "GQ", "nom": "Guinée Équatoriale", "capitale": "Malabo", "devise": "XAF"},
        ]
    }
