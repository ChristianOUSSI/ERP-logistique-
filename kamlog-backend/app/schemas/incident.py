from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IncidentBase(BaseModel):
    titre: str
    description: str
    priorite: Optional[str] = "MOYENNE"
    tiers_id: int
    mission_id: Optional[int] = None

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    statut: Optional[str] = None
    priorite: Optional[str] = None
    description: Optional[str] = None

class IncidentResponse(IncidentBase):
    id: int
    reference: str
    statut: str
    date_creation: datetime
    date_resolution: Optional[datetime] = None

    class Config:
        from_attributes = True
