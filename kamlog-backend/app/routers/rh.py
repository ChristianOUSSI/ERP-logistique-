from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.rh import Employe, Conge, FichePaie
from app.schemas.rh import (
    EmployeCreate, EmployeUpdate, EmployeResponse,
    CongeCreate, CongeUpdate, CongeResponse,
    FichePaieCreate, FichePaieResponse
)
from app.routers.auth import get_current_user
from app.models.user import User
from app.utils.rbac import require_role, require_permission

router = APIRouter(tags=["Ressources Humaines"])

# --- Employés ---

@router.get("/employes", response_model=List[EmployeResponse])
@require_permission("rh:read")
def get_employes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Employe).offset(skip).limit(limit).all()

@router.post("/employes", response_model=EmployeResponse, status_code=status.HTTP_201_CREATED)
@require_permission("rh:write")
def create_employe(employe: EmployeCreate, db: Session = Depends(get_db)):
    db_employe = db.query(Employe).filter(Employe.matricule == employe.matricule).first()
    if db_employe:
        raise HTTPException(status_code=400, detail="Matricule already registered")
    
    new_employe = Employe(**employe.model_dump())
    db.add(new_employe)
    db.commit()
    db.refresh(new_employe)
    return new_employe

@router.get("/employes/me", response_model=EmployeResponse)
def get_my_employe_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Simulation: find employee by email or mock mapping
    employe = db.query(Employe).filter(Employe.email == current_user.email).first()
    if not employe:
        raise HTTPException(status_code=404, detail="Profil employé non configuré pour cet utilisateur")
    return employe

# --- Congés ---

@router.get("/conges", response_model=List[CongeResponse])
@require_permission("rh:read")
def get_conges(db: Session = Depends(get_db)):
    return db.query(Conge).all()

@router.post("/conges", response_model=CongeResponse, status_code=status.HTTP_201_CREATED)
def create_conge(conge: CongeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_conge = Conge(**conge.model_dump())
    db.add(new_conge)
    db.commit()
    db.refresh(new_conge)
    return new_conge

@router.patch("/conges/{conge_id}/statut", response_model=CongeResponse)
@require_role(["admin", "rh"])
def update_conge_statut(conge_id: int, update: CongeUpdate, db: Session = Depends(get_db)):
    conge = db.query(Conge).filter(Conge.id == conge_id).first()
    if not conge:
        raise HTTPException(status_code=404, detail="Congé not found")
    conge.statut = update.statut
    db.commit()
    db.refresh(conge)
    return conge

# --- Paie ---

@router.get("/paie", response_model=List[FichePaieResponse])
@require_permission("rh:read")
def get_paies(db: Session = Depends(get_db)):
    return db.query(FichePaie).all()

@router.post("/paie", response_model=FichePaieResponse, status_code=status.HTTP_201_CREATED)
@require_role(["admin", "finance", "rh"])
def create_fiche_paie(paie: FichePaieCreate, db: Session = Depends(get_db)):
    new_paie = FichePaie(**paie.model_dump())
    db.add(new_paie)
    db.commit()
    db.refresh(new_paie)
    return new_paie
