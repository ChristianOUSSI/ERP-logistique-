from fastapi import APIRouter, HTTPException, Query, Request
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

router = APIRouter(tags=["Gateway & Intégrations Externes"])

class WebhookConfig(BaseModel):
    nom: str
    url_destination: str
    evenements: List[str]  # ["MISSION_CREEE", "LIVRAISON_CONFIRMEE", ...]
    secret: Optional[str] = None
    actif: Optional[bool] = True

class IntegrationConfig(BaseModel):
    nom: str
    type_integration: str  # REST_API, WEBHOOK, EDI, SFTP, DATABASE
    url_endpoint: Optional[str] = None
    description: Optional[str] = None

_integrations = [
    {"id": 1, "nom": "Tracking GPS Samsara", "type_integration": "REST_API", "url_endpoint": "https://api.samsara.com/v1", "description": "Télémétrie GPS temps réel – Véhicules poids lourds", "statut": "ACTIF", "derniere_sync": datetime.utcnow().isoformat(), "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "nom": "ERP Client B2B CFAO", "type_integration": "REST_API", "url_endpoint": "https://erp.cfao-cameroun.cm/api", "description": "Synchronisation commandes et livraisons B2B", "statut": "ACTIF", "derniere_sync": datetime.utcnow().isoformat(), "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "nom": "Messagerie WhatsApp Business", "type_integration": "WEBHOOK", "url_endpoint": "https://api.whatsapp.com/send", "description": "Notifications WhatsApp chauffeurs et clients", "statut": "ACTIF", "derniere_sync": datetime.utcnow().isoformat(), "created_at": datetime.utcnow().isoformat()},
    {"id": 4, "nom": "Système Douanier CAMRAIL-EDI", "type_integration": "EDI", "url_endpoint": None, "description": "Échange EDI données douanières CEMAC", "statut": "INACTIF", "derniere_sync": None, "created_at": datetime.utcnow().isoformat()},
]

_webhooks = [
    {"id": 1, "nom": "Notification Livraison Client", "url_destination": "https://erp.cfao-cameroun.cm/webhooks/delivery", "evenements": ["LIVRAISON_CONFIRMEE", "EPOD_SIGNE"], "actif": True, "created_at": datetime.utcnow().isoformat()},
]

_next_int_id = 5
_next_wh_id = 2

@router.get("/")
def gateway_status():
    return {
        "status": "operationnel",
        "integrations_actives": len([i for i in _integrations if i["statut"] == "ACTIF"]),
        "webhooks_actifs": len([w for w in _webhooks if w["actif"]]),
        "integrations": _integrations,
    }

@router.get("/integrations")
def list_integrations(type_integration: Optional[str] = None, statut: Optional[str] = None):
    results = _integrations[:]
    if type_integration:
        results = [i for i in results if i["type_integration"].upper() == type_integration.upper()]
    if statut:
        results = [i for i in results if i["statut"].upper() == statut.upper()]
    return {"total": len(results), "integrations": results}

@router.post("/integrations")
def create_integration(data: IntegrationConfig):
    global _next_int_id
    integ = {**data.dict(), "id": _next_int_id, "statut": "ACTIF", "derniere_sync": None, "created_at": datetime.utcnow().isoformat()}
    _integrations.append(integ)
    _next_int_id += 1
    return integ

@router.get("/webhooks")
def list_webhooks():
    return {"total": len(_webhooks), "webhooks": _webhooks}

@router.post("/webhooks")
def create_webhook(data: WebhookConfig):
    global _next_wh_id
    wh = {**data.dict(), "id": _next_wh_id, "created_at": datetime.utcnow().isoformat()}
    _webhooks.append(wh)
    _next_wh_id += 1
    return wh

@router.post("/webhooks/receive")
async def receive_webhook(request: Request):
    """Endpoint de réception webhooks entrants"""
    try:
        body = await request.json()
        return {"status": "recu", "timestamp": datetime.utcnow().isoformat(), "payload_recu": body}
    except Exception as e:
        return {"status": "erreur", "detail": str(e)}

@router.post("/integrations/{int_id}/sync")
def sync_integration(int_id: int):
    i = next((i for i in _integrations if i["id"] == int_id), None)
    if not i:
        raise HTTPException(status_code=404, detail="Intégration non trouvée")
    i["derniere_sync"] = datetime.utcnow().isoformat()
    return {"message": f"Synchronisation déclenchée pour {i['nom']}", "statut": "OK"}
