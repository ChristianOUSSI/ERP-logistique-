# app/services/parc_service.py - Service métier pour le module K-Parc
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime

from app.models.parc import (
    ZoneParc, EmplacementParc, StockPhysiqueParc, MouvementParc,
    StatutEmplacement
)
from app.schemas.parc import (
    ZoneParcCreate, ZoneParcUpdate,
    EmplacementParcCreate, EmplacementParcUpdate,
    StockPhysiqueParcCreate, StockPhysiqueParcUpdate,
    GateInRequest, GateOutRequest
)
from app.utils.audit import AuditService
from app.utils.logger import get_logger
from app.utils.cache import cache_service, invalidate_cache_pattern

logger = get_logger(__name__)


class ZoneParcService:
    """Service pour la gestion des zones de parc"""

    @staticmethod
    def get_all_zones(db: Session, skip: int = 0, limit: int = 100) -> List[ZoneParc]:
        cache_key = f"parc:zones:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(ZoneParc).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_zone(db: Session, zone_id: int) -> Optional[ZoneParc]:
        cache_key = f"parc:zone:{zone_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(ZoneParc).filter(ZoneParc.id == zone_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def create_zone(db: Session, zone: ZoneParcCreate, cree_par: str) -> ZoneParc:
        db_zone = ZoneParc(**zone.dict(), cree_par=cree_par)
        db.add(db_zone)
        db.commit()
        db.refresh(db_zone)
        
        # Invalider le cache
        invalidate_cache_pattern("parc:zones:*")
        
        logger.info(f"Zone créée: {db_zone.code_zone}", extra={"zone_id": db_zone.id})
        return db_zone

    @staticmethod
    def update_zone(db: Session, zone_id: int, zone: ZoneParcUpdate) -> Optional[ZoneParc]:
        db_zone = ZoneParcService.get_zone(db, zone_id)
        if db_zone:
            for field, value in zone.dict(exclude_unset=True).items():
                setattr(db_zone, field, value)
            db.commit()
            db.refresh(db_zone)
            
            # Invalider le cache
            invalidate_cache_pattern("parc:zones:*")
        return db_zone

    @staticmethod
    def delete_zone(db: Session, zone_id: int) -> bool:
        db_zone = ZoneParcService.get_zone(db, zone_id)
        if db_zone:
            db.delete(db_zone)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("parc:zones:*")
            return True
        return False


class EmplacementParcService:
    """Service pour la gestion des emplacements de parc"""

    @staticmethod
    def get_all_emplacements(db: Session, skip: int = 0, limit: int = 100) -> List[EmplacementParc]:
        cache_key = f"parc:emplacements:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(EmplacementParc).options(
            selectinload(EmplacementParc.zone)
        ).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_emplacement(db: Session, emplacement_id: int) -> Optional[EmplacementParc]:
        cache_key = f"parc:emplacement:{emplacement_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(EmplacementParc).filter(EmplacementParc.id == emplacement_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_emplacements_by_zone(db: Session, zone_id: int) -> List[EmplacementParc]:
        cache_key = f"parc:emplacements:zone:{zone_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(EmplacementParc).filter(EmplacementParc.zone_id == zone_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_emplacements_libres(db: Session) -> List[EmplacementParc]:
        cache_key = "parc:emplacements:libres"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(EmplacementParc).filter(
            EmplacementParc.statut == StatutEmplacement.LIBRE
        ).all()
        cache_service.set(cache_key, result, expire=180)
        return result

    @staticmethod
    def create_emplacement(db: Session, emplacement: EmplacementParcCreate, cree_par: str) -> EmplacementParc:
        db_emplacement = EmplacementParc(**emplacement.dict(), cree_par=cree_par)
        db.add(db_emplacement)
        db.commit()
        db.refresh(db_emplacement)
        
        # Invalider le cache
        invalidate_cache_pattern("parc:emplacements:*")
        
        logger.info(f"Emplacement créé: {db_emplacement.code_emplacement}", extra={"emplacement_id": db_emplacement.id})
        return db_emplacement

    @staticmethod
    def update_emplacement(db: Session, emplacement_id: int, emplacement: EmplacementParcUpdate) -> Optional[EmplacementParc]:
        db_emplacement = EmplacementParcService.get_emplacement(db, emplacement_id)
        if db_emplacement:
            for field, value in emplacement.dict(exclude_unset=True).items():
                setattr(db_emplacement, field, value)
            db.commit()
            db.refresh(db_emplacement)
            
            # Invalider le cache
            invalidate_cache_pattern("parc:emplacements:*")
        return db_emplacement

    @staticmethod
    def delete_emplacement(db: Session, emplacement_id: int) -> bool:
        db_emplacement = EmplacementParcService.get_emplacement(db, emplacement_id)
        if db_emplacement:
            db.delete(db_emplacement)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("parc:emplacements:*")
            return True
        return False


