from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.agency_service import AgencyService
from app.schemas.agency import AgencyResponse, AgencyCreate, AgencyUpdate
from app.routers.auth import get_current_admin_user # Supposant ce helper existant

router = APIRouter()
agency_service = AgencyService()

@router.post("/", response_model=AgencyResponse)
def create_agency(
    agency_in: AgencyCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    return agency_service.create_agency(db, agency_in)

@router.get("/", response_model=List[AgencyResponse])
def list_agencies(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    return agency_service.get_agencies(db, skip, limit)

@router.put("/{agency_id}", response_model=AgencyResponse)
def update_agency(
    agency_id: int, 
    agency_in: AgencyUpdate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    return agency_service.update_agency(db, agency_id, agency_in)

@router.delete("/{agency_id}")
def delete_agency(agency_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_admin_user)):
    agency_service.delete_agency(db, agency_id)
    return {"status": "success", "message": "Agence supprimée"}