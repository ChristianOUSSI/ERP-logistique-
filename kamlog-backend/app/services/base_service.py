# app/services/base_service.py - Service de base avec méthodes CRUD génériques
from sqlalchemy.orm import Session
from typing import Type, TypeVar, Generic, Optional, List
from pydantic import BaseModel
from datetime import datetime

from app.models.base import BaseModel as DBBaseModel

# Type générique pour les modèles de base de données
ModelType = TypeVar("ModelType", bound=DBBaseModel)
# Type générique pour les schémas Pydantic
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Service de base avec méthodes CRUD génériques.
    
    Cette classe fournit des méthodes CRUD communes qui peuvent être utilisées
    par tous les services spécifiques pour réduire la duplication de code.
    """
    
    def __init__(self, model: Type[ModelType]):
        """
        Initialise le service avec le modèle SQLAlchemy.
        
        Args:
            model: Classe du modèle SQLAlchemy
        """
        self.model = model
    
    def get(self, db: Session, id: int) -> Optional[ModelType]:
        """
        Récupère une entité par son ID.
        
        Args:
            db: Session de base de données
            id: ID de l'entité
            
        Returns:
            L'entité trouvée ou None
        """
        return db.query(self.model).filter(self.model.id == id).first()
    
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
        return db.query(self.model).offset(skip).limit(limit).all()
    
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
    
    def create(
        self, 
        db: Session, 
        obj_in: CreateSchemaType
    ) -> ModelType:
        """
        Crée une nouvelle entité.
        
        Args:
            db: Session de base de données
            obj_in: Schéma de création
            
        Returns:
            L'entité créée
        """
        obj_in_data = obj_in.dict()
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self,
        db: Session,
        db_obj: ModelType,
        obj_in: UpdateSchemaType
    ) -> ModelType:
        """
        Met à jour une entité.
        
        Args:
            db: Session de base de données
            db_obj: Entité à mettre à jour
            obj_in: Schéma de mise à jour
            
        Returns:
            L'entité mise à jour
        """
        obj_data = obj_in.dict(exclude_unset=True)
        for field, value in obj_data.items():
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
