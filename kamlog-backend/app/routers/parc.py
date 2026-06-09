# app/routers/parc.py  Router Parc
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.parc import ZoneParc, EmplacementParc, StockPhysiqueParc
from app.models.user import User
from app.schemas.parc import (
    ZoneParcCreate, ZoneParcResponse,
    EmplacementParcCreate, EmplacementParcResponse,
    StockPhysiqueParcCreate, StockPhysiqueParcResponse,
    GateInRequest, GateOutRequest
)
from app.routers.auth import get_current_user
from app.utils.rbac import require_role, require_permission
from app.services.parc_service import (
    ZoneParcService, EmplacementParcService, StockPhysiqueParcService,
    MouvementParcService, GateService
)

router = APIRouter()


@router.get("/zones", response_model=List[ZoneParcResponse])
@require_permission("parc:read")
async def list_zones(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste toutes les zones du parc."""
    return ZoneParcService.get_all_zones(db, skip, limit)


@router.get("/zones/{zone_id}", response_model=ZoneParcResponse)
@require_permission("parc:read")
async def get_zone(
    zone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère une zone par ID."""
    zone = ZoneParcService.get_zone(db, zone_id)
    if not zone:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Zone introuvable")
    return zone


@router.post("/zones", response_model=ZoneParcResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN])
@require_permission("parc:write")
async def create_zone(
    zone_data: ZoneParcCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une nouvelle zone."""
    return ZoneParcService.create_zone(db, zone_data, current_user.username)


@router.put("/zones/{zone_id}", response_model=ZoneParcResponse)
@require_role([User.Role.ADMIN])
@require_permission("parc:write")
async def update_zone(
    zone_id: int,
    zone_data: ZoneParcCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour une zone."""
    zone = ZoneParcService.update_zone(db, zone_id, zone_data)
    if not zone:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Zone introuvable")
    return zone


@router.delete("/zones/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_role([User.Role.ADMIN])
@require_permission("parc:delete")
async def delete_zone(
    zone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime une zone."""
    success = ZoneParcService.delete_zone(db, zone_id)
    if not success:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Zone introuvable")
    return None


@router.get("/emplacements", response_model=List[EmplacementParcResponse])
@require_permission("parc:read")
async def list_emplacements(
    skip: int = 0,
    limit: int = 100,
    zone_id: int | None = None,
    statut: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les emplacements."""
    if zone_id:
        return EmplacementParcService.get_emplacements_by_zone(db, zone_id)
    if statut == "LIBRE":
        return EmplacementParcService.get_emplacements_libres(db)
    return EmplacementParcService.get_all_emplacements(db, skip, limit)


@router.get("/emplacements/{emplacement_id}", response_model=EmplacementParcResponse)
@require_permission("parc:read")
async def get_emplacement(
    emplacement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un emplacement par ID."""
    emplacement = EmplacementParcService.get_emplacement(db, emplacement_id)
    if not emplacement:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Emplacement introuvable")
    return emplacement


@router.post("/emplacements", response_model=EmplacementParcResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN])
@require_permission("parc:write")
async def create_emplacement(
    emplacement_data: EmplacementParcCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée un nouvel emplacement."""
    return EmplacementParcService.create_emplacement(db, emplacement_data, current_user.username)


@router.put("/emplacements/{emplacement_id}", response_model=EmplacementParcResponse)
@require_role([User.Role.ADMIN])
@require_permission("parc:write")
async def update_emplacement(
    emplacement_id: int,
    emplacement_data: EmplacementParcCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour un emplacement."""
    emplacement = EmplacementParcService.update_emplacement(db, emplacement_id, emplacement_data)
    if not emplacement:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Emplacement introuvable")
    return emplacement


@router.delete("/emplacements/{emplacement_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_role([User.Role.ADMIN])
@require_permission("parc:delete")
async def delete_emplacement(
    emplacement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime un emplacement."""
    success = EmplacementParcService.delete_emplacement(db, emplacement_id)
    if not success:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Emplacement introuvable")
    return None


@router.get("/stock", response_model=List[StockPhysiqueParcResponse])
@require_permission("parc:read")
async def list_stock(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste le stock physique du parc."""
    return StockPhysiqueParcService.get_all_stocks(db, skip, limit)


@router.get("/stock/{stock_id}", response_model=StockPhysiqueParcResponse)
@require_permission("parc:read")
async def get_stock(
    stock_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un stock par ID."""
    stock = StockPhysiqueParcService.get_stock(db, stock_id)
    if not stock:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Stock introuvable")
    return stock


@router.get("/stock/actifs", response_model=List[StockPhysiqueParcResponse])
@require_permission("parc:read")
async def list_stock_actifs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste le stock actif (conteneurs présents dans le parc)."""
    return StockPhysiqueParcService.get_stocks_actifs(db)


@router.post("/gate-in")
@require_role([User.Role.ADMIN, User.Role.GATE_AGENT])
@require_permission("parc:gate")
async def gate_in(
    gate_in_data: GateInRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Traite l'entrée d'un conteneur (Gate In)."""
    try:
        result = GateService.process_gate_in(db, gate_in_data, current_user.id)
        return result
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))


@router.post("/gate-out")
@require_role([User.Role.ADMIN, User.Role.GATE_AGENT])
@require_permission("parc:gate")
async def gate_out(
    gate_out_data: GateOutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Traite la sortie d'un conteneur (Gate Out)."""
    try:
        result = GateService.process_gate_out(db, gate_out_data, current_user.id)
        return result
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))
