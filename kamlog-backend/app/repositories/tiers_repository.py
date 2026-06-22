# app/repositories/tiers_repository.py - Repository pour le modèle Tiers
from sqlalchemy.orm import Session
from typing import Optional, List
from sqlalchemy import and_, or_

from app.models.tiers import Tiers, StatutTiers
from app.repositories.base_repository import BaseRepository


class TiersRepository(BaseRepository[Tiers]):
    """Repository pour les opérations sur les tiers."""
    
    def __init__(self):
        super().__init__(Tiers)
    
    def get_by_code(self, db: Session, code_tiers: str) -> Optional[Tiers]:
        """
        Récupère un tiers par son code.
        
        Args:
            db: Session de base de données
            code_tiers: Code du tiers
            
        Returns:
            Le tiers trouvé ou None
        """
        return db.query(Tiers).filter(Tiers.code_tiers == code_tiers).first()
    
    def get_by_statut(self, db: Session, statut: StatutTiers) -> List[Tiers]:
        """
        Récupère tous les tiers par statut.
        
        Args:
            db: Session de base de données
            statut: Statut des tiers
            
        Returns:
            Liste des tiers correspondants
        """
        return db.query(Tiers).filter(
            and_(
                Tiers.statut == statut,
                Tiers.deleted_at == None
            )
        ).all()
    
    def search_by_name(self, db: Session, name: str) -> List[Tiers]:
        """
        Recherche des tiers par nom ou raison sociale (recherche partielle).
        
        Args:
            db: Session de base de données
            name: Nom ou partie du nom à rechercher
            
        Returns:
            Liste des tiers correspondants
        """
        return db.query(Tiers).filter(
            and_(
                or_(
                    Tiers.nom.ilike(f"%{name}%"),
                    Tiers.raison_sociale.ilike(f"%{name}%")
                ),
                Tiers.deleted_at == None
            )
        ).all()
    
    def search_by_email(self, db: Session, email: str) -> Optional[Tiers]:
        """
        Recherche un tiers par email.
        
        Args:
            db: Session de base de données
            email: Email du tiers
            
        Returns:
            Le tiers trouvé ou None
        """
        return db.query(Tiers).filter(
            and_(
                Tiers.email == email,
                Tiers.deleted_at == None
            )
        ).first()
