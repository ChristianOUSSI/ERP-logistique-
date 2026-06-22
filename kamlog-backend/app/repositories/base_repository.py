# app/repositories/base_repository.py - Repository de base avec méthodes CRUD génériques
from sqlalchemy.orm import Session
from typing import Type, TypeVar, Generic, Optional, List
from sqlalchemy import select, and_, or_
from datetime import datetime

from app.models.base import BaseModel as DBBaseModel

# Type générique pour les modèles de base de données
ModelType = TypeVar("ModelType", bound=DBBaseModel)


class BaseRepository(Generic[ModelType]):
    """
    Repository de base avec méthodes CRUD génériques.
    Cette classe abstrait l'accès aux données et facilite les tests.
    """
    
    def __init__(self, model: Type[ModelType], agency_id: Optional[int] = None):
        """
        Initialise le repository avec le modèle SQLAlchemy.
        
        Args:
            model: Classe du modèle SQLAlchemy
            agency_id: ID de l'agence pour le filtrage automatique
        """
        self.model = model
        self.agency_id = agency_id
    
    def get(self, db: Session, id: int) -> Optional[ModelType]:
        """
        Récupère une entité par son ID.
        
        Args:
            db: Session de base de données
            id: ID de l'entité
            
        Returns:
            L'entité trouvée ou None
        """
        query = db.query(self.model).filter(self.model.id == id, self.model.deleted_at == None)
        
        # Filtrage automatique par agence si spécifié
        if self.agency_id and hasattr(self.model, "agency_id"):
            query = query.filter(self.model.agency_id == self.agency_id)
            
        return query.first()
    
    def get_all(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[ModelType]:
        """
        Récupère toutes les entités avec pagination.
        
        Args:
            db: Session de base de données
            skip: Nombre d'entrées à sauter
            limit: Nombre maximum d'entrées à retourner
            
        Returns:
            Liste des entités
        """
        query = db.query(self.model).filter(self.model.deleted_at == None)
        
        if self.agency_id and hasattr(self.model, "agency_id"):
            query = query.filter(self.model.agency_id == self.agency_id)
            
        return query.offset(skip).limit(limit).all()
    
    def get_active(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[ModelType]:
        """
        Récupère les entités actives (non supprimées) avec pagination.
        
        Args:
            db: Session de base de données
            skip: Nombre d'entrées à sauter
            limit: Nombre maximum d'entrées à retourner
            
        Returns:
            Liste des entités actives
        """
        return db.query(self.model).filter(
            self.model.deleted_at == None
        ).offset(skip).limit(limit).all()
    
    def create(self, db: Session, obj_in: dict) -> ModelType:
        """
        Crée une nouvelle entité.
        
        Args:
            db: Session de base de données
            obj_in: Dictionnaire avec les données de l'entité
            
        Returns:
            L'entité créée
        """
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self,
        db: Session,
        db_obj: ModelType,
        obj_in: dict
    ) -> ModelType:
        """
        Met à jour une entité.
        
        Args:
            db: Session de base de données
            db_obj: Entité à mettre à jour
            obj_in: Dictionnaire avec les données à mettre à jour
            
        Returns:
            L'entité mise à jour
        """
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def delete(self, db: Session, id: int) -> Optional[ModelType]:
        """
        Supprime (désactive) une entité par soft delete.
        
        Args:
            db: Session de base de données
            id: ID de l'entité à supprimer
            
        Returns:
            L'entité supprimée ou None
        """
        obj = self.get(db, id)
        if obj:
            obj.deleted_at = datetime.utcnow()
            db.commit()
            db.refresh(obj)
        return obj
    
    def count(self, db: Session) -> int:
        """
        Compte le nombre total d'entités.
        
        Args:
            db: Session de base de données
            
        Returns:
            Nombre d'entités
        """
        return db.query(self.model).count()
    
    def count_active(self, db: Session) -> int:
        """
        Compte le nombre d'entités actives.
        
        Args:
            db: Session de base de données
            
        Returns:
            Nombre d'entités actives
        """
        return db.query(self.model).filter(
            self.model.deleted_at == None
        ).count()
    
    def find_by(
        self,
        db: Session,
        filters: dict,
        skip: int = 0,
        limit: int = 100
    ) -> List[ModelType]:
        """
        Recherche des entités par filtres.
        
        Args:
            db: Session de base de données
            filters: Dictionnaire de filtres {champ: valeur}
            skip: Nombre d'entrées à sauter
            limit: Nombre maximum d'entrées à retourner
            
        Returns:
            Liste des entités correspondant aux filtres
        """
        query = db.query(self.model)
        for field, value in filters.items():
            if hasattr(self.model, field):
                query = query.filter(getattr(self.model, field) == value)
        return query.offset(skip).limit(limit).all()
