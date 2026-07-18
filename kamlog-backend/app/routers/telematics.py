from app.utils.rbac import require_role
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field

from app.database import get_db
from app.models.transport import CamionFlotte, PositionGPS

router = APIRouter(prefix="/api/v1/telematics", tags=["Télématique"])

class TelematicsPayload(BaseModel):
    gps_tracker_id: str = Field(..., description="ID unique du tracker GPS (ex: IMEI)")
    latitude: float = Field(..., description="Latitude")
    longitude: float = Field(..., description="Longitude")
    vitesse_kmh: float = Field(0.0, description="Vitesse en km/h")
    heading: float | None = Field(None, description="Cap en degrés")
    timestamp: datetime | None = Field(None, description="Timestamp de la position")

class TelematicsResponse(BaseModel):
    status: str
    message: str


@router.post("/ingest", response_model=TelematicsResponse, status_code=status.HTTP_201_CREATED)
@require_role(["admin", "manager"])
async def ingest_telematics(
    payload: TelematicsPayload,
    db: Session = Depends(get_db),
):
    """
    Ingère les pings télématiques des trackers GPS de la flotte.
    Ce point d'entrée est optimisé pour être appelé très fréquemment par les API des fournisseurs télématiques.
    """
    camion = db.query(CamionFlotte).filter(CamionFlotte.gps_tracker_id == payload.gps_tracker_id).first()
    
    if not camion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Aucun véhicule associé au tracker {payload.gps_tracker_id}"
        )

    position = PositionGPS(
        camion_id=camion.id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        vitesse_kmh=payload.vitesse_kmh,
        heading=payload.heading,
        timestamp=payload.timestamp or datetime.now(timezone.utc)
    )
    
    db.add(position)
    
    # Mettre à jour la position actuelle sur le camion
    camion.vitesse_kmh = payload.vitesse_kmh
    camion.latitude = payload.latitude
    camion.longitude = payload.longitude
    
    db.commit()

    # Diffuser la nouvelle position via WebSocket pour la Live Map
    try:
        from app.services.events.event_service import EventService, EventType
        event_payload = {
            "camion_id": camion.id,
            "immatriculation": camion.immatriculation_couplee,
            "latitude": float(payload.latitude),
            "longitude": float(payload.longitude),
            "vitesse_kmh": float(payload.vitesse_kmh),
            "heading": float(payload.heading) if payload.heading is not None else None
        }
        await EventService.broadcast_event(EventType.TELEMATICS_POSITION_UPDATE, event_payload, broadcast_to_all=True)
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Failed to broadcast telematics: {e}")

    return TelematicsResponse(status="success", message="Position enregistrée")


@router.get("/live-gps")
async def get_live_gps(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """
    Retourne la dernière position GPS connue de tous les camions actifs.
    """
    camions = db.query(CamionFlotte).filter(
        CamionFlotte.actif == True,
        CamionFlotte.latitude.isnot(None),
        CamionFlotte.longitude.isnot(None)
    ).all()
    
    locations = []
    for c in camions:
        locations.append({
            "id": c.id,
            "immatriculation": c.immatriculation_couplee,
            "lat": float(c.latitude),
            "lng": float(c.longitude),
            "speed": float(c.vitesse_kmh) if c.vitesse_kmh else 0.0,
            "status": c.statut,
            "last_update": datetime.now(timezone.utc).isoformat()
        })
        
    return locations
