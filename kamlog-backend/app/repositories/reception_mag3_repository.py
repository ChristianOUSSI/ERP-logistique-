# app/repositories/reception_mag3_repository.py - Repository pour les réceptions Mag3
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.reception_mag3 import ReceptionMag3, StatutReceptionMag3


class ReceptionMag3Repository:
    """Repository pour les réceptions Mag3"""
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[ReceptionMag3]:
        """Récupère toutes les réceptions Mag3"""
        return db.query(ReceptionMag3).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_id(db: Session, reception_id: int) -> Optional[ReceptionMag3]:
        """Récupère une réception Mag3 par son ID"""
        return db.query(ReceptionMag3).filter(ReceptionMag3.id == reception_id).first()
    
    @staticmethod
    def get_by_numero(db: Session, numero: str) -> Optional[ReceptionMag3]:
        """Récupère une réception Mag3 par son numéro"""
        return db.query(ReceptionMag3).filter(ReceptionMag3.numero_reception == numero).first()
    
    @staticmethod
    def get_by_statut(db: Session, statut: str) -> List[ReceptionMag3]:
        """Récupère les réceptions Mag3 par statut"""
        return db.query(ReceptionMag3).filter(ReceptionMag3.statut == statut).all()
    
    @staticmethod
    def get_by_removal_slip(db: Session, removal_slip_id: int) -> List[ReceptionMag3]:
        """Récupère les réceptions Mag3 par bon d'enlèvement"""
        return db.query(ReceptionMag3).filter(ReceptionMag3.removal_slip_id == removal_slip_id).all()
    
    @staticmethod
    def get_by_magasins(db: Session, magasin_source: str, magasin_destination: str) -> List[ReceptionMag3]:
        """Récupère les réceptions Mag3 par magasins"""
        return db.query(ReceptionMag3).filter(
            ReceptionMag3.magasin_source == magasin_source,
            ReceptionMag3.magasin_destination == magasin_destination
        ).all()
    
    @staticmethod
    def get_by_article(db: Session, article_id: int) -> List[ReceptionMag3]:
        """Récupère les réceptions Mag3 par article"""
        return db.query(ReceptionMag3).filter(ReceptionMag3.article_id == article_id).all()
    
    @staticmethod
    def get_by_declaration(db: Session, declaration_douaniere: str) -> List[ReceptionMag3]:
        """Récupère les réceptions Mag3 par déclaration douanière"""
        return db.query(ReceptionMag3).filter(ReceptionMag3.declaration_douaniere == declaration_douaniere).all()
    
    @staticmethod
    def create(db: Session, reception: ReceptionMag3) -> ReceptionMag3:
        """Crée une nouvelle réception Mag3"""
        db.add(reception)
        db.commit()
        db.refresh(reception)
        return reception
    
    @staticmethod
    def update(db: Session, reception: ReceptionMag3) -> ReceptionMag3:
        """Met à jour une réception Mag3"""
        db.commit()
        db.refresh(reception)
        return reception
    
    @staticmethod
    def delete(db: Session, reception_id: int) -> bool:
        """Supprime une réception Mag3"""
        reception = ReceptionMag3Repository.get_by_id(db, reception_id)
        if not reception:
            return False
        db.delete(reception)
        db.commit()
        return True
    
    @staticmethod
    def get_pending_validation(db: Session) -> List[ReceptionMag3]:
        """Récupère les réceptions Mag3 en attente de validation"""
        return db.query(ReceptionMag3).filter(ReceptionMag3.statut == StatutReceptionMag3.EN_ATTENTE).all()
    
    @staticmethod
    def get_by_date_range(db: Session, date_debut, date_fin) -> List[ReceptionMag3]:
        """Récupère les réceptions Mag3 par plage de dates"""
        return db.query(ReceptionMag3).filter(
            ReceptionMag3.date_reception >= date_debut,
            ReceptionMag3.date_reception <= date_fin
        ).all()
