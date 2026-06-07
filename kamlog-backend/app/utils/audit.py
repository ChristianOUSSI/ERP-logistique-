# app/utils/audit.py - Système d'audit trail KAMLOG EM-ERP
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional, Dict, Any
from app.models.audit import AuditLog
from app.models.user import User


class AuditService:
    """Service pour enregistrer les événements d'audit."""
    
    @staticmethod
    def log_event(
        db: Session,
        action: str,
        entity_type: str,
        entity_id: Optional[int],
        user_id: Optional[int],
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        """
        Enregistre un événement d'audit.
        
        Args:
            db: Session de base de données
            action: Type d'action (create, update, delete, etc.)
            entity_type: Type d'entité (Article, Stock, Commande, etc.)
            entity_id: ID de l'entité concernée
            user_id: ID de l'utilisateur qui a effectué l'action
            details: Détails supplémentaires de l'action
            ip_address: Adresse IP de l'utilisateur
            
        Returns:
            AuditLog: L'entrée d'audit créée
        """
        audit_log = AuditLog(
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            user_id=user_id,
            details=details,
            ip_address=ip_address,
            timestamp=datetime.utcnow()
        )
        db.add(audit_log)
        db.commit()
        db.refresh(audit_log)
        return audit_log
    
    @staticmethod
    def log_stock_modification(
        db: Session,
        action: str,
        article_id: int,
        magasin_id: int,
        quantite_avant: float,
        quantite_apres: float,
        user_id: Optional[int],
        raison: Optional[str] = None
    ) -> AuditLog:
        """
        Enregistre une modification de stock.
        
        Args:
            db: Session de base de données
            action: Type d'action (reception, livraison, ajustement)
            article_id: ID de l'article
            magasin_id: ID du magasin
            quantite_avant: Quantité avant modification
            quantite_apres: Quantité après modification
            user_id: ID de l'utilisateur
            raison: Raison de la modification
            
        Returns:
            AuditLog: L'entrée d'audit créée
        """
        details = {
            "article_id": article_id,
            "magasin_id": magasin_id,
            "quantite_avant": quantite_avant,
            "quantite_apres": quantite_apres,
            "difference": quantite_apres - quantite_avant,
            "raison": raison
        }
        
        return AuditService.log_event(
            db=db,
            action=action,
            entity_type="Stock",
            entity_id=None,  # Stock n'a pas d'ID unique simple
            user_id=user_id,
            details=details
        )
    
    @staticmethod
    def log_commande_status_change(
        db: Session,
        commande_id: int,
        statut_avant: str,
        statut_apres: str,
        user_id: Optional[int]
    ) -> AuditLog:
        """
        Enregistre un changement de statut de commande.
        
        Args:
            db: Session de base de données
            commande_id: ID de la commande
            statut_avant: Statut avant
            statut_apres: Statut après
            user_id: ID de l'utilisateur
            
        Returns:
            AuditLog: L'entrée d'audit créée
        """
        details = {
            "commande_id": commande_id,
            "statut_avant": statut_avant,
            "statut_apres": statut_apres
        }
        
        return AuditService.log_event(
            db=db,
            action="status_change",
            entity_type="Commande",
            entity_id=commande_id,
            user_id=user_id,
            details=details
        )
    
    @staticmethod
    def get_audit_logs(
        db: Session,
        entity_type: Optional[str] = None,
        entity_id: Optional[int] = None,
        user_id: Optional[int] = None,
        limit: int = 100
    ) -> list[AuditLog]:
        """
        Récupère les logs d'audit avec filtres.
        
        Args:
            db: Session de base de données
            entity_type: Filtrer par type d'entité
            entity_id: Filtrer par ID d'entité
            user_id: Filtrer par utilisateur
            limit: Nombre maximum de résultats
            
        Returns:
            list[AuditLog]: Liste des logs d'audit
        """
        query = db.query(AuditLog)
        
        if entity_type:
            query = query.filter(AuditLog.entity_type == entity_type)
        
        if entity_id:
            query = query.filter(AuditLog.entity_id == entity_id)
        
        if user_id:
            query = query.filter(AuditLog.user_id == user_id)
        
        return query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
