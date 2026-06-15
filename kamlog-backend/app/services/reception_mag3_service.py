# app/services/reception_mag3_service.py - Service pour les réceptions Mag3
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.reception_mag3 import ReceptionMag3, StatutReceptionMag3
from app.schemas.reception_mag3 import ReceptionMag3Create, ReceptionMag3Update
import uuid


class ReceptionMag3Service:
    """Service pour la gestion des réceptions Mag3"""
    
    @staticmethod
    def get_all_receptions_mag3(db: Session, skip: int = 0, limit: int = 100) -> List[ReceptionMag3]:
        """Récupère toutes les réceptions Mag3"""
        return db.query(ReceptionMag3).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_reception_mag3(db: Session, reception_id: int) -> Optional[ReceptionMag3]:
        """Récupère une réception Mag3 par son ID"""
        return db.query(ReceptionMag3).filter(ReceptionMag3.id == reception_id).first()
    
    @staticmethod
    def get_receptions_mag3_by_statut(db: Session, statut: str) -> List[ReceptionMag3]:
        """Récupère les réceptions Mag3 par statut"""
        return db.query(ReceptionMag3).filter(ReceptionMag3.statut == statut).all()
    
    @staticmethod
    def get_receptions_mag3_by_removal_slip(db: Session, removal_slip_id: int) -> List[ReceptionMag3]:
        """Récupère les réceptions Mag3 par bon d'enlèvement"""
        return db.query(ReceptionMag3).filter(ReceptionMag3.removal_slip_id == removal_slip_id).all()
    
    @staticmethod
    def create_reception_mag3(db: Session, reception: ReceptionMag3Create, user: str) -> ReceptionMag3:
        """Crée une nouvelle réception Mag3"""
        # Générer un numéro de réception unique
        numero_reception = f"RM3-{uuid.uuid4().hex[:8].upper()}"
        
        db_reception = ReceptionMag3(
            numero_reception=numero_reception,
            removal_slip_id=reception.removal_slip_id,
            magasin_source=reception.magasin_source,
            magasin_destination=reception.magasin_destination,
            article_id=reception.article_id,
            quantite_attendue=reception.quantite_attendue,
            quantite_recue=reception.quantite_recue,
            unite=reception.unite,
            declaration_douaniere=reception.declaration_douaniere,
            date_reception=reception.date_reception,
            observations=reception.observations,
            statut=StatutReceptionMag3.EN_ATTENTE,
            cree_par=user
        )
        
        db.add(db_reception)
        db.commit()
        db.refresh(db_reception)
        return db_reception
    
    @staticmethod
    def update_reception_mag3(db: Session, reception_id: int, reception: ReceptionMag3Update) -> Optional[ReceptionMag3]:
        """Met à jour une réception Mag3"""
        db_reception = ReceptionMag3Service.get_reception_mag3(db, reception_id)
        if not db_reception:
            return None
        
        update_data = reception.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_reception, field, value)
        
        db.commit()
        db.refresh(db_reception)
        return db_reception
    
    @staticmethod
    def delete_reception_mag3(db: Session, reception_id: int) -> bool:
        """Supprime une réception Mag3"""
        db_reception = ReceptionMag3Service.get_reception_mag3(db, reception_id)
        if not db_reception:
            return False
        
        db.delete(db_reception)
        db.commit()
        return True
    
    @staticmethod
    def validate_reception_mag3(db: Session, reception_id: int, received_by: str) -> Optional[ReceptionMag3]:
        """Valide une réception Mag3"""
        db_reception = ReceptionMag3Service.get_reception_mag3(db, reception_id)
        if not db_reception:
            return None
        
        db_reception.statut = StatutReceptionMag3.COMPLETEE
        db_reception.recu_par = received_by
        
        db.commit()
        db.refresh(db_reception)
        return db_reception
