from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Achats & Procurement"])

class PurchaseOrderCreate(BaseModel):
    fournisseur: str
    description: str
    categorie: Optional[str] = "FOURNITURES"  # FOURNITURES, PIECES_RECHANGE, CARBURANT, SERVICES
    quantite: Optional[float] = 1
    unite: Optional[str] = "UN"
    prix_unitaire_xaf: Optional[float] = None
    montant_total_xaf: Optional[float] = None
    demandeur: Optional[str] = None
    urgence: Optional[bool] = False

class RequisitionCreate(BaseModel):
    titre: str
    description: str
    categorie: Optional[str] = "FOURNITURES"
    montant_estime_xaf: Optional[float] = None
    demandeur: str
    service: Optional[str] = None
    justification: Optional[str] = None

_purchase_orders = [
    {"id": 1, "reference": "PO-2026-001", "fournisseur": "TOTALENERGIES CAMEROUN", "description": "Carburant Gasoil B7 – 5000 litres", "categorie": "CARBURANT", "quantite": 5000, "unite": "LITRES", "prix_unitaire_xaf": 720, "montant_total_xaf": 3600000, "demandeur": "KAMGA Paul", "urgence": False, "statut": "APPROUVE", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "PO-2026-002", "fournisseur": "MICHELIN AFRIQUE CENTRALE", "description": "Pneus Michelin 315/70R22.5 – 8 unités", "categorie": "PIECES_RECHANGE", "quantite": 8, "unite": "UN", "prix_unitaire_xaf": 120000, "montant_total_xaf": 960000, "demandeur": "NKOA Bertrand", "urgence": True, "statut": "EN_ATTENTE_VALIDATION", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "reference": "PO-2026-003", "fournisseur": "OFFICE NATIONAL DE SECURITE ROUTIERE", "description": "Renouvellement 12 vignettes techniques véhicules", "categorie": "SERVICES", "quantite": 12, "unite": "UN", "prix_unitaire_xaf": 35000, "montant_total_xaf": 420000, "demandeur": "Direction Parc", "urgence": False, "statut": "BROUILLON", "created_at": datetime.utcnow().isoformat()},
]

_requisitions = [
    {"id": 1, "reference": "REQ-2026-001", "titre": "Uniformes conducteurs 2026", "description": "Renouvellement dotation annuelle uniformes – 25 conducteurs", "categorie": "FOURNITURES", "montant_estime_xaf": 750000, "demandeur": "Direction RH", "service": "RESSOURCES HUMAINES", "justification": "Renouvellement annuel obligatoire CODIR", "statut": "APPROUVE", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "REQ-2026-002", "titre": "Logiciel antivirus serveurs", "description": "Renouvellement licences Kaspersky Enterprise – 15 serveurs", "categorie": "SERVICES", "montant_estime_xaf": 1200000, "demandeur": "Direction IT", "service": "INFORMATIQUE", "justification": "Expiration licences au 31/08/2026", "statut": "EN_ATTENTE_VALIDATION", "created_at": datetime.utcnow().isoformat()},
]

_next_po_id = 4
_next_req_id = 3

@router.get("/")
def procurement_dashboard():
    return {
        "kpis": {
            "po_en_attente": len([po for po in _purchase_orders if po["statut"] == "EN_ATTENTE_VALIDATION"]),
            "po_approuves": len([po for po in _purchase_orders if po["statut"] == "APPROUVE"]),
            "budget_engage_xaf": sum(po.get("montant_total_xaf", 0) or 0 for po in _purchase_orders if po["statut"] == "APPROUVE"),
            "requisitions_ouvertes": len([r for r in _requisitions if r["statut"] == "EN_ATTENTE_VALIDATION"]),
        },
        "po_urgents": [po for po in _purchase_orders if po.get("urgence")],
    }

@router.get("/orders")
def list_purchase_orders(statut: Optional[str] = None, categorie: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _purchase_orders[:]
    if statut:
        results = [po for po in results if po["statut"].upper() == statut.upper()]
    if categorie:
        results = [po for po in results if po["categorie"].upper() == categorie.upper()]
    return {"total": len(results), "orders": results[skip:skip+limit]}

@router.get("/orders/{po_id}")
def get_purchase_order(po_id: int):
    po = next((po for po in _purchase_orders if po["id"] == po_id), None)
    if not po:
        raise HTTPException(status_code=404, detail="Purchase Order non trouvé")
    return po

@router.post("/orders")
def create_purchase_order(data: PurchaseOrderCreate):
    global _next_po_id
    ref = f"PO-{datetime.now().year}-{_next_po_id:03d}"
    if data.montant_total_xaf is None and data.prix_unitaire_xaf and data.quantite:
        montant = data.prix_unitaire_xaf * data.quantite
    else:
        montant = data.montant_total_xaf
    po = {**data.dict(), "id": _next_po_id, "reference": ref, "montant_total_xaf": montant, "statut": "BROUILLON", "created_at": datetime.utcnow().isoformat()}
    _purchase_orders.append(po)
    _next_po_id += 1
    return po

@router.patch("/orders/{po_id}/approuver")
def approuver_po(po_id: int):
    po = next((po for po in _purchase_orders if po["id"] == po_id), None)
    if not po:
        raise HTTPException(status_code=404, detail="PO non trouvé")
    po["statut"] = "APPROUVE"
    return po

@router.get("/requisitions")
def list_requisitions(statut: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _requisitions[:]
    if statut:
        results = [r for r in results if r["statut"].upper() == statut.upper()]
    return {"total": len(results), "requisitions": results[skip:skip+limit]}

@router.post("/requisitions")
def create_requisition(data: RequisitionCreate):
    global _next_req_id
    ref = f"REQ-{datetime.now().year}-{_next_req_id:03d}"
    req = {**data.dict(), "id": _next_req_id, "reference": ref, "statut": "EN_ATTENTE_VALIDATION", "created_at": datetime.utcnow().isoformat()}
    _requisitions.append(req)
    _next_req_id += 1
    return req