class StockPhysiqueParcService:
    """Service pour la gestion du stock physique du parc"""

    @staticmethod
    def get_all_stocks(db: Session, skip: int = 0, limit: int = 100) -> List[StockPhysiqueParc]:
        cache_key = f"parc:stocks:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(StockPhysiqueParc).options(
            selectinload(StockPhysiqueParc.emplacement)
        ).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_stock(db: Session, stock_id: int) -> Optional[StockPhysiqueParc]:
        cache_key = f"parc:stock:{stock_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(StockPhysiqueParc).filter(StockPhysiqueParc.id == stock_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_stock_by_conteneur(db: Session, numero_conteneur: str) -> Optional[StockPhysiqueParc]:
        cache_key = f"parc:stock:conteneur:{numero_conteneur}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(StockPhysiqueParc).filter(
            StockPhysiqueParc.numero_conteneur == numero_conteneur,
            StockPhysiqueParc.date_gate_out.is_(None)
        ).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_stocks_actifs(db: Session) -> List[StockPhysiqueParc]:
        cache_key = "parc:stocks:actifs"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(StockPhysiqueParc).filter(
            StockPhysiqueParc.date_gate_out.is_(None)
        ).all()
        cache_service.set(cache_key, result, expire=180)
        return result

    @staticmethod
    def create_stock(db: Session, stock: StockPhysiqueParcCreate, cree_par: str) -> StockPhysiqueParc:
        db_stock = StockPhysiqueParc(**stock.dict(), cree_par=cree_par)
        db.add(db_stock)
        db.commit()
        db.refresh(db_stock)
        
        # Invalider le cache
        invalidate_cache_pattern("parc:stocks:*")
        invalidate_cache_pattern("parc:emplacements:*")
        
        logger.info(f"Stock créé: {db_stock.numero_conteneur}", extra={"stock_id": db_stock.id})
        return db_stock

    @staticmethod
    def update_stock(db: Session, stock_id: int, stock: StockPhysiqueParcUpdate) -> Optional[StockPhysiqueParc]:
        db_stock = StockPhysiqueParcService.get_stock(db, stock_id)
        if db_stock:
            for field, value in stock.dict(exclude_unset=True).items():
                setattr(db_stock, field, value)
            db.commit()
            db.refresh(db_stock)
            
            # Invalider le cache
            invalidate_cache_pattern("parc:stocks:*")
        return db_stock

    @staticmethod
    def delete_stock(db: Session, stock_id: int) -> bool:
        db_stock = StockPhysiqueParcService.get_stock(db, stock_id)
        if db_stock:
            db.delete(db_stock)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("parc:stocks:*")
            invalidate_cache_pattern("parc:emplacements:*")
            return True
        return False


class MouvementParcService:
    """Service pour la gestion des mouvements de parc"""

    @staticmethod
    def get_all_mouvements(db: Session, skip: int = 0, limit: int = 100) -> List[MouvementParc]:
        cache_key = f"parc:mouvements:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(MouvementParc).options(
            selectinload(MouvementParc.conteneur)
        ).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_mouvement(db: Session, mouvement_id: int) -> Optional[MouvementParc]:
        cache_key = f"parc:mouvement:{mouvement_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(MouvementParc).filter(MouvementParc.id == mouvement_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_mouvements_by_conteneur(db: Session, conteneur_id: int) -> List[MouvementParc]:
        cache_key = f"parc:mouvements:conteneur:{conteneur_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(MouvementParc).filter(MouvementParc.conteneur_id == conteneur_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_mouvements_by_date(db: Session, date_debut: datetime, date_fin: datetime) -> List[MouvementParc]:
        cache_key = f"parc:mouvements:date:{date_debut}:{date_fin}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(MouvementParc).filter(
            MouvementParc.date_mouvement >= date_debut,
            MouvementParc.date_mouvement <= date_fin
        ).all()
        cache_service.set(cache_key, result, expire=180)
        return result

    @staticmethod
    def create_mouvement(db: Session, mouvement: dict, operateur_id: int) -> MouvementParc:
        db_mouvement = MouvementParc(**mouvement, operateur_id=operateur_id)
        db.add(db_mouvement)
        db.commit()
        db.refresh(db_mouvement)
        
        # Invalider le cache
        invalidate_cache_pattern("parc:mouvements:*")
        
        logger.info(f"Mouvement créé: {db_mouvement.reference}", extra={"mouvement_id": db_mouvement.id})
        return db_mouvement


