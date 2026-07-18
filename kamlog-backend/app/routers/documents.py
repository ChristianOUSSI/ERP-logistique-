# app/routers/documents.py  Router Documents
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import Response
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.user import User
from app.utils.rbac import require_role
from app.models.transport import MissionTransport
from app.models.tiers import Tiers
from app.models.finance import Facture
from app.utils.pdf_generator import generer_bl_pdf, generer_facture_pdf
from app.utils.rate_limiting import limiter

router = APIRouter()


class GenerateBLRequest(BaseModel):
    mission_id: int


@router.post("/bl")
@limiter.limit("10/minute")
@require_role(["admin", "dispatcher", "finance"])
def generate_bl(
    request: Request,
    payload: GenerateBLRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Génère un Bon de Livraison PDF pour une mission."""
    # Récupérer la mission
    mission = db.get(MissionTransport, payload.mission_id)
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Mission non trouvée")
    
    # Récupérer le client
    tiers = db.get(Tiers, mission.tiers_id)
    if not tiers:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Client non trouvé")
    
    # Générer le PDF
    pdf_bytes = generer_bl_pdf(mission, tiers)
    
    # Retourner le PDF
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=BL_{mission.reference}.pdf"
        }
    )


@router.post("/interchange")
@limiter.limit("20/minute")
@require_role(["admin", "gate_agent"])
def generate_interchange(
    request: Request,
    conteneur_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Génère un document Interchange PDF."""
    # TODO: Implémenter la génération PDF Interchange
    return {
        "message": "Interchange generation not yet implemented",
        "conteneur_id": conteneur_id
    }


@router.post("/facture/{facture_id}")
@limiter.limit("10/minute")
@require_role(["admin", "finance"])
def generate_facture_pdf(
    request: Request,
    facture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Génère une facture PDF."""
    # Récupérer la facture
    facture = db.get(Facture, facture_id)
    if not facture:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Facture non trouvée")
    
    # Récupérer le client
    tiers = db.get(Tiers, facture.tiers_id)
    if not tiers:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Client non trouvé")
    
    # Générer le PDF
    pdf_bytes = generer_facture_pdf(facture, tiers)
    
    # Retourner le PDF
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Facture_{facture.numero_facture}.pdf"
        }
    )
