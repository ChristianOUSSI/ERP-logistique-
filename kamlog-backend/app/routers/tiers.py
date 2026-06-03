# app/routers/tiers.py — Router Tiers
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.tiers import Tiers
from app.schemas.tiers import TiersCreate, TiersUpdate, TiersResponse
from app.routers.auth import get_current_user
from app.models.user import User
from app.utils.rbac import require_role

router = APIRouter()


@router.get("/", response_model=List[TiersResponse])
async def list_tiers(
    skip: int = 0,
    limit: int = 100,
    statut: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les tiers avec pagination."""
    query = select(Tiers).where(Tiers.deleted_at.is_(None))
    
    if statut:
        query = query.where(Tiers.statut == statut)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{tiers_id}", response_model=TiersResponse)
async def get_tiers(
    tiers_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un tiers par son ID."""
    result = await db.execute(select(Tiers).where(Tiers.id == tiers_id))
    tiers = result.scalar_one_or_none()
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    return tiers


@router.post("/", response_model=TiersResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER, User.Role.FINANCE])
async def create_tiers(
    tiers_data: TiersCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée un nouveau tiers."""
    # Vérifier si le NIU existe déjà
    result = await db.execute(select(Tiers).where(Tiers.niu == tiers_data.niu))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="NIU already exists"
        )
    
    # Vérifier si le code_tiers existe déjà
    result = await db.execute(select(Tiers).where(Tiers.code_tiers == tiers_data.code_tiers))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code tiers already exists"
        )
    
    db_tiers = Tiers(**tiers_data.model_dump())
    db.add(db_tiers)
    await db.commit()
    await db.refresh(db_tiers)
    
    return db_tiers


@router.put("/{tiers_id}", response_model=TiersResponse)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER, User.Role.FINANCE])
async def update_tiers(
    tiers_id: int,
    tiers_data: TiersUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour un tiers."""
    result = await db.execute(select(Tiers).where(Tiers.id == tiers_id))
    tiers = result.scalar_one_or_none()
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    update_data = tiers_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tiers, field, value)
    
    await db.commit()
    await db.refresh(tiers)
    
    return tiers


@router.patch("/{tiers_id}/statut", response_model=TiersResponse)
@require_role([User.Role.ADMIN])
async def update_tiers_statut(
    tiers_id: int,
    statut: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour le statut d'un tiers."""
    result = await db.execute(select(Tiers).where(Tiers.id == tiers_id))
    tiers = result.scalar_one_or_none()
    
    if not tiers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tiers not found"
        )
    
    tiers.statut = statut
    await db.commit()
    await db.refresh(tiers)
    
    return tiers