class GateService:
    """Service pour la gestion des Gate In/Out"""

    @staticmethod
    def process_gate_in(
        db: Session,
        data: GateInRequest,
        operateur_id: int,
    ) -> dict:
        """
        Traite l'entrée d'un conteneur (Gate In).
        Règles : emplacement doit être LIBRE.
        """
        # Vérifier que l'emplacement existe et est libre
        emplacement = EmplacementParcService.get_emplacement(db, data.emplacement_id)
        if not emplacement:
            raise ValueError("Emplacement introuvable")
        
        if emplacement.statut != StatutEmplacement.LIBRE:
            raise ValueError(f"Emplacement non libre : statut {emplacement.statut}")
        
        # Vérifier que le conteneur n'est pas déjà dans le parc
        existing_stock = StockPhysiqueParcService.get_stock_by_conteneur(db, data.numero_conteneur)
        if existing_stock:
            raise ValueError("Conteneur déjà présent dans le parc")
        
        # Créer le stock physique
        stock = StockPhysiqueParc(
            numero_conteneur=data.numero_conteneur,
            emplacement_id=data.emplacement_id,
            type_conteneur=data.type_conteneur,
            etat=data.etat,
            poids_tare_kg=data.poids_tare_kg,
            date_gate_in=datetime.utcnow(),
        )
        db.add(stock)
        db.flush()  # Pour obtenir l'ID du stock
        
        # Marquer l'emplacement comme OCCUPE
        emplacement.statut = StatutEmplacement.OCCUPE
        
        # Créer le mouvement
        mouvement = MouvementParc(
            reference=f"GIN-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            conteneur_id=stock.id,
            type_mouvement="GATE_IN",
            emplacement_dest_id=data.emplacement_id,
            date_mouvement=datetime.utcnow(),
            operateur_id=operateur_id,
        )
        db.add(mouvement)
        
        db.commit()
        db.refresh(stock)
        
        # Invalider le cache
        invalidate_cache_pattern("parc:*")
        
        # Audit trail
        AuditService.log_action(
            db=db,
            action="gate_in",
            entity_type="stock_parc",
            entity_id=stock.id,
            user_id=operateur_id,
            details={"conteneur": data.numero_conteneur, "emplacement": emplacement.code_emplacement}
        )
        
        logger.info(f"Gate In réussi: {data.numero_conteneur}", extra={"conteneur": data.numero_conteneur})
        
        return {
            "message": "Gate In réussi",
            "conteneur": stock.numero_conteneur,
            "emplacement": emplacement.code_emplacement,
        }

    @staticmethod
    def process_gate_out(
        db: Session,
        data: GateOutRequest,
        operateur_id: int,
    ) -> dict:
        """
        Traite la sortie d'un conteneur (Gate Out).
        Règles : conteneur doit être présent dans le parc.
        """
        # Trouver le conteneur
        stock = StockPhysiqueParcService.get_stock_by_conteneur(db, data.numero_conteneur)
        
        if not stock:
            raise ValueError("Conteneur non trouvé dans le parc")
        
        # Marquer la sortie
        stock.date_gate_out = datetime.utcnow()
        
        # Libérer l'emplacement
        emplacement = EmplacementParcService.get_emplacement(db, stock.emplacement_id)
        emplacement.statut = StatutEmplacement.LIBRE
        
        # Créer le mouvement
        mouvement = MouvementParc(
            reference=f"GOUT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            conteneur_id=stock.id,
            type_mouvement="GATE_OUT",
            emplacement_source_id=stock.emplacement_id,
            date_mouvement=datetime.utcnow(),
            operateur_id=operateur_id,
        )
        db.add(mouvement)
        
        db.commit()
        
        # Invalider le cache
        invalidate_cache_pattern("parc:*")
        
        # Audit trail
        AuditService.log_action(
            db=db,
            action="gate_out",
            entity_type="stock_parc",
            entity_id=stock.id,
            user_id=operateur_id,
            details={"conteneur": data.numero_conteneur, "emplacement": emplacement.code_emplacement}
        )
        
        logger.info(f"Gate Out réussi: {data.numero_conteneur}", extra={"conteneur": data.numero_conteneur})
        
        return {
            "message": "Gate Out réussi",
            "conteneur": stock.numero_conteneur,
            "emplacement": emplacement.code_emplacement,
        }
