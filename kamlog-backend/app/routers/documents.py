# app/routers/documents.py — Router Documents
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.user import User
from app.utils.rbac import require_role

router = APIRouter()


class GenerateBLRequest(BaseModel):
    mission_id: int


@router.post("/bl")
@require_role([User.Role.ADMIN, User.Role.DISPATCHER, User.Role.FINANCE])
async def generate_bl(
    request: GenerateBLRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Génère un Bon de Livraison PDF pour une mission."""
    # TODO: Implémenter la génération PDF avec WeasyPrint
    return {
        "message": "BL generation not yet implemented",
        "mission_id": request.mission_id
    }


@router.post("/interchange")
@require_role([User.Role.ADMIN, User.Role.GATE_AGENT])
async def generate_interchange(
    conteneur_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Génère un document Interchange PDF."""
    # TODO: Implémenter la génération PDF avec WeasyPrint
    return {
        "message": "Interchange generation not yet implemented",
        "conteneur_id": conteneur_id
    }


@router.post("/facture/{facture_id}")
@require_role([User.Role.ADMIN, User.Role.FINANCE])
async def generate_facture_pdf(
    facture_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Génère une facture PDF."""
    # TODO: Implémenter la génération PDF avec WeasyPrint
    return {
        "message": "Facture PDF generation not yet implemented",
        "facture_id": facture_id
    }
