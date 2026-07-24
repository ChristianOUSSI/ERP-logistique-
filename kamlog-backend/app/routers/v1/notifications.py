from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Notifications"])

class NotificationCreate(BaseModel):
    titre: str
    message: str
    type: Optional[str] = "INFO"  # INFO, WARNING, ERROR, SUCCESS
    module: Optional[str] = "SYSTEME"
    destinataire_id: Optional[str] = None

class NotificationUpdate(BaseModel):
    lu: Optional[bool] = True

_notifications = [
    {"id": 1, "titre": "Nouvelle Mission Dispatch", "message": "Mission OT-2026-00401 créée - Chauffeur MVONDO Jean-Marc affecté", "type": "SUCCESS", "module": "TRANSPORT", "destinataire_id": "usr-001", "lu": False, "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "titre": "Stock Critique MAG3", "message": "Niveau critique atteint pour SKU-CONT-40HQ – Réapprovisionnement requis", "type": "WARNING", "module": "MAGASIN", "destinataire_id": "usr-001", "lu": False, "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "titre": "Ticket Carburant Validé", "message": "Ticket #FUEL-2026-088 validé – 450L TotalEnergies Port Douala", "type": "INFO", "module": "TRANSPORT", "destinataire_id": "usr-001", "lu": True, "created_at": datetime.utcnow().isoformat()},
    {"id": 4, "titre": "Alerte Maintenance", "message": "Véhicule DLA-TRK-007 – Vidange moteur due (échéance: 15/08/2026)", "type": "WARNING", "module": "MAINTENANCE", "destinataire_id": "usr-001", "lu": False, "created_at": datetime.utcnow().isoformat()},
    {"id": 5, "titre": "Rapport QHSE Soumis", "message": "Inspection portuaire #QHSE-2026-012 soumise par NGUEMA Patrick – En attente validation", "type": "INFO", "module": "QHSE", "destinataire_id": "usr-001", "lu": False, "created_at": datetime.utcnow().isoformat()},
    {"id": 6, "titre": "Paiement Reçu", "message": "Facture FAC-2026-0234 réglée par CFAO LOGISTICS – 4.850.000 XAF", "type": "SUCCESS", "module": "FINANCE", "destinataire_id": "usr-001", "lu": True, "created_at": datetime.utcnow().isoformat()},
    {"id": 7, "titre": "Dossier Transit CEMAC", "message": "Dossier CEMAC-2026-089 approuvé par Direction Douanes de Douala", "type": "SUCCESS", "module": "TRANSIT", "destinataire_id": "usr-001", "lu": False, "created_at": datetime.utcnow().isoformat()},
]

_next_id = 8

@router.get("/")
def list_notifications(
    lu: Optional[bool] = None,
    module: Optional[str] = None,
    destinataire_id: Optional[str] = None,
    skip: int = 0, limit: int = 50
):
    results = _notifications[:]
    if lu is not None:
        results = [n for n in results if n["lu"] == lu]
    if module:
        results = [n for n in results if n["module"] == module.upper()]
    if destinataire_id:
        results = [n for n in results if n.get("destinataire_id") == destinataire_id]
    return {"total": len(results), "notifications": results[skip:skip+limit]}

@router.get("/badge-count")
def notification_badge_count(destinataire_id: Optional[str] = None):
    non_lues = [n for n in _notifications if not n["lu"]]
    if destinataire_id:
        non_lues = [n for n in non_lues if n.get("destinataire_id") == destinataire_id]
    return {"non_lues": len(non_lues), "total": len(_notifications)}

@router.get("/{notif_id}")
def get_notification(notif_id: int):
    n = next((n for n in _notifications if n["id"] == notif_id), None)
    if not n:
        raise HTTPException(status_code=404, detail="Notification non trouvée")
    return n

@router.post("/")
def create_notification(data: NotificationCreate):
    global _next_id
    notif = {**data.dict(), "id": _next_id, "lu": False, "created_at": datetime.utcnow().isoformat()}
    _notifications.insert(0, notif)
    _next_id += 1
    return notif

@router.patch("/{notif_id}/read")
def mark_as_read(notif_id: int):
    n = next((n for n in _notifications if n["id"] == notif_id), None)
    if not n:
        raise HTTPException(status_code=404, detail="Notification non trouvée")
    n["lu"] = True
    return n

@router.patch("/mark-all-read")
def mark_all_read(destinataire_id: Optional[str] = Query(None)):
    count = 0
    for n in _notifications:
        if not n["lu"]:
            if destinataire_id is None or n.get("destinataire_id") == destinataire_id:
                n["lu"] = True
                count += 1
    return {"message": f"{count} notifications marquées comme lues"}

@router.delete("/{notif_id}")
def delete_notification(notif_id: int):
    global _notifications
    original = len(_notifications)
    _notifications = [n for n in _notifications if n["id"] != notif_id]
    if len(_notifications) == original:
        raise HTTPException(status_code=404, detail="Notification non trouvée")
    return {"message": "Notification supprimée"}
