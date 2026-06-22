# app/repositories/parc_repository.py - Repository pour les modèles du K-Parc
from sqlalchemy.orm import Session
from typing import Optional, List
from sqlalchemy import and_, or_

from app.models.parc import ZoneParc, EmplacementParc, StockPhysiqueParc, StatutEmplacement
from app.repositories.base_repository import BaseRepository


class ZoneParcRepository(BaseRepository[ZoneParc]):
    """Repository pour les opérations sur les zones de parc."""
    
    def __init__(self):
        super().__init__(ZoneParc)
    
    def get_by_code(self, db: Session, code: str) -> Optional[ZoneParc]:
        """
        Récupère une zone par son code.
        
        Args:
            db: Session de base de données
            code: Code de la zone
            
        Returns:
            La zone trouvée ou None
        """
        return db.query(ZoneParc).filter(ZoneParc.code == code).first()
    
    def get_active_zones(self, db: Session) -> List[ZoneParc]:
        """
        Récupère toutes les zones actives.
        
        Args:
            db: Session de base de données
            
        Returns:
            Liste des zones actives
        """
        return db.query(ZoneParc).filter(
            and_(
                ZoneParc.est_actif == True,
                ZoneParc.deleted_at == None
            )
        ).all()
    
    def search_by_name(self, db: Session, name: str) -> List[ZoneParc]:
        """
        Recherche des zones par nom (recherche partielle).
        
        Args:
            db: Session de base de données
            name: Nom ou partie du nom à rechercher
            
        Returns:
            Liste des zones correspondantes
        """
        return db.query(ZoneParc).filter(
            and_(
                ZoneParc.nom.ilike(f"%{name}%"),
                ZoneParc.deleted_at == None
            )
        ).all()


class EmplacementParcRepository(BaseRepository[EmplacementParc]):
    """Repository pour les opérations sur les emplacements de parc."""
    
    def __init__(self):
        super().__init__(EmplacementParc)
    
    def get_by_code(self, db: Session, code: str) -> Optional[EmplacementParc]:
        """
        Récupère un emplacement par son code.
        
        Args:
            db: Session de base de données
            code: Code de l'emplacement
            
        Returns:
            L'emplacement trouvé ou None
        """
        return db.query(EmplacementParc).filter(EmplacementParc.code == code).first()
    
    def get_by_zone(self, db: Session, zone_id: int) -> List[EmplacementParc]:
        """
        Récupère tous les emplacements d'une zone.
        
        Args:
            db: Session de base de données
            zone_id: ID de la zone
            
        Returns:
            Liste des emplacements de la zone
        """
        return db.query(EmplacementParc).filter(
            and_(
                EmplacementParc.zone_id == zone_id,
                EmplacementParc.deleted_at == None
            )
        ).all()
    
    def get_by_statut(self, db: Session, statut: StatutEmplacement) -> List[EmplacementParc]:
        """
        Récupère tous les emplacements par statut.
        
        Args:
            db: Session de base de données
            statut: Statut des emplacements
            
        Returns:
            Liste des emplacements correspondants
        """
        return db.query(EmplacementParc).filter(
            and_(
                EmplacementParc.statut == statut,
                EmplacementParc.deleted_at == None
            )
        ).all()
    
    def get_available_emplacements(self, db: Session) -> List[EmplacementParc]:
        """
        Récupère tous les emplacements disponibles.
        
        Args:
            db: Session de base de données
            
        Returns:
            Liste des emplacements disponibles
        """
        return db.query(EmplacementParc).filter(
            and_(
                EmplacementParc.statut == StatutEmplacement.DISPONIBLE,
                EmplacementParc.deleted_at == None
            )
        ).all()


class StockPhysiqueParcRepository(BaseRepository[StockPhysiqueParc]):
    """Repository pour les opérations sur les stocks physiques de parc."""
    
    def __init__(self):
        super().__init__(StockPhysiqueParc)
    
    def get_by_emplacement(self, db: Session, emplacement_id: int) -> List[StockPhysiqueParc]:
        """
        Récupère tous les stocks d'un emplacement.
        
        Args:
            db: Session de base de données
            emplacement_id: ID de l'emplacement
            
        Returns:
            Liste des stocks de l'emplacement
        """
        return db.query(StockPhysiqueParc).filter(
            StockPhysiqueParc.emplacement_id == emplacement_id
        ).all()
    
    def get_by_zone(self, db: Session, zone_id: int) -> List[StockPhysiqueParc]:
        """
        Récupère tous les stocks d'une zone.
        
        Args:
            db: Session de base de données
            zone_id: ID de la zone
            
        Returns:
            Liste des stocks de la zone
        """
        return db.query(StockPhysiqueParc).join(
            EmplacementParc
        ).filter(
            EmplacementParc.zone_id == zone_id
        ).all()
