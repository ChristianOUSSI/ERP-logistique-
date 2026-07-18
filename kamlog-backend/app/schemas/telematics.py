# app/schemas/telematics.py
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class GPSPing(BaseModel):
    tracker_id: str = Field(..., description="ID unique du tracker GPS (IMEI ou autre)")
    latitude: float = Field(..., description="Latitude")
    longitude: float = Field(..., description="Longitude")
    vitesse_kmh: float = Field(0.0, description="Vitesse actuelle en km/h")
    timestamp: Optional[str] = Field(None, description="Timestamp ISO du relevé")

class GPSPingResponse(BaseModel):
    status: str
    camion_id: Optional[int] = None
    mission_en_cours: Optional[int] = None
    alert: Optional[str] = None
    eta: Optional[str] = None
    message: Optional[str] = None

class CamionPosition(BaseModel):
    camion_id: int
    immatriculation: str
    latitude: float
    longitude: float
    vitesse_kmh: float
    last_update: str
