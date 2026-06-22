# app/routers/finance.py  Router Finance
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
import csv
import io

from app.database import get_db
from app.models.finance import Facture, Encaissement, GrilleTarifaire, StatutFacture
from app.models.transport import MissionTransport
from app.models.user import User
from app.schemas.finance import (
    FactureCreate, FactureUpdate, FactureResponse,
    EncaissementCreate, EncaissementUpdate, EncaissementResponse,
    GrilleTarifaireCreate, GrilleTarifaireUpdate, GrilleTarifaireResponse, EncoursResponse,
    ReconciliationMatchResponse, AvoirCreate, AvoirResponse
)
from app.routers.auth import get_current_user
from app.utils.rbac import require_role, require_permission
from app.services.finance_service import (
    FactureService, EncaissementService, GrilleTarifaireService, EncoursService,
    calculer_tva, BankReconciliationService
    AvoirService

router = APIRouter()


@router.get("/factures", response_model=List[FactureResponse])
@require_permission("finance:read")
async def list_factures(
    skip: int = 0,
    limit: int = 100,
    statut: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste toutes les factures."""
    if statut:
        if statut == "non_soldees":
            return FactureService.get_factures_non_soldées(db)
    return FactureService.get_all_factures(db, skip, limit)


@router.get("/factures/{facture_id}", response_model=FactureResponse)
@require_permission("finance:read")
async def get_facture(
    facture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère une facture par ID."""
    facture = FactureService.get_facture(db, facture_id)
    if not facture:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Facture introuvable")
    return facture


@router.get("/factures/tiers/{tiers_id}", response_model=List[FactureResponse])
@require_permission("finance:read")
async def get_factures_by_tiers(
    tiers_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les factures d'un tiers."""
    return FactureService.get_factures_by_tiers(db, tiers_id)


@router.post("/factures", response_model=FactureResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:write")
async def create_facture(
    facture_data: FactureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une nouvelle facture."""
    # Vérifier la limite de crédit
    try:
        EncoursService.verifier_limite_credit(db, facture_data.tiers_id, facture_data.montant_ht_xaf)
    except ValueError as e:
        raise HTTPException(status.HTTP_402_PAYMENT_REQUIRED, str(e))
    
    return FactureService.create_facture(db, facture_data, current_user.username)


@router.put("/factures/{facture_id}", response_model=FactureResponse)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:write")
async def update_facture(
    facture_id: int,
    facture_data: FactureUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour une facture."""
    facture = FactureService.update_facture(db, facture_id, facture_data)
    if not facture:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Facture introuvable")
    return facture


@router.delete("/factures/{facture_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_role([User.Role.ADMIN])
@require_permission("finance:delete")
async def delete_facture(
    facture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime une facture."""
    success = FactureService.delete_facture(db, facture_id)
    if not success:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Facture introuvable")
    return None


@router.post("/factures/{facture_id}/valider", response_model=FactureResponse)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:validate")
async def valider_facture(
    facture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Valide une facture."""
    facture = FactureService.valider_facture(db, facture_id, current_user.username)
    if not facture:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Facture introuvable")
    return facture


@router.post("/factures/{facture_id}/annuler", response_model=FactureResponse)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:validate")
async def annuler_facture(
    facture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Annule une facture."""
    facture = FactureService.annuler_facture(db, facture_id)
    if not facture:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Facture introuvable")
    return facture


@router.get("/encaissements", response_model=List[EncaissementResponse])
@require_permission("finance:read")
async def list_encaissements(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les encaissements."""
    return EncaissementService.get_all_encaissements(db, skip, limit)


@router.get("/encaissements/{encaissement_id}", response_model=EncaissementResponse)
@require_permission("finance:read")
async def get_encaissement(
    encaissement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un encaissement par ID."""
    encaissement = EncaissementService.get_encaissement(db, encaissement_id)
    if not encaissement:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Encaissement introuvable")
    return encaissement


@router.get("/encaissements/tiers/{tiers_id}", response_model=List[EncaissementResponse])
@require_permission("finance:read")
async def get_encaissements_by_tiers(
    tiers_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les encaissements d'un tiers."""
    return EncaissementService.get_encaissements_by_tiers(db, tiers_id)


@router.get("/encaissements/non-lettrés", response_model=List[EncaissementResponse])
@require_permission("finance:read")
async def get_encaissements_non_lettrés(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les encaissements non lettrés."""
    return EncaissementService.get_encaissements_non_lettrés(db)


@router.post("/encaissements", response_model=EncaissementResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:write")
async def create_encaissement(
    encaissement_data: EncaissementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Enregistre un encaissement."""
    return EncaissementService.create_encaissement(db, encaissement_data, current_user.username)


@router.put("/encaissements/{encaissement_id}", response_model=EncaissementResponse)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:write")
async def update_encaissement(
    encaissement_id: int,
    encaissement_data: EncaissementUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour un encaissement."""
    encaissement = EncaissementService.update_encaissement(db, encaissement_id, encaissement_data)
    if not encaissement:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Encaissement introuvable")
    return encaissement


@router.delete("/encaissements/{encaissement_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_role([User.Role.ADMIN])
@require_permission("finance:delete")
async def delete_encaissement(
    encaissement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime un encaissement."""
    success = EncaissementService.delete_encaissement(db, encaissement_id)
    if not success:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Encaissement introuvable")
    return None


@router.post("/encaissements/{encaissement_id}/lettrer/{facture_id}", response_model=EncaissementResponse)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:write")
async def lettrer_encaissement(
    encaissement_id: int,
    facture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lettre un encaissement à une facture."""
    encaissement = EncaissementService.lettrer_encaissement(db, encaissement_id, facture_id)
    if not encaissement:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Encaissement introuvable")
    return encaissement


@router.get("/encours/{tiers_id}", response_model=EncoursResponse)
@require_permission("finance:read")
async def get_encours(
    tiers_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calcule l'encours client en temps réel."""
    return EncoursService.calculer_encours_client(db, tiers_id)


@router.get("/tarifs", response_model=List[GrilleTarifaireResponse])
@require_permission("finance:read")
async def list_tarifs(
    skip: int = 0,
    limit: int = 100,
    type_service: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste les grilles tarifaires."""
    if type_service:
        return GrilleTarifaireService.get_grilles_by_type(db, type_service)
    return GrilleTarifaireService.get_all_grilles(db, skip, limit)


@router.get("/tarifs/{grille_id}", response_model=GrilleTarifaireResponse)
@require_permission("finance:read")
async def get_tarif(
    grille_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère une grille tarifaire par ID."""
    grille = GrilleTarifaireService.get_grille(db, grille_id)
    if not grille:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Grille tarifaire introuvable")
    return grille


# --- Avoirs ---

avoir_service = AvoirService()

@router.post("/avoirs", response_model=AvoirResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:write")
async def create_avoir(
    avoir_data: AvoirCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée un nouvel avoir."""
    try:
        return avoir_service.create_avoir(db, avoir_data, current_user.username)
    except ConflictException as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    

@router.get("/avoirs", response_model=List[AvoirResponse])
@require_permission("finance:read")
async def list_avoirs(
    skip: int = 0,
    limit: int = 100,
    tiers_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les avoirs ou les avoirs d'un tiers."""
    if tiers_id:
        return avoir_service.get_avoirs_by_tiers(db, tiers_id)
    return avoir_service.get_all_avoirs(db, skip, limit)


@router.get("/avoirs/{avoir_id}", response_model=AvoirResponse)
@require_permission("finance:read")
async def get_avoir(
    avoir_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un avoir par ID."""
    try:
        return avoir_service.get_avoir(db, avoir_id)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    

@router.post("/avoirs/{avoir_id}/mark-used", response_model=AvoirResponse)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:write")
async def mark_avoir_as_used(
    avoir_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Marque un avoir comme utilisé."""
    try:
        return avoir_service.mark_avoir_as_used(db, avoir_id)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except BusinessLogicException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/avoirs/unutilized/{tiers_id}", response_model=List[AvoirResponse])
@require_permission("finance:read")
async def get_unutilized_avoirs_by_tiers(
    tiers_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les avoirs non utilisés d'un tiers."""
    return avoir_service.get_unutilized_avoirs_by_tiers(db, tiers_id)

@router.get("/tarifs/active/{type_service}", response_model=GrilleTarifaireResponse)
@require_permission("finance:read")
async def get_tarif_active(
    type_service: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère la grille tarifaire active pour un service."""
    grille = GrilleTarifaireService.get_grille_active(db, type_service)
    if not grille:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Aucune grille tarifaire active trouvée")
    return grille


@router.post("/tarifs", response_model=GrilleTarifaireResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:write")
async def create_tarif(
    tarif_data: GrilleTarifaireCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une nouvelle grille tarifaire."""
    return GrilleTarifaireService.create_grille(db, tarif_data, current_user.username)


@router.put("/tarifs/{grille_id}", response_model=GrilleTarifaireResponse)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:write")
async def update_tarif(
    grille_id: int,
    tarif_data: GrilleTarifaireUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour une grille tarifaire."""
    grille = GrilleTarifaireService.update_grille(db, grille_id, tarif_data)
    if not grille:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Grille tarifaire introuvable")
    return grille


@router.delete("/tarifs/{grille_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_role([User.Role.ADMIN])
@require_permission("finance:delete")
async def delete_tarif(
    grille_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime une grille tarifaire."""
    success = GrilleTarifaireService.delete_grille(db, grille_id)
    if not success:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Grille tarifaire introuvable")
    return None


@router.post("/tarifs/{grille_id}/activer", response_model=GrilleTarifaireResponse)
@require_role([User.Role.ADMIN, User.Role.FINANCE])
@require_permission("finance:write")
async def activer_tarif(
    grille_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Active une grille tarifaire."""
    grille = GrilleTarifaireService.activer_grille(db, grille_id)
    if not grille:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Grille tarifaire introuvable")
    return grille


@router.post("/calculer-tva")
@require_permission("finance:read")
async def calculer_tva_endpoint(
    montant_ht: Decimal,
):
    """Calcule la TVA pour un montant HT."""
    return calculer_tva(montant_ht)
