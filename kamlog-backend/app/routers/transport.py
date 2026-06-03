# app/routers/transport.py — Router Transport
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.transport import CamionFlotte, ChauffeurProfil, MissionTransport
from app.schemas.transport import (
    CamionCreate, CamionResponse,
    ChauffeurCreate, ChauffeurResponse,
    MissionCreate, MissionUpdate, MissionResponse
)
from app.routers.auth import get_current_user
from app.models.user import User
from app.utils.rbac import require_role
from app.services.transport_service import valider_creation_mission

router = APIRouter()


# ─── Camions ───────────────────────────────────────────────
@router.get("/camions", response_model=List[CamionResponse])
async def list_camions(
    skip: int = 0,
    limit: int = 100,
    statut: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les camions de la flotte."""
    query = select(CamionFlotte).where(CamionFlotte.actif == True)
    
    if statut:
        query = query.where(CamionFlotte.statut == statut)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/camions", response_model=CamionResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
async def create_camion(
    camion_data: CamionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ajoute un camion à la flotte."""
    # Vérifier si l'immatriculation existe déjà
    result = await db.execute(select(CamionFlotte).where(CamionFlotte.immatriculation == camion_data.immatriculation))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Immatriculation already exists"
        )
    
    db_camion = CamionFlotte(**camion_data.model_dump())
    db.add(db_camion)
    await db.commit()
    await db.refresh(db_camion)
    
    return db_camion


# ─── Chauffeurs ─────────────────────────────────────────────
@router.get("/chauffeurs", response_model=List[ChauffeurResponse])
async def list_chauffeurs(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les chauffeurs."""
    query = select(ChauffeurProfil).where(ChauffeurProfil.actif == True)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/chauffeurs", response_model=ChauffeurResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
async def create_chauffeur(
    chauffeur_data: ChauffeurCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ajoute un chauffeur."""
    # Vérifier si le numéro de permis existe déjà
    result = await db.execute(select(ChauffeurProfil).where(ChauffeurProfil.numero_permis == chauffeur_data.numero_permis))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Permit number already exists"
        )
    
    db_chauffeur = ChauffeurProfil(**chauffeur_data.model_dump())
    db.add(db_chauffeur)
    await db.commit()
    await db.refresh(db_chauffeur)
    
    return db_chauffeur


# ─── Missions ───────────────────────────────────────────────
@router.get("/missions", response_model=List[MissionResponse])
async def list_missions(
    skip: int = 0,
    limit: int = 100,
    statut: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste toutes les missions de transport."""
    query = select(MissionTransport)
    
    if statut:
        query = query.where(MissionTransport.statut == statut)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/missions/{mission_id}", response_model=MissionResponse)
async def get_mission(
    mission_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère une mission par son ID."""
    result = await db.execute(select(MissionTransport).where(MissionTransport.id == mission_id))
    mission = result.scalar_one_or_none()
    
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    
    return mission


@router.post("/missions", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
async def create_mission(
    mission_data: MissionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une nouvelle mission de transport."""
    # Valider les règles métier
    await valider_creation_mission(db, mission_data)
    
    db_mission = MissionTransport(**mission_data.model_dump())
    db.add(db_mission)
    await db.commit()
    await db.refresh(db_mission)
    
    return db_mission


@router.patch("/missions/{mission_id}/statut", response_model=MissionResponse)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
async def update_mission_statut(
    mission_id: int,
    mission_data: MissionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour le statut d'une mission."""
    result = await db.execute(select(MissionTransport).where(MissionTransport.id == mission_id))
    mission = result.scalar_one_or_none()
    
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    
    mission.statut = mission_data.statut
    if mission_data.notes:
        mission.notes = mission_data.notes
    
    await db.commit()
    await db.refresh(mission)
    
    return mission
