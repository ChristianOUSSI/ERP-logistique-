# app/utils/audit.py - Service d'audit pour tracer les modifications
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.audit import AuditLog
from app.utils.logger import get_logger

logger = get_logger(__name__)


class AuditService:
    """Service pour enregistrer les traces d'audit."""
    
    @staticmethod
    def log_stock_modification(
        db: Session,
        action: str,
        article_id: int,
        magasin_id: int,
        quantite_avant: Decimal,
        quantite_apres: Decimal,
        user_id: Optional[int] = None,
        raison: str = ""
    ) -> AuditLog:
        """
        Enregistre une modification de stock dans l'audit trail.
        
        Args:
            db: Session de base de données
            action: Type d'action (reception, livraison, stock_creation, etc.)
            article_id: ID de l'article
            magasin_id: ID du magasin
            quantite_avant: Quantité avant modification
            quantite_apres: Quantité après modification
            user_id: ID de l'utilisateur (optionnel)
            raison: Raison de la modification
            
        Returns:
            AuditLog: Enregistrement d'audit créé
        """
        try:
            audit_data = {
                "user_id": user_id,
                "action": action,
                "table_name": "stocks",
                "record_id": f"{magasin_id}_{article_id}",
                "old_values": {"quantite_disponible": quantite_avant},
                "new_values": {"quantite_disponible": quantite_apres},
                "ip_address": None,  # Sera rempli par le middleware
                "user_agent": None,  # Sera rempli par le middleware
                "context": {
                    "article_id": article_id,
                    "magasin_id": magasin_id,
                    "raison": raison,
                    "delta": quantite_apres - quantite_avant
                }
            }
            
            audit_entry = AuditLog(**audit_data)
            db.add(audit_entry)
            db.commit()
            db.refresh(audit_entry)
            
            logger.info(f"Audit stock modification: {action} - Article {article_id} - Delta {quantite_apres - quantite_avant}")
            
            return audit_entry
            
        except Exception as e:
            logger.error(f"Erreur lors de l'enregistrement de l'audit: {str(e)}")
            db.rollback()
            raise
    
    @staticmethod
    def log_business_operation(
        db: Session,
        action: str,
        table_name: str,
        record_id: str,
        old_values: dict = None,
        new_values: dict = None,
        user_id: Optional[int] = None,
        context: dict = None
    ) -> AuditLog:
        """
        Enregistre une opération métier dans l'audit trail.
        
        Args:
            db: Session de base de données
            action: Type d'action (create, update, delete, etc.)
            table_name: Nom de la table
            record_id: ID de l'enregistrement
            old_values: Anciennes valeurs
            new_values: Nouvelles valeurs
            user_id: ID de l'utilisateur
            context: Contexte supplémentaire
            
        Returns:
            AuditLog: Enregistrement d'audit créé
        """
        try:
            audit_data = {
                "user_id": user_id,
                "action": action,
                "table_name": table_name,
                "record_id": record_id,
                "old_values": old_values or {},
                "new_values": new_values or {},
                "context": context or {}
            }
            
            audit_entry = AuditLog(**audit_data)
            db.add(audit_entry)
            db.commit()
            db.refresh(audit_entry)
            
            logger.info(f"Audit business operation: {action} on {table_name}({record_id})")
            
            return audit_entry
            
        except Exception as e:
            logger.error(f"Erreur lors de l'enregistrement de l'audit: {str(e)}")
            db.rollback()
            raise
    
    @staticmethod
    def get_audit_trail(
        db: Session,
        table_name: str = None,
        record_id: str = None,
        user_id: int = None,
        action: str = None,
        skip: int = 0,
        limit: int = 100
    ) -> list[AuditLog]:
        """
        Récupère l'historique d'audit selon les filtres.
        
        Args:
            db: Session de base de données
            table_name: Filtrer par table
            record_id: Filtrer par enregistrement
            user_id: Filtrer par utilisateur
            action: Filtrer par action
            skip: Nombre d'enregistrements à ignorer
            limit: Nombre maximum d'enregistrements
            
        Returns:
            list[AuditLog]: Liste des enregistrements d'audit
        """
        query = db.query(AuditLog)
        
        if table_name:
            query = query.filter(AuditLog.table_name == table_name)
        if record_id:
            query = query.filter(AuditLog.record_id == record_id)
        if user_id:
            query = query.filter(AuditLog.user_id == user_id)
        if action:
            query = query.filter(AuditLog.action == action)
        
        return query.order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()
