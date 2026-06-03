# app/routers/parc.py — Router Parc
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.parc import ZoneParc, EmplacementParc, StockPhysiqueParc
from app.schemas.parc import (
    ZoneParcCreate, ZoneParcResponse,
    EmplacementParcCreate, EmplacementParcResponse,
    StockPhysiqueParcCreate, StockPhysiqueParcResponse,
    GateInRequest, GateOutRequest
)
from app.routers.auth import get_current_user
from app.models.user import User
from app.utils.rbac import require_role
from app.services.parc_service import process_gate_in, process_gate_out

router = APIRouter()


@router.get("/zones", response_model=List[ZoneParcResponse])
async def list_zones(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste toutes les zones du parc."""
    query = select(ZoneParc).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/zones", response_model=ZoneParcResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN])
async def create_zone(
    zone_data: ZoneParcCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une nouvelle zone."""
    db_zone = ZoneParc(**zone_data.model_dump())
    db.add(db_zone)
    await db.commit()
    await db.refresh(db_zone)
    
    return db_zone


@router.get("/emplacements", response_model=List[EmplacementParcResponse])
async def list_emplacements(
    skip: int = 0,
    limit: int = 100,
    zone_id: int | None = None,
    statut: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les emplacements."""
    query = select(EmplacementParc)
    
    if zone_id:
        query = query.where(EmplacementParc.zone_id == zone_id)
    
    if statut:
        query = query.where(EmplacementParc.statut == statut)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/emplacements", response_model=EmplacementParcResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN])
async def create_emplacement(
    emplacement_data: EmplacementParcCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée un nouvel emplacement."""
    db_emplacement = EmplacementParc(**emplacement_data.model_dump())
    db.add(db_emplacement)
    await db.commit()
    await db.refresh(db_emplacement)
    
    return db_emplacement


@router.get("/stock", response_model=List[StockPhysiqueParcResponse])
async def list_stock(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste le stock physique du parc."""
    query = select(StockPhysiqueParc).where(StockPhysiqueParc.date_gate_out.is_(None))
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/gate-in")
@require_role([User.Role.ADMIN, User.Role.GATE_AGENT])
async def gate_in(
    gate_in_data: GateInRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Traite l'entrée d'un conteneur (Gate In)."""
    result = await process_gate_in(db, gate_in_data, current_user.id)
    return result


@router.post("/gate-out")
@require_role([User.Role.ADMIN, User.Role.GATE_AGENT])
async def gate_out(
    gate_out_data: GateOutRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Traite la sortie d'un conteneur (Gate Out)."""
    result = await process_gate_out(db, gate_out_data, current_user.id)
    return result
