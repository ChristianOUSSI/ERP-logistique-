# app/services/removal_slip_service.py - Service pour les bons d'enlèvement
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.models.removal_slip import RemovalSlip, StatutRemovalSlip
from app.schemas.removal_slip import RemovalSlipCreate, RemovalSlipUpdate
import uuid


class RemovalSlipService:
    """Service pour la gestion des bons d'enlèvement Mag3"""
    
    @staticmethod
    def get_all_removal_slips(db: Session, skip: int = 0, limit: int = 100) -> List[RemovalSlip]:
        """Récupère tous les bons d'enlèvement"""
        return db.query(RemovalSlip).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_removal_slip(db: Session, slip_id: int) -> Optional[RemovalSlip]:
        """Récupère un bon d'enlèvement par son ID"""
        return db.query(RemovalSlip).filter(RemovalSlip.id == slip_id).first()
    
    @staticmethod
    def get_removal_slips_by_statut(db: Session, statut: str) -> List[RemovalSlip]:
        """Récupère les bons d'enlèvement par statut"""
        return db.query(RemovalSlip).filter(RemovalSlip.statut == statut).all()
    
    @staticmethod
    def get_removal_slips_by_magasin(db: Session, magasin_source: str, magasin_destination: str) -> List[RemovalSlip]:
        """Récupère les bons d'enlèvement par magasins"""
        return db.query(RemovalSlip).filter(
            RemovalSlip.magasin_source == magasin_source,
            RemovalSlip.magasin_destination == magasin_destination
        ).all()
    
    @staticmethod
    def create_removal_slip(db: Session, slip: RemovalSlipCreate, user: str) -> RemovalSlip:
        """Crée un nouveau bon d'enlèvement"""
        # Générer un numéro de bon unique
        numero_bon = f"BE-{uuid.uuid4().hex[:8].upper()}"
        
        db_slip = RemovalSlip(
            numero_bon=numero_bon,
            magasin_source=slip.magasin_source,
            magasin_destination=slip.magasin_destination,
            article_id=slip.article_id,
            quantite=slip.quantite,
            unite=slip.unite,
            declaration_douaniere=slip.declaration_douaniere,
            motif=slip.motif,
            observations=slip.observations,
            date_bon=slip.date_bon,
            statut=StatutRemovalSlip.EN_ATTENTE,
            cree_par=user
        )
        
        db.add(db_slip)
        db.commit()
        db.refresh(db_slip)
        return db_slip
    
    @staticmethod
    def update_removal_slip(db: Session, slip_id: int, slip: RemovalSlipUpdate) -> Optional[RemovalSlip]:
        """Met à jour un bon d'enlèvement"""
        db_slip = RemovalSlipService.get_removal_slip(db, slip_id)
        if not db_slip:
            return None
        
        update_data = slip.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_slip, field, value)
        
        db.commit()
        db.refresh(db_slip)
        return db_slip
    
    @staticmethod
    def delete_removal_slip(db: Session, slip_id: int) -> bool:
        """Supprime un bon d'enlèvement"""
        db_slip = RemovalSlipService.get_removal_slip(db, slip_id)
        if not db_slip:
            return False
        
        db.delete(db_slip)
        db.commit()
        return True
    
    @staticmethod
    def authorize_removal_slip(db: Session, slip_id: int, authorized_by: str) -> Optional[RemovalSlip]:
        """Autorise un bon d'enlèvement"""
        db_slip = RemovalSlipService.get_removal_slip(db, slip_id)
        if not db_slip:
            return None
        
        db_slip.statut = StatutRemovalSlip.AUTORISE
        db_slip.autorise_par = authorized_by
        db_slip.date_autorisation = datetime.utcnow()
        
        db.commit()
        db.refresh(db_slip)
        return db_slip
