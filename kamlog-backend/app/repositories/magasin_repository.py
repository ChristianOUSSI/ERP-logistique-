# app/repositories/magasin_repository.py - Repository pour le modèle Magasin
from sqlalchemy.orm import Session
from typing import Optional, List
from sqlalchemy import and_

from app.models.magasin import Magasin
from app.repositories.base_repository import BaseRepository


class MagasinRepository(BaseRepository[Magasin]):
    """Repository pour les opérations sur les magasins."""
    
    def __init__(self):
        super().__init__(Magasin)
    
    def get_by_code(self, db: Session, code: str) -> Optional[Magasin]:
        """
        Récupère un magasin par son code.
        
        Args:
            db: Session de base de données
            code: Code du magasin
            
        Returns:
            Le magasin trouvé ou None
        """
        return db.query(Magasin).filter(Magasin.code == code).first()
    
    def get_active_magasins(self, db: Session) -> List[Magasin]:
        """
        Récupère tous les magasins actifs.
        
        Args:
            db: Session de base de données
            
        Returns:
            Liste des magasins actifs
        """
        return db.query(Magasin).filter(
            Magasin.est_actif == True,
            Magasin.deleted_at == None
        ).all()
    
    def search_by_name(self, db: Session, name: str) -> List[Magasin]:
        """
        Recherche des magasins par nom (recherche partielle).
        
        Args:
            db: Session de base de données
            name: Nom ou partie du nom à rechercher
            
        Returns:
            Liste des magasins correspondants
        """
        return db.query(Magasin).filter(
            and_(
                Magasin.nom.ilike(f"%{name}%"),
                Magasin.deleted_at == None
            )
        ).all()
