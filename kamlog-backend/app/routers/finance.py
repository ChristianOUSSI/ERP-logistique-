# app/routers/finance.py — Router Finance
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.finance import Facture, Encaissement, GrilleTarifaire
from app.schemas.finance import (
    FactureCreate, FactureResponse,
    EncaissementCreate, EncaissementResponse,
    GrilleTarifaireCreate, GrilleTarifaireResponse,
    EncoursResponse
)
from app.routers.auth import get_current_user
from app.models.user import User
from app.utils.rbac import require_role
from app.services.finance_service import calculer_encours_client, verifier_limite_credit

router = APIRouter()


@router.get("/factures", response_model=List[FactureResponse])
async def list_factures(
    skip: int = 0,
    limit: int = 100,
    statut: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste toutes les factures."""
    query = select(Facture)
    
    if statut:
        query = query.where(Facture.statut == statut)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/factures", response_model=FactureResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
async def create_facture(
    facture_data: FactureCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une nouvelle facture."""
    # Vérifier la limite de crédit
    await verifier_limite_credit(db, facture_data.tiers_id, facture_data.montant_ttc_xaf)
    
    db_facture = Facture(**facture_data.model_dump())
    db.add(db_facture)
    await db.commit()
    await db.refresh(db_facture)
    
    return db_facture


@router.get("/encours/{tiers_id}", response_model=EncoursResponse)
async def get_encours(
    tiers_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calcule l'encours client en temps réel."""
    encours = await calculer_encours_client(db, tiers_id)
    return encours


@router.post("/encaissements", response_model=EncaissementResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
async def create_encaissement(
    encaissement_data: EncaissementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Enregistre un encaissement."""
    db_encaissement = Encaissement(**encaissement_data.model_dump())
    db.add(db_encaissement)
    await db.commit()
    await db.refresh(db_encaissement)
    
    return db_encaissement


@router.get("/tarifs", response_model=List[GrilleTarifaireResponse])
async def list_tarifs(
    skip: int = 0,
    limit: int = 100,
    service: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste les grilles tarifaires."""
    query = select(GrilleTarifaire)
    
    if service:
        query = query.where(GrilleTarifaire.service == service)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/tarifs", response_model=GrilleTarifaireResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
async def create_tarif(
    tarif_data: GrilleTarifaireCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une nouvelle grille tarifaire."""
    db_tarif = GrilleTarifaire(**tarif_data.model_dump())
    db.add(db_tarif)
    await db.commit()
    await db.refresh(db_tarif)
    
    return db_tarif
