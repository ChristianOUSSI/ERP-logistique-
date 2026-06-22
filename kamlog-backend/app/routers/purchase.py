# app/routers/purchase.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.purchase import (
    FicheBesoinCreate, 
    FicheBesoinUpdate, 
    FicheBesoinResponse,
    FicheBesoinApproveReject
)
from app.services.purchase_service import FicheBesoinService
from app.services.purchase_requisition_workflow_service import PurchaseRequisitionWorkflowService
from app.models.user import User
from app.routers.auth import get_current_user
from app.utils.rbac import require_permission, require_role
from app.exceptions import ResourceNotFoundError, BusinessRuleViolationError

router = APIRouter(
    prefix="/api/purchase/requisitions",
    tags=["Achats - Fiches de Besoin"],
)

fiche_besoin_service = FicheBesoinService()

@router.post("/", response_model=FicheBesoinResponse, status_code=status.HTTP_201_CREATED)
@require_permission("purchase:create")
async def create_fiche_besoin(
    fiche_data: FicheBesoinCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une nouvelle fiche de besoin."""
    try:
        return fiche_besoin_service.create(db, fiche_data, current_user.id, current_user.username)
    except BusinessRuleViolationError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.get("/", response_model=List[FicheBesoinResponse])
@require_permission("purchase:read")
async def list_fiches_besoin(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste toutes les fiches de besoin."""
    # En fonction du rôle, on peut filtrer les fiches (ex: un demandeur ne voit que les siennes)
    if current_user.has_permission("purchase:read_all"): # Ex: pour les admins/approbateurs
        return fiche_besoin_service.get_all(db, skip, limit)
    else: # Pour les demandeurs
        return fiche_besoin_service.get_by_demandeur(db, current_user.id)

@router.get("/{fiche_id}", response_model=FicheBesoinResponse)
@require_permission("purchase:read")
async def get_fiche_besoin(
    fiche_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère une fiche de besoin par ID."""
    try:
        return fiche_besoin_service.get_by_id(db, fiche_id)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{fiche_id}", response_model=FicheBesoinResponse)
@require_permission("purchase:update")
async def update_fiche_besoin(
    fiche_id: int,
    fiche_data: FicheBesoinUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour une fiche de besoin."""
    try:
        return fiche_besoin_service.update(db, fiche_id, fiche_data)
    except (ResourceNotFoundError, BusinessRuleViolationError) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{fiche_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_permission("purchase:delete")
async def delete_fiche_besoin(
    fiche_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime une fiche de besoin."""
    try:
        fiche_besoin_service.delete(db, fiche_id)
        return {"message": "Fiche de besoin supprimée avec succès."}
    except (ResourceNotFoundError, BusinessRuleViolationError) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# --- Workflow Actions ---

@router.post("/{fiche_id}/submit", response_model=FicheBesoinResponse)
@require_permission("purchase:submit")
async def submit_fiche_besoin_for_approval(
    fiche_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soumet une fiche de besoin pour approbation."""
    try:
        return PurchaseRequisitionWorkflowService.submit_for_approval(db, fiche_id, current_user)
    except (ResourceNotFoundError, BusinessRuleViolationError) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{fiche_id}/review", response_model=FicheBesoinResponse)
@require_role(["admin", "approver"]) # Seuls les approbateurs peuvent utiliser cet endpoint
@require_permission("purchase:approve")
async def review_fiche_besoin(
    fiche_id: int,
    review_data: FicheBesoinApproveReject,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Approuve ou rejette une fiche de besoin."""
    try:
        return PurchaseRequisitionWorkflowService.approve_or_reject(
            db=db,
            fiche_id=fiche_id,
            approbateur=current_user,
            is_approved=review_data.is_approved,
            notes=review_data.notes
        )
    except (ResourceNotFoundError, BusinessRuleViolationError) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))