# app/routers/tiers.py  Router Tiers
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.tiers import Tiers
from app.models.user import User
from app.schemas.tiers import TiersCreate, TiersUpdate, TiersResponse
from app.routers.auth import get_current_user
from app.utils.rbac import require_role, require_permission
from app.services.tiers_service import TiersService

router = APIRouter()


@router.get("/", response_model=List[TiersResponse])
@require_permission("tiers:read")
async def list_tiers(
    skip: int = 0,
    limit: int = 100,
    statut: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les tiers avec pagination."""
    if statut == "ACTIF":
        return TiersService.get_tiers_actifs(db)
    return TiersService.get_all_tiers(db, skip, limit)


@router.get("/{tiers_id}", response_model=TiersResponse)
@require_permission("tiers:read")
async def get_tiers(
    tiers_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un tiers par son ID."""
    tiers = TiersService.get_tiers(db, tiers_id)
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.get("/code/{code_tiers}", response_model=TiersResponse)
@require_permission("tiers:read")
async def get_tiers_by_code(
    code_tiers: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un tiers par son code."""
    tiers = TiersService.get_tiers_by_code(db, code_tiers)
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.get("/niu/{niu}", response_model=TiersResponse)
@require_permission("tiers:read")
async def get_tiers_by_niu(
    niu: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un tiers par son NIU."""
    tiers = TiersService.get_tiers_by_niu(db, niu)
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.get("/service/{service}", response_model=List[TiersResponse])
@require_permission("tiers:read")
async def get_tiers_by_service(
    service: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les tiers autorisés pour un service."""
    return TiersService.get_tiers_by_service(db, service)


@router.post("/", response_model=TiersResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER, User.Role.FINANCE])
@require_permission("tiers:write")
async def create_tiers(
    tiers_data: TiersCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée un nouveau tiers."""
    try:
        return TiersService.create_tiers(db, tiers_data, current_user.username)
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))


@router.put("/{tiers_id}", response_model=TiersResponse)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER, User.Role.FINANCE])
@require_permission("tiers:write")
async def update_tiers(
    tiers_id: int,
    tiers_data: TiersUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour un tiers."""
    tiers = TiersService.update_tiers(db, tiers_id, tiers_data)
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.delete("/{tiers_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_role([User.Role.ADMIN])
@require_permission("tiers:delete")
async def delete_tiers(
    tiers_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime un tiers."""
    success = TiersService.delete_tiers(db, tiers_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return None


@router.post("/{tiers_id}/activer", response_model=TiersResponse)
@require_role([User.Role.ADMIN])
@require_permission("tiers:write")
async def activer_tiers(
    tiers_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Active un tiers."""
    tiers = TiersService.activer_tiers(db, tiers_id)
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.post("/{tiers_id}/bloquer", response_model=TiersResponse)
@require_role([User.Role.ADMIN])
@require_permission("tiers:write")
async def bloquer_tiers(
    tiers_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Bloque un tiers."""
    tiers = TiersService.bloquer_tiers(db, tiers_id)
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.post("/{tiers_id}/desactiver", response_model=TiersResponse)
@require_role([User.Role.ADMIN])
@require_permission("tiers:write")
async def desactiver_tiers(
    tiers_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Désactive un tiers."""
    tiers = TiersService.desactiver_tiers(db, tiers_id)
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.post("/{tiers_id}/autoriser/{service}", response_model=TiersResponse)
@require_role([User.Role.ADMIN])
@require_permission("tiers:write")
async def autoriser_service(
    tiers_id: int,
    service: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Autorise un service pour un tiers."""
    tiers = TiersService.autoriser_service(db, tiers_id, service)
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.post("/{tiers_id}/revoquer/{service}", response_model=TiersResponse)
@require_role([User.Role.ADMIN])
@require_permission("tiers:write")
async def revoquer_service(
    tiers_id: int,
    service: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Révoque un service pour un tiers."""
    tiers = TiersService.revoquer_service(db, tiers_id, service)
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.post("/{tiers_id}/limite-credit", response_model=TiersResponse)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("tiers:write")
async def mettre_a_jour_limite_credit(
    tiers_id: int,
    nouvelle_limite: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour la limite de crédit d'un tiers."""
    from decimal import Decimal
    tiers = TiersService.mettre_a_jour_limite_credit(db, tiers_id, Decimal(str(nouvelle_limite)))
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.get("/recherche/{terme}", response_model=List[TiersResponse])
@require_permission("tiers:read")
async def rechercher_tiers(
    terme: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Recherche des tiers par terme."""
    return TiersService.rechercher_tiers(db, terme)
