# app/services/dossier_service.py - Service métier pour le module Dossiers
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.models.dossier import DossierOperationnel
from app.schemas.dossier import DossierCreate, DossierUpdate
from app.services.tiers_service import TiersService
from app.exceptions import ForbiddenException, NotFoundException
from app.utils.logger import get_logger
from app.utils.cache import cache_service, invalidate_cache_pattern

logger = get_logger(__name__)


class DossierService:
    """Service pour la gestion des dossiers opérationnels"""

    @staticmethod
    def get_all_dossiers(db: Session, skip: int = 0, limit: int = 100) -> List[DossierOperationnel]:
        cache_key = f"dossiers:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(DossierOperationnel).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_dossier(db: Session, dossier_id: int) -> Optional[DossierOperationnel]:
        cache_key = f"dossiers:{dossier_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(DossierOperationnel).filter(DossierOperationnel.id == dossier_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def create_dossier(db: Session, dossier: DossierCreate, cree_par: str) -> DossierOperationnel:
        # 1. Règle Habilitation : vérifier la correspondance entre le service demandé et les droits du client
        client = TiersService.get_tiers(db, dossier.tiers_id)
        if not client:
            raise NotFoundException(f"Client (Tiers) avec ID {dossier.tiers_id} introuvable")

        service_mapping = {
            "K-TRANSIT": "autorise_transit",
            "K-TRANSPORT": "autorise_transport",
            "K-ACCONAGE": "autorise_acconage",
            "K-MANUTENTION": "autorise_manutention",
        }

        required_permission = service_mapping.get(dossier.type_service_concerne)
        if required_permission:
            authorized = getattr(client, required_permission, False)
            if not authorized:
                raise ForbiddenException(
                    f"Le client {client.raison_sociale} n'est pas habilité pour le service {dossier.type_service_concerne}"
                )

        # 2. Générer le numéro de dossier si non spécifié
        if not dossier.numero_dossier:
            year = datetime.now().year
            service_code_map = {
                "K-TRANSIT": "TR",
                "K-TRANSPORT": "TP",
                "K-ACCONAGE": "AC",
                "K-MANUTENTION": "MA",
            }
            code = service_code_map.get(dossier.type_service_concerne, "GEN")
            prefix = f"KAM-{year}-{code}"
            
            # Rechercher le dernier numéro pour ce préfixe pour calculer le numéro de séquence
            count = db.query(DossierOperationnel).filter(
                DossierOperationnel.numero_dossier.like(f"{prefix}%")
            ).count()
            dossier_num = f"{prefix}-{(count + 1):04d}"
        else:
            dossier_num = dossier.numero_dossier

        # Vérifier que le numéro généré ou fourni est unique
        existing = db.query(DossierOperationnel).filter(
            DossierOperationnel.numero_dossier == dossier_num
        ).first()
        if existing:
            raise ValueError(f"Le dossier numéro {dossier_num} existe déjà")

        db_dossier = DossierOperationnel(
            **dossier.dict(exclude={'numero_dossier'}),
            numero_dossier=dossier_num,
            reference=dossier_num,
            statut="OUVERT",
            statut_general="OUVERT",
            createur_identifiant=cree_par
        )
        db.add(db_dossier)
        db.commit()
        db.refresh(db_dossier)

        # Invalider le cache
        invalidate_cache_pattern("dossiers:*")
        logger.info(f"Dossier créé: {db_dossier.numero_dossier}", extra={"dossier_id": db_dossier.id})
        return db_dossier

    @staticmethod
    def update_dossier(db: Session, dossier_id: int, dossier: DossierUpdate) -> Optional[DossierOperationnel]:
        db_dossier = DossierService.get_dossier(db, dossier_id)
        if db_dossier:
            for field, value in dossier.dict(exclude_unset=True).items():
                setattr(db_dossier, field, value)
            
            # Synchroniser les champs statut/statut_general
            if dossier.statut_general:
                db_dossier.statut = dossier.statut_general
            elif dossier.statut:
                db_dossier.statut_general = dossier.statut

            db.commit()
            db.refresh(db_dossier)
            
            # Invalider le cache
            invalidate_cache_pattern("dossiers:*")
        return db_dossier

    @staticmethod
    def delete_dossier(db: Session, dossier_id: int) -> bool:
        db_dossier = DossierService.get_dossier(db, dossier_id)
        if db_dossier:
            db.delete(db_dossier)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("dossiers:*")
            return True
        return False
