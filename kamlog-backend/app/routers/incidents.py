from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from app.database import get_db
from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentResponse
from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter(tags=["Incidents"])

@router.get("/", response_model=List[IncidentResponse])
def get_incidents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Incident).all()

@router.get("/client/{tiers_id}", response_model=List[IncidentResponse])
def get_client_incidents(tiers_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Incident).filter(Incident.tiers_id == tiers_id).all()

@router.post("/", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(incident_data: IncidentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reference = f"TKT-{str(uuid.uuid4())[:8].upper()}"
    new_incident = Incident(
        **incident_data.model_dump(),
        reference=reference
    )
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)
    return new_incident

@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident(incident_id: int, update_data: IncidentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(incident, key, value)
        
    if update_data.statut in ["RESOLU", "FERME"]:
        incident.date_resolution = datetime.utcnow()
        
    db.commit()
    db.refresh(incident)
    return incident
