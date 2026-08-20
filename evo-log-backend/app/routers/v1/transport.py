"""
Transport router - manages vehicles, drivers, and missions
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.transport import CamionCreate, CamionUpdate, CamionResponse, ConducteurCreate, ConducteurResponse, MissionCreate, MissionUpdate, MissionResponse
from app.models.transport import Camion, Conducteur, Mission

router = APIRouter()


@router.get("/camions", response_model=List[CamionResponse])
async def get_all_camions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all trucks"""
    camions = db.query(Camion).offset(skip).limit(limit).all()
    return camions


@router.post("/camions", response_model=CamionResponse, status_code=status.HTTP_201_CREATED)
async def create_camion(camion_data: CamionCreate, db: Session = Depends(get_db)):
    """Create a new truck"""
    if db.query(Camion).filter(Camion.immatriculation == camion_data.immatriculation).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Truck registration already exists")
    
    db_camion = Camion(**camion_data.model_dump())
    db.add(db_camion)
    db.commit()
    db.refresh(db_camion)
    return db_camion


@router.get("/camions/{camion_id}", response_model=CamionResponse)
async def get_camion(camion_id: int, db: Session = Depends(get_db)):
    """Get a specific truck by ID"""
    camion = db.query(Camion).filter(Camion.id == camion_id).first()
    if not camion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Truck not found")
    return camion


@router.put("/camions/{camion_id}", response_model=CamionResponse)
async def update_camion(camion_id: int, camion_data: CamionUpdate, db: Session = Depends(get_db)):
    """Update a truck"""
    camion = db.query(Camion).filter(Camion.id == camion_id).first()
    if not camion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Truck not found")
    
    for field, value in camion_data.model_dump(exclude_unset=True).items():
        setattr(camion, field, value)
    
    db.commit()
    db.refresh(camion)
    return camion


@router.get("/conducteurs", response_model=List[ConducteurResponse])
async def get_all_conducteurs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all drivers"""
    conducteurs = db.query(Conducteur).offset(skip).limit(limit).all()
    return conducteurs


@router.post("/conducteurs", response_model=ConducteurResponse, status_code=status.HTTP_201_CREATED)
async def create_conducteur(conducteur_data: ConducteurCreate, db: Session = Depends(get_db)):
    """Create a new driver"""
    if db.query(Conducteur).filter(Conducteur.numero_permis == conducteur_data.numero_permis).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="License number already exists")
    
    db_conducteur = Conducteur(**conducteur_data.model_dump())
    db.add(db_conducteur)
    db.commit()
    db.refresh(db_conducteur)
    return db_conducteur


@router.get("/missions", response_model=List[MissionResponse])
async def get_all_missions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all missions"""
    missions = db.query(Mission).offset(skip).limit(limit).all()
    return missions


@router.post("/missions", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
async def create_mission(mission_data: MissionCreate, db: Session = Depends(get_db)):
    """Create a new mission"""
    db_mission = Mission(**mission_data.model_dump())
    db.add(db_mission)
    db.commit()
    db.refresh(db_mission)
    return db_mission


@router.put("/missions/{mission_id}", response_model=MissionResponse)
async def update_mission(mission_id: int, mission_data: MissionUpdate, db: Session = Depends(get_db)):
    """Update a mission"""
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found")
    
    for field, value in mission_data.model_dump(exclude_unset=True).items():
        setattr(mission, field, value)
    
    db.commit()
    db.refresh(mission)
    return mission