# app/routers/dossiers.py - Routeur Dossiers Opérationnels
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.dossier import DossierCreate, DossierUpdate, DossierResponse
from app.routers.auth import get_current_user
from app.utils.rbac import require_permission
from app.services.dossier_service import DossierService

router = APIRouter()


@router.get("/", response_model=List[DossierResponse])
@require_permission("dossiers:read")
async def list_dossiers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les dossiers opérationnels."""
    return DossierService.get_all_dossiers(db, skip, limit)


@router.get("/{dossier_id}", response_model=DossierResponse)
@require_permission("dossiers:read")
async def get_dossier(
    dossier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un dossier opérationnel par son ID."""
    dossier = DossierService.get_dossier(db, dossier_id)
    if not dossier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dossier introuvable"
        )
    return dossier


@router.post("/", response_model=DossierResponse, status_code=status.HTTP_201_CREATED)
@require_permission("dossiers:create")
async def create_dossier(
    dossier: DossierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée un dossier opérationnel avec vérification des habilitations du tiers."""
    try:
        creator_id = current_user.email or current_user.username or "système"
        return DossierService.create_dossier(db, dossier, creator_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/{dossier_id}", response_model=DossierResponse)
@require_permission("dossiers:update")
async def update_dossier(
    dossier_id: int,
    dossier: DossierUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour un dossier opérationnel."""
    updated = DossierService.update_dossier(db, dossier_id, dossier)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dossier introuvable"
        )
    return updated


@router.delete("/{dossier_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_permission("dossiers:delete")
async def delete_dossier(
    dossier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime un dossier opérationnel."""
    deleted = DossierService.delete_dossier(db, dossier_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dossier introuvable"
        )
