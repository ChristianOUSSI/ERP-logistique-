from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.transport import MissionTransport
from app.schemas.transport import MissionResponse

router = APIRouter(tags=["Public API & Webhooks"])

# Système de validation de la clé d'API pour les clients externes B2B
def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != "KAMLOG_PUB_KEY_DEMO_2026":
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key

@router.get("/missions/tracking/{reference}", response_model=MissionResponse)
def public_track_mission(reference: str, db: Session = Depends(get_db), api_key: str = Depends(verify_api_key)):
    """API publique pour suivre une mission via sa référence. (Nécessite API KEY)"""
    mission = db.query(MissionTransport).filter(MissionTransport.reference == reference).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission introuvable")
    return mission

@router.post("/webhooks/kamlog-events")
def webhook_receiver(event_data: dict, api_key: str = Depends(verify_api_key)):
    """Point d'entrée générique pour les webhooks externes (ex: tracking GPS externe, IoT)."""
    # TODO: Intégrer l'enregistrement de l'événement dans la base de données de journalisation
    return {"status": "success", "message": "Event received and processed", "event_type": event_data.get("type", "unknown")}
