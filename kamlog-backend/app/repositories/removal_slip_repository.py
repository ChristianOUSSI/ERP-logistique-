# app/repositories/removal_slip_repository.py - Repository pour les bons d'enlèvement
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.removal_slip import RemovalSlip, StatutRemovalSlip


class RemovalSlipRepository:
    """Repository pour les bons d'enlèvement Mag3"""
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[RemovalSlip]:
        """Récupère tous les bons d'enlèvement"""
        return db.query(RemovalSlip).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_id(db: Session, slip_id: int) -> Optional[RemovalSlip]:
        """Récupère un bon d'enlèvement par son ID"""
        return db.query(RemovalSlip).filter(RemovalSlip.id == slip_id).first()
    
    @staticmethod
    def get_by_numero(db: Session, numero: str) -> Optional[RemovalSlip]:
        """Récupère un bon d'enlèvement par son numéro"""
        return db.query(RemovalSlip).filter(RemovalSlip.numero_bon == numero).first()
    
    @staticmethod
    def get_by_statut(db: Session, statut: str) -> List[RemovalSlip]:
        """Récupère les bons d'enlèvement par statut"""
        return db.query(RemovalSlip).filter(RemovalSlip.statut == statut).all()
    
    @staticmethod
    def get_by_magasins(db: Session, magasin_source: str, magasin_destination: str) -> List[RemovalSlip]:
        """Récupère les bons d'enlèvement par magasins"""
        return db.query(RemovalSlip).filter(
            RemovalSlip.magasin_source == magasin_source,
            RemovalSlip.magasin_destination == magasin_destination
        ).all()
    
    @staticmethod
    def get_by_article(db: Session, article_id: int) -> List[RemovalSlip]:
        """Récupère les bons d'enlèvement par article"""
        return db.query(RemovalSlip).filter(RemovalSlip.article_id == article_id).all()
    
    @staticmethod
    def get_by_declaration(db: Session, declaration_douaniere: str) -> List[RemovalSlip]:
        """Récupère les bons d'enlèvement par déclaration douanière"""
        return db.query(RemovalSlip).filter(RemovalSlip.declaration_douaniere == declaration_douaniere).all()
    
    @staticmethod
    def create(db: Session, slip: RemovalSlip) -> RemovalSlip:
        """Crée un nouveau bon d'enlèvement"""
        db.add(slip)
        db.commit()
        db.refresh(slip)
        return slip
    
    @staticmethod
    def update(db: Session, slip: RemovalSlip) -> RemovalSlip:
        """Met à jour un bon d'enlèvement"""
        db.commit()
        db.refresh(slip)
        return slip
    
    @staticmethod
    def delete(db: Session, slip_id: int) -> bool:
        """Supprime un bon d'enlèvement"""
        slip = RemovalSlipRepository.get_by_id(db, slip_id)
        if not slip:
            return False
        db.delete(slip)
        db.commit()
        return True
    
    @staticmethod
    def get_pending_authorization(db: Session) -> List[RemovalSlip]:
        """Récupère les bons d'enlèvement en attente d'autorisation"""
        return db.query(RemovalSlip).filter(RemovalSlip.statut == StatutRemovalSlip.EN_ATTENTE).all()
