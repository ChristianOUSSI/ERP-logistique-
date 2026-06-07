# app/routers/gateway.py - Router pour les passerelles inter-modules
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.shared import (
    PasserelleCreate, PasserelleUpdate, Passerelle,
    CommandeFactureDTO, CommandeLivraisonDTO, ReceptionStockDTO,
    FacturePaiementDTO, MissionFactureDTO
)
from app.services.gateway_service import gateway_service
from app.utils.permissions import check_permission
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/api/gateway", tags=["Gateway"])


@router.post("/passerelles", response_model=Passerelle, status_code=status.HTTP_201_CREATED)
@check_permission("admin")
def create_passerelle(
    passerelle: PasserelleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """
    Crée une nouvelle passerelle entre modules.
    
    **Permissions requises**: admin
    """
    try:
        result = gateway_service.create_passerelle(db, passerelle, current_user.get("email"))
        return result
    except Exception as e:
        logger.error(f"Erreur création passerelle: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création de la passerelle: {str(e)}"
        )


@router.get("/passerelles/{passerelle_id}", response_model=Passerelle)
@check_permission("admin")
def get_passerelle(
    passerelle_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """Récupère une passerelle par son ID."""
    passerelle = gateway_service.get_passerelle(db, passerelle_id)
    if not passerelle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Passerelle {passerelle_id} non trouvée"
        )
    return passerelle


@router.get("/passerelles/source/{source_module}/{source_id}", response_model=List[Passerelle])
@check_permission("admin")
def get_passerelles_by_source(
    source_module: str,
    source_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """Récupère toutes les passerelles pour une source donnée."""
    return gateway_service.get_passerelles_by_source(db, source_module, source_id)


@router.get("/passerelles/cible/{cible_module}/{cible_id}", response_model=List[Passerelle])
@check_permission("admin")
def get_passerelles_by_cible(
    cible_module: str,
    cible_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """Récupère toutes les passerelles pour une cible donnée."""
    return gateway_service.get_passerelles_by_cible(db, cible_module, cible_id)


@router.get("/passerelles/en-attente", response_model=List[Passerelle])
@check_permission("admin")
def get_passerelles_en_attente(
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """Récupère toutes les passerelles en attente de traitement."""
    return gateway_service.get_passerelles_en_attente(db)


@router.put("/passerelles/{passerelle_id}", response_model=Passerelle)
@check_permission("admin")
def update_passerelle(
    passerelle_id: int,
    passerelle_update: PasserelleUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """Met à jour une passerelle."""
    result = gateway_service.update_passerelle(db, passerelle_id, passerelle_update, current_user.get("email"))
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Passerelle {passerelle_id} non trouvée"
        )
    return result


# ============ Passerelles spécifiques ============

@router.post("/passerelles/commande-facture", response_model=Passerelle, status_code=status.HTTP_201_CREATED)
@check_permission("admin")
def creer_commande_facture(
    dto: CommandeFactureDTO,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """
    Crée une passerelle Commande → Facture.
    
    Cette passerelle est créée automatiquement lors de la validation d'une commande
    pour déclencher la facturation dans le module Finance.
    """
    try:
        result = gateway_service.creer_commande_facture(db, dto, current_user.get("email"))
        return result
    except Exception as e:
        logger.error(f"Erreur création passerelle commande-facture: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création de la passerelle: {str(e)}"
        )


@router.post("/passerelles/commande-livraison", response_model=Passerelle, status_code=status.HTTP_201_CREATED)
@check_permission("admin")
def creer_commande_livraison(
    dto: CommandeLivraisonDTO,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """
    Crée une passerelle Commande → Livraison.
    
    Cette passerelle est créée automatiquement lors de la validation d'une commande
    pour déclencher la préparation de la livraison dans le module Transport.
    """
    try:
        result = gateway_service.creer_commande_livraison(db, dto, current_user.get("email"))
        return result
    except Exception as e:
        logger.error(f"Erreur création passerelle commande-livraison: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création de la passerelle: {str(e)}"
        )


@router.post("/passerelles/reception-stock", response_model=Passerelle, status_code=status.HTTP_201_CREATED)
@check_permission("admin")
def creer_reception_stock(
    dto: ReceptionStockDTO,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """
    Crée une passerelle Réception → Stock.
    
    Cette passerelle est créée automatiquement lors de la validation d'une réception
    pour mettre à jour le stock dans le module Magasin.
    """
    try:
        result = gateway_service.creer_reception_stock(db, dto, current_user.get("email"))
        return result
    except Exception as e:
        logger.error(f"Erreur création passerelle reception-stock: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création de la passerelle: {str(e)}"
        )


@router.post("/passerelles/facture-paiement", response_model=Passerelle, status_code=status.HTTP_201_CREATED)
@check_permission("admin")
def creer_facture_paiement(
    dto: FacturePaiementDTO,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """
    Crée une passerelle Facture → Paiement.
    
    Cette passerelle est créée automatiquement lors de la validation d'une facture
    pour déclencher le suivi des paiements dans le module Finance.
    """
    try:
        result = gateway_service.creer_facture_paiement(db, dto, current_user.get("email"))
        return result
    except Exception as e:
        logger.error(f"Erreur création passerelle facture-paiement: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création de la passerelle: {str(e)}"
        )


@router.post("/passerelles/mission-facture", response_model=Passerelle, status_code=status.HTTP_201_CREATED)
@check_permission("admin")
def creer_mission_facture(
    dto: MissionFactureDTO,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """
    Crée une passerelle Mission → Facture.
    
    Cette passerelle est créée automatiquement lors de la validation d'une mission
    pour déclencher la facturation dans le module Finance.
    """
    try:
        result = gateway_service.creer_mission_facture(db, dto, current_user.get("email"))
        return result
    except Exception as e:
        logger.error(f"Erreur création passerelle mission-facture: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création de la passerelle: {str(e)}"
        )


@router.post("/passerelles/{passerelle_id}/traiter/{cible_id}", response_model=Passerelle)
@check_permission("admin")
def traiter_passerelle(
    passerelle_id: int,
    cible_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """
    Traite une passerelle (marque comme traitée et lie à l'entité cible).
    
    Cette action est appelée automatiquement par le module cible lors de la création
    de l'entité correspondante.
    """
    result = gateway_service.traiter_passerelle(db, passerelle_id, cible_id, current_user.get("email"))
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Passerelle {passerelle_id} non trouvée"
        )
    return result


@router.post("/passerelles/{passerelle_id}/echouer", response_model=Passerelle)
@check_permission("admin")
def echouer_passerelle(
    passerelle_id: int,
    message_erreur: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("admin"))
):
    """
    Marque une passerelle comme échouée.
    
    Cette action est appelée en cas d'erreur lors du traitement de la passerelle.
    """
    result = gateway_service.echouer_passerelle(db, passerelle_id, message_erreur, current_user.get("email"))
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Passerelle {passerelle_id} non trouvée"
        )
    return result
