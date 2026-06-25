# app/services/tiers_service.py - Service métier pour le module Tiers
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import and_, or_
from typing import List, Optional
from decimal import Decimal

from app.models.tiers import Tiers, StatutTiers
from app.schemas.tiers import TiersCreate, TiersUpdate
from app.utils.audit import AuditService
from app.utils.logger import get_logger
from app.utils.cache import cache_service, invalidate_cache_pattern

logger = get_logger(__name__)


class TiersService:
    """Service pour la gestion des tiers (clients, fournisseurs, partenaires)"""

    @staticmethod
    def get_all_tiers(db: Session, skip: int = 0, limit: int = 100) -> List[Tiers]:
        cache_key = f"tiers:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Tiers).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_tiers(db: Session, tiers_id: int) -> Optional[Tiers]:
        cache_key = f"tiers:{tiers_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Tiers).filter(Tiers.id == tiers_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_tiers_by_code(db: Session, code_tiers: str) -> Optional[Tiers]:
        cache_key = f"tiers:code:{code_tiers}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Tiers).filter(Tiers.code_tiers == code_tiers).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_tiers_by_niu(db: Session, niu: str) -> Optional[Tiers]:
        cache_key = f"tiers:niu:{niu}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Tiers).filter(Tiers.niu == niu).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_tiers_actifs(db: Session) -> List[Tiers]:
        cache_key = "tiers:actifs"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Tiers).filter(Tiers.statut == StatutTiers.ACTIF).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_tiers_by_service(db: Session, service: str) -> List[Tiers]:
        """Récupère les tiers autorisés pour un service spécifique"""
        cache_key = f"tiers:service:{service}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        service_field = f"autorise_{service}"
        result = db.query(Tiers).filter(
            Tiers.statut == StatutTiers.ACTIF,
            getattr(Tiers, service_field) == True
        ).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def create_tiers(db: Session, tiers: TiersCreate, cree_par: str) -> Tiers:
        # Vérifier que le code tiers n'existe pas déjà
        existing = TiersService.get_tiers_by_code(db, tiers.code_tiers)
        if existing:
            raise ValueError(f"Code tiers {tiers.code_tiers} déjà utilisé")
        
        # Vérifier que le NIU n'existe pas déjà
        existing_niu = TiersService.get_tiers_by_niu(db, tiers.niu)
        if existing_niu:
            raise ValueError(f"NIU {tiers.niu} déjà utilisé")
        
        db_tiers = Tiers(**tiers.dict(), cree_par=cree_par)
        db.add(db_tiers)
        db.commit()
        db.refresh(db_tiers)
        
        # Invalider le cache
        invalidate_cache_pattern("tiers:*")
        
        logger.info(f"Tiers créé: {db_tiers.code_tiers}", extra={"tiers_id": db_tiers.id})
        return db_tiers

    @staticmethod
    def update_tiers(db: Session, tiers_id: int, tiers: TiersUpdate) -> Optional[Tiers]:
        db_tiers = TiersService.get_tiers(db, tiers_id)
        if db_tiers:
            for field, value in tiers.dict(exclude_unset=True).items():
                setattr(db_tiers, field, value)
            db.commit()
            db.refresh(db_tiers)
            
            # Invalider le cache
            invalidate_cache_pattern("tiers:*")
        return db_tiers

    @staticmethod
    def delete_tiers(db: Session, tiers_id: int) -> bool:
        db_tiers = TiersService.get_tiers(db, tiers_id)
        if db_tiers:
            db.delete(db_tiers)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("tiers:*")
            return True
        return False

    @staticmethod
    def activer_tiers(db: Session, tiers_id: int) -> Optional[Tiers]:
        """Active un tiers"""
        db_tiers = TiersService.get_tiers(db, tiers_id)
        if db_tiers:
            db_tiers.statut = StatutTiers.ACTIF
            db.commit()
            db.refresh(db_tiers)
            
            # Invalider le cache
            invalidate_cache_pattern("tiers:*")
        return db_tiers

    @staticmethod
    def bloquer_tiers(db: Session, tiers_id: int) -> Optional[Tiers]:
        """Bloque un tiers"""
        db_tiers = TiersService.get_tiers(db, tiers_id)
        if db_tiers:
            db_tiers.statut = StatutTiers.BLOQUE
            db.commit()
            db.refresh(db_tiers)
            
            # Invalider le cache
            invalidate_cache_pattern("tiers:*")
        return db_tiers

    @staticmethod
    def desactiver_tiers(db: Session, tiers_id: int) -> Optional[Tiers]:
        """Désactive un tiers"""
        db_tiers = TiersService.get_tiers(db, tiers_id)
        if db_tiers:
            db_tiers.statut = StatutTiers.INACTIF
            db.commit()
            db.refresh(db_tiers)
            
            # Invalider le cache
            invalidate_cache_pattern("tiers:*")
        return db_tiers

    @staticmethod
    def autoriser_service(db: Session, tiers_id: int, service: str) -> Optional[Tiers]:
        """Autorise un service pour un tiers"""
        db_tiers = TiersService.get_tiers(db, tiers_id)
        if db_tiers:
            service_field = f"autorise_{service}"
            setattr(db_tiers, service_field, True)
            db.commit()
            db.refresh(db_tiers)
            
            # Invalider le cache
            invalidate_cache_pattern("tiers:*")
        return db_tiers

    @staticmethod
    def revoquer_service(db: Session, tiers_id: int, service: str) -> Optional[Tiers]:
        """Révoque un service pour un tiers"""
        db_tiers = TiersService.get_tiers(db, tiers_id)
        if db_tiers:
            service_field = f"autorise_{service}"
            setattr(db_tiers, service_field, False)
            db.commit()
            db.refresh(db_tiers)
            
            # Invalider le cache
            invalidate_cache_pattern("tiers:*")
        return db_tiers

    @staticmethod
    def mettre_a_jour_limite_credit(db: Session, tiers_id: int, nouvelle_limite: Decimal) -> Optional[Tiers]:
        """Met à jour la limite de crédit d'un tiers"""
        db_tiers = TiersService.get_tiers(db, tiers_id)
        if db_tiers:
            db_tiers.limite_credit_xaf = nouvelle_limite
            db.commit()
            db.refresh(db_tiers)
            
            # Invalider le cache
            invalidate_cache_pattern("tiers:*")
        return db_tiers

    @staticmethod
    def rechercher_tiers(db: Session, terme: str) -> List[Tiers]:
        """Recherche des tiers par terme (raison sociale, code, NIU, email)"""
        cache_key = f"tiers:search:{terme}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Tiers).filter(
            or_(
                Tiers.raison_sociale.ilike(f"%{terme}%"),
                Tiers.code_tiers.ilike(f"%{terme}%"),
                Tiers.niu.ilike(f"%{terme}%"),
                Tiers.email.ilike(f"%{terme}%"),
                Tiers.telephone.ilike(f"%{terme}%"),
            )
        ).all()
        cache_service.set(cache_key, result, expire=180)
        return result
