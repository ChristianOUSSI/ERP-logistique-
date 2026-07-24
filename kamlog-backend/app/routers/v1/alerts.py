from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Alerts"])

class AlertCreate(BaseModel):
    titre: str
    description: str
    niveau: str  # CRITIQUE, HAUTE, MOYENNE, FAIBLE
    module: Optional[str] = "SYSTEME"
    vehicule_immat: Optional[str] = None
    zone: Optional[str] = None

_alerts = [
    {"id": 1, "titre": "Température Moteur Critique", "description": "DLA-TRK-007 : Température moteur à 115°C – Seuil critique dépassé (max: 110°C)", "niveau": "CRITIQUE", "module": "TRANSPORT", "vehicule_immat": "DLA-TRK-007", "zone": "PARC LOGISTIQUE", "statut": "ACTIVE", "lu": False, "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "titre": "Stock Critique MAG3", "description": "SKU MAT-SOUDURE-006 : Stock restant 4 unités (seuil: 5). Réapprovisionnement requis.", "niveau": "HAUTE", "module": "MAGASIN", "vehicule_immat": None, "zone": "ATL-M01", "statut": "ACTIVE", "lu": False, "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "titre": "Pneus Usés DLA-TRK-001", "description": "Usure pneumatiques avant à 90%. Remplacement immédiat recommandé avant prochaine mission.", "niveau": "HAUTE", "module": "MAINTENANCE", "vehicule_immat": "DLA-TRK-001", "zone": "PORT DOUALA", "statut": "ACTIVE", "lu": False, "created_at": datetime.utcnow().isoformat()},
    {"id": 4, "titre": "Accès Non Autorisé Détecté", "description": "Tentative d'accès à la zone sécurisée YARD-A01 sans badge à 23h47", "niveau": "CRITIQUE", "module": "SECURITE", "vehicule_immat": None, "zone": "YARD-A01", "statut": "RESOLUE", "lu": True, "created_at": datetime.utcnow().isoformat()},
    {"id": 5, "titre": "Dépassement Délai Transit", "description": "Dossier CEMAC-2026-087 : délai légal de 72h dépassé. Pénalités douanières applicables.", "niveau": "HAUTE", "module": "TRANSIT", "vehicule_immat": None, "zone": "DOUANE DOUALA", "statut": "ACTIVE", "lu": False, "created_at": datetime.utcnow().isoformat()},
    {"id": 6, "titre": "Facture Impayée - 30 Jours", "description": "Client BOLLORE AFRICA LOGISTICS : FAC-2026-0187 – 2.100.000 XAF impayée depuis 30 jours.", "niveau": "MOYENNE", "module": "FINANCE", "vehicule_immat": None, "zone": None, "statut": "ACTIVE", "lu": False, "created_at": datetime.utcnow().isoformat()},
]

_next_id = 7

@router.get("/")
def list_alerts(
    niveau: Optional[str] = None,
    module: Optional[str] = None,
    statut: Optional[str] = None,
    lu: Optional[bool] = None,
    skip: int = 0, limit: int = 50
):
    results = _alerts[:]
    if niveau:
        results = [a for a in results if a["niveau"].upper() == niveau.upper()]
    if module:
        results = [a for a in results if a["module"].upper() == module.upper()]
    if statut:
        results = [a for a in results if a["statut"].upper() == statut.upper()]
    if lu is not None:
        results = [a for a in results if a["lu"] == lu]
    return {
        "total": len(results),
        "actives": len([a for a in _alerts if a["statut"] == "ACTIVE"]),
        "critiques": len([a for a in _alerts if a["niveau"] == "CRITIQUE" and a["statut"] == "ACTIVE"]),
        "alerts": results[skip:skip+limit]
    }

@router.get("/summary")
def alerts_summary():
    return {
        "par_niveau": {
            "CRITIQUE": len([a for a in _alerts if a["niveau"] == "CRITIQUE" and a["statut"] == "ACTIVE"]),
            "HAUTE": len([a for a in _alerts if a["niveau"] == "HAUTE" and a["statut"] == "ACTIVE"]),
            "MOYENNE": len([a for a in _alerts if a["niveau"] == "MOYENNE" and a["statut"] == "ACTIVE"]),
            "FAIBLE": len([a for a in _alerts if a["niveau"] == "FAIBLE" and a["statut"] == "ACTIVE"]),
        },
        "par_module": {
            mod: len([a for a in _alerts if a["module"] == mod and a["statut"] == "ACTIVE"])
            for mod in set(a["module"] for a in _alerts)
        },
        "non_lues": len([a for a in _alerts if not a["lu"]]),
        "dernieres_alertes": _alerts[:3]
    }

@router.get("/{alert_id}")
def get_alert(alert_id: int):
    a = next((a for a in _alerts if a["id"] == alert_id), None)
    if not a:
        raise HTTPException(status_code=404, detail="Alerte non trouvée")
    return a

@router.post("/")
def create_alert(data: AlertCreate):
    global _next_id
    alert = {**data.dict(), "id": _next_id, "statut": "ACTIVE", "lu": False, "created_at": datetime.utcnow().isoformat()}
    _alerts.insert(0, alert)
    _next_id += 1
    return alert

@router.patch("/{alert_id}/resolve")
def resolve_alert(alert_id: int):
    a = next((a for a in _alerts if a["id"] == alert_id), None)
    if not a:
        raise HTTPException(status_code=404, detail="Alerte non trouvée")
    a["statut"] = "RESOLUE"
    a["lu"] = True
    return a

@router.patch("/{alert_id}/read")
def mark_alert_read(alert_id: int):
    a = next((a for a in _alerts if a["id"] == alert_id), None)
    if not a:
        raise HTTPException(status_code=404, detail="Alerte non trouvée")
    a["lu"] = True
    return a
