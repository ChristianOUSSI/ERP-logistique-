from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Fournisseurs"])

class FournisseurCreate(BaseModel):
    nom: str
    siret_ou_rc: Optional[str] = None
    secteur: Optional[str] = "TRANSPORT"  # TRANSPORT, CARBURANT, MAINTENANCE, FOURNITURES, SERVICES
    adresse: Optional[str] = None
    ville: Optional[str] = "Douala"
    pays: Optional[str] = "Cameroun"
    contact_nom: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    conditions_paiement: Optional[str] = "30 jours net"
    devise: Optional[str] = "XAF"

_fournisseurs = [
    {"id": 1, "nom": "TOTALENERGIES CAMEROUN", "siret_ou_rc": "CM-DLA-2003-B-1234", "secteur": "CARBURANT", "adresse": "Boulevard du 20 Mai, Zone Portuaire", "ville": "Douala", "pays": "Cameroun", "contact_nom": "Directeur Commercial", "contact_email": "commercial.cm@totalenergies.com", "contact_phone": "+237 233 421 000", "conditions_paiement": "30 jours net", "devise": "XAF", "statut": "ACTIF", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "nom": "MICHELIN AFRIQUE CENTRALE", "siret_ou_rc": "CM-DLA-2005-B-5678", "secteur": "MAINTENANCE", "adresse": "Zone Industrielle Bassa", "ville": "Douala", "pays": "Cameroun", "contact_nom": "ATEBA Roger", "contact_email": "r.ateba@michelin-africa.com", "contact_phone": "+237 699 123 456", "conditions_paiement": "15 jours", "devise": "XAF", "statut": "ACTIF", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "nom": "TRAPCA SOLUTIONS LOGISTIQUES", "siret_ou_rc": "CM-DLA-2010-B-9012", "secteur": "TRANSPORT", "adresse": "Akwa Nord, Rue du Commerce", "ville": "Douala", "pays": "Cameroun", "contact_nom": "NKODO Emmanuel", "contact_email": "nkodo.e@trapca.cm", "contact_phone": "+237 677 890 123", "conditions_paiement": "60 jours net", "devise": "XAF", "statut": "ACTIF", "created_at": datetime.utcnow().isoformat()},
    {"id": 4, "nom": "OFFICE NATIONAL DE SECURITE ROUTIERE", "siret_ou_rc": "CM-YDE-1988-A-0001", "secteur": "SERVICES", "adresse": "Avenue des Palmiers", "ville": "Yaoundé", "pays": "Cameroun", "contact_nom": "Direction Générale", "contact_email": "info@onaser.cm", "contact_phone": "+237 222 231 500", "conditions_paiement": "Paiement comptant", "devise": "XAF", "statut": "ACTIF", "created_at": datetime.utcnow().isoformat()},
]

_next_id = 5

@router.get("/")
def list_fournisseurs(secteur: Optional[str] = None, statut: Optional[str] = None, ville: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _fournisseurs[:]
    if secteur:
        results = [f for f in results if f["secteur"].upper() == secteur.upper()]
    if statut:
        results = [f for f in results if f["statut"].upper() == statut.upper()]
    if ville:
        results = [f for f in results if ville.upper() in f["ville"].upper()]
    return {"total": len(results), "fournisseurs": results[skip:skip+limit]}

@router.get("/{fourn_id}")
def get_fournisseur(fourn_id: int):
    f = next((f for f in _fournisseurs if f["id"] == fourn_id), None)
    if not f:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    return f

@router.post("/")
def create_fournisseur(data: FournisseurCreate):
    global _next_id
    fourn = {**data.dict(), "id": _next_id, "statut": "ACTIF", "created_at": datetime.utcnow().isoformat()}
    _fournisseurs.append(fourn)
    _next_id += 1
    return fourn

@router.put("/{fourn_id}")
def update_fournisseur(fourn_id: int, data: FournisseurCreate):
    f = next((f for f in _fournisseurs if f["id"] == fourn_id), None)
    if not f:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    f.update(data.dict())
    return f

@router.delete("/{fourn_id}")
def delete_fournisseur(fourn_id: int):
    global _fournisseurs
    fourn = next((f for f in _fournisseurs if f["id"] == fourn_id), None)
    if not fourn:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    fourn["statut"] = "INACTIF"
    return {"message": "Fournisseur désactivé"}
