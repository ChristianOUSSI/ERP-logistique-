from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Bill of Lading"])

class BillOfLadingCreate(BaseModel):
    numero_bl: str
    navire: str
    armateur: Optional[str] = None
    chargeur: str
    consignataire: str
    port_chargement: str
    port_debarquement: str
    description_marchandise: str
    nombre_conteneurs: Optional[int] = None
    poids_brut_kg: Optional[float] = None
    volume_m3: Optional[float] = None
    valeur_fob_usd: Optional[float] = None
    incoterm: Optional[str] = "FOB"
    fret_payable: Optional[str] = "PREPAY"  # PREPAY, COLLECT

_bills = [
    {"id": 1, "reference": "BL-MSC-2026-7834561", "numero_bl": "MSCU7834561", "navire": "MSC GIOVANNA", "armateur": "MSC Mediterranean Shipping", "chargeur": "SAMSUNG EUROPE B.V.", "consignataire": "CFAO LOGISTICS CAMEROUN", "port_chargement": "Rotterdam", "port_debarquement": "Douala", "description_marchandise": "Électroménager Samsung – Réfrigérateurs, Climatiseurs, Lave-linge", "nombre_conteneurs": 1, "poids_brut_kg": 18500, "volume_m3": 65.2, "valeur_fob_usd": 285000, "incoterm": "FOB", "fret_payable": "PREPAY", "statut": "ORIGINAL_EMIS", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "BL-BTL-2026-4521873", "numero_bl": "BSCU4521873", "navire": "BOLLORE AFRIK EXPRESS", "armateur": "Bolloré Transport & Logistics", "chargeur": "ABIDJAN TRADING COMPANY", "consignataire": "SOCIETE CAMEROUNAISE DE PALME", "port_chargement": "Abidjan", "port_debarquement": "Douala", "description_marchandise": "Huile de Palme Brute – Vrac Liquide", "nombre_conteneurs": 1, "poids_brut_kg": 21000, "volume_m3": 23.8, "valeur_fob_usd": 42000, "incoterm": "CFR", "fret_payable": "COLLECT", "statut": "LIBERE", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "reference": "BL-CMA-2026-DKRXX001", "numero_bl": "CMADKRXX001", "navire": "CMA CGM DAKAR", "armateur": "CMA CGM Group", "chargeur": "GUINNESS WORLD BREWING LTD", "consignataire": "GUINNESS CAMEROUN SA", "port_chargement": "Le Havre", "port_debarquement": "Douala", "description_marchandise": "Orge Maltée pour Brasserie Industrielle", "nombre_conteneurs": 8, "poids_brut_kg": 176000, "volume_m3": 298.0, "valeur_fob_usd": 352000, "incoterm": "CIF", "fret_payable": "PREPAY", "statut": "EN_TRANSIT", "created_at": datetime.utcnow().isoformat()},
]

_next_id = 4

@router.get("/")
def list_bills_of_lading(statut: Optional[str] = None, consignataire: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _bills[:]
    if statut:
        results = [b for b in results if b["statut"].upper() == statut.upper()]
    if consignataire:
        results = [b for b in results if consignataire.upper() in b["consignataire"].upper()]
    return {"total": len(results), "bills": results[skip:skip+limit]}

@router.get("/{bl_id}")
def get_bill_of_lading(bl_id: int):
    b = next((b for b in _bills if b["id"] == bl_id), None)
    if not b:
        raise HTTPException(status_code=404, detail="Bill of Lading non trouvé")
    return b

@router.post("/")
def create_bill_of_lading(data: BillOfLadingCreate):
    global _next_id
    ref = f"BL-KAMLOG-{datetime.now().year}-{_next_id:06d}"
    bl = {**data.dict(), "id": _next_id, "reference": ref, "statut": "BROUILLON", "created_at": datetime.utcnow().isoformat()}
    _bills.append(bl)
    _next_id += 1
    return bl

@router.patch("/{bl_id}/liberer")
def liberer_bl(bl_id: int):
    b = next((b for b in _bills if b["id"] == bl_id), None)
    if not b:
        raise HTTPException(status_code=404, detail="BL non trouvé")
    b["statut"] = "LIBERE"
    return b

@router.patch("/{bl_id}/statut")
def update_bl_statut(bl_id: int, statut: str):
    b = next((b for b in _bills if b["id"] == bl_id), None)
    if not b:
        raise HTTPException(status_code=404, detail="BL non trouvé")
    b["statut"] = statut.upper()
    return b
