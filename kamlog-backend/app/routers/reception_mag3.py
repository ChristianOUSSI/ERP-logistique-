# app/routers/reception_mag3.py - Routes API pour les réceptions Mag3
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.schemas.reception_mag3 import (
    ReceptionMag3Response, ReceptionMag3Create, ReceptionMag3Update
)
from app.services.reception_mag3_service import ReceptionMag3Service
from app.services.mag3_workflow_service import Mag3WorkflowService


limiter = Limiter(key_func=get_remote_address)
router = APIRouter(tags=["Reception Mag3"])


# ============ RECEPTIONS MAG3 ============
@router.get("/", response_model=List[ReceptionMag3Response])
def get_receptions_mag3(
    skip: int = 0,
    limit: int = 100,
    statut: Optional[str] = None,
    magasin_source: Optional[str] = None,
    magasin_destination: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère toutes les réceptions Mag3"""
    if statut:
        return ReceptionMag3Service.get_receptions_mag3_by_statut(db, statut)
    if magasin_source and magasin_destination:
        return ReceptionMag3Service.get_receptions_mag3_by_magasins(db, magasin_source, magasin_destination)
    return ReceptionMag3Service.get_all_receptions_mag3(db, skip, limit)


@router.get("/{reception_id}", response_model=ReceptionMag3Response)
def get_reception_mag3(reception_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Récupère une réception Mag3 par son ID"""
    reception = ReceptionMag3Service.get_reception_mag3(db, reception_id)
    if not reception:
        raise HTTPException(status_code=404, detail="Réception Mag3 non trouvée")
    return reception


@router.post("/", response_model=ReceptionMag3Response)

@check_permission("magasin:create")
def create_reception_mag3(
    reception: ReceptionMag3Create, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée une nouvelle réception Mag3"""
    return ReceptionMag3Service.create_reception_mag3(db, reception, current_user.username)


@router.put("/{reception_id}", response_model=ReceptionMag3Response)

@check_permission("magasin:update")
def update_reception_mag3(
    reception_id: int, 
    reception: ReceptionMag3Update, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Met à jour une réception Mag3"""
    updated_reception = ReceptionMag3Service.update_reception_mag3(db, reception_id, reception)
    if not updated_reception:
        raise HTTPException(status_code=404, detail="Réception Mag3 non trouvée")
    return updated_reception


@router.delete("/{reception_id}")

@check_permission("magasin:delete")
def delete_reception_mag3(
    reception_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Supprime une réception Mag3"""
    success = ReceptionMag3Service.delete_reception_mag3(db, reception_id)
    if not success:
        raise HTTPException(status_code=404, detail="Réception Mag3 non trouvée")
    return {"message": "Réception Mag3 supprimée avec succès"}


@router.post("/{reception_id}/valider", response_model=ReceptionMag3Response)

@check_permission("magasin:validate")
def validate_reception_mag3(
    reception_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Valide une réception Mag3"""
    validated_reception = ReceptionMag3Service.validate_reception_mag3(db, reception_id, current_user.username)
    if not validated_reception:
        raise HTTPException(status_code=404, detail="Réception Mag3 non trouvée")
    return validated_reception


# ============ WORKFLOW ENDPOINTS ============
@router.post("/from-slip/{slip_id}", response_model=ReceptionMag3Response)

@check_permission("magasin:create")
def create_reception_from_slip(
    slip_id: int,
    reception: ReceptionMag3Create,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée une réception Mag3 à partir d'un bon d'enlèvement"""
    return Mag3WorkflowService.create_reception_from_slip_workflow(db, slip_id, reception, current_user.username)


@router.post("/{reception_id}/workflow-validate", response_model=ReceptionMag3Response)

@check_permission("magasin:validate")
def validate_reception_workflow(
    reception_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Valide une réception avec workflow complet (mise à jour du stock)"""
    return Mag3WorkflowService.validate_reception_workflow(db, reception_id, current_user.username)


@router.get("/pending-workflows")
def get_pending_workflows(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère les workflows en attente"""
    return Mag3WorkflowService.get_pending_workflows(db)
