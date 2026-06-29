# app/routers/removal_slip.py - Routes API pour les bons d'enlèvement
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.schemas.removal_slip import (
    RemovalSlipResponse, RemovalSlipCreate, RemovalSlipUpdate
)
from app.services.removal_slip_service import RemovalSlipService
from app.services.mag3_workflow_service import Mag3WorkflowService


limiter = Limiter(key_func=get_remote_address)
router = APIRouter(tags=["Removal Slip"])


# ============ REMOVAL SLIPS ============
@router.get("/", response_model=List[RemovalSlipResponse])
def get_removal_slips(
    skip: int = 0,
    limit: int = 100,
    statut: Optional[str] = None,
    magasin_source: Optional[str] = None,
    magasin_destination: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère tous les bons d'enlèvement"""
    if statut:
        return RemovalSlipService.get_removal_slips_by_statut(db, statut)
    if magasin_source and magasin_destination:
        return RemovalSlipService.get_removal_slips_by_magasin(db, magasin_source, magasin_destination)
    return RemovalSlipService.get_all_removal_slips(db, skip, limit)


@router.get("/{slip_id}", response_model=RemovalSlipResponse)
def get_removal_slip(slip_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Récupère un bon d'enlèvement par son ID"""
    slip = RemovalSlipService.get_removal_slip(db, slip_id)
    if not slip:
        raise HTTPException(status_code=404, detail="Bon d'enlèvement non trouvé")
    return slip


@router.post("/", response_model=RemovalSlipResponse)
@limiter.limit("10/minute")
@check_permission("magasin:create")
def create_removal_slip(
    slip: RemovalSlipCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un nouveau bon d'enlèvement"""
    return RemovalSlipService.create_removal_slip(db, slip, current_user.username)


@router.put("/{slip_id}", response_model=RemovalSlipResponse)
@limiter.limit("20/minute")
@check_permission("magasin:update")
def update_removal_slip(
    slip_id: int, 
    slip: RemovalSlipUpdate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Met à jour un bon d'enlèvement"""
    updated_slip = RemovalSlipService.update_removal_slip(db, slip_id, slip)
    if not updated_slip:
        raise HTTPException(status_code=404, detail="Bon d'enlèvement non trouvé")
    return updated_slip


@router.delete("/{slip_id}")
@limiter.limit("10/minute")
@check_permission("magasin:delete")
def delete_removal_slip(
    slip_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Supprime un bon d'enlèvement"""
    success = RemovalSlipService.delete_removal_slip(db, slip_id)
    if not success:
        raise HTTPException(status_code=404, detail="Bon d'enlèvement non trouvé")
    return {"message": "Bon d'enlèvement supprimé avec succès"}


@router.post("/{slip_id}/autoriser", response_model=RemovalSlipResponse)
@limiter.limit("10/minute")
@check_permission("magasin:authorize")
def authorize_removal_slip(
    slip_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Autorise un bon d'enlèvement"""
    authorized_slip = RemovalSlipService.authorize_removal_slip(db, slip_id, current_user.username)
    if not authorized_slip:
        raise HTTPException(status_code=404, detail="Bon d'enlèvement non trouvé")
    return authorized_slip


# ============ WORKFLOW ENDPOINTS ============
@router.get("/{slip_id}/workflow-status")
def get_workflow_status(
    slip_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère le statut du workflow pour un bon d'enlèvement"""
    return Mag3WorkflowService.get_workflow_status(db, slip_id)


@router.post("/{slip_id}/workflow-create")
@limiter.limit("10/minute")
@check_permission("magasin:create")
def create_removal_slip_workflow(
    slip: RemovalSlipCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un bon d'enlèvement avec workflow complet"""
    return Mag3WorkflowService.create_removal_slip_workflow(db, slip, current_user.username)
