# app/services/notification_service.py - Service de notifications
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from enum import Enum


class TypeNotification(Enum):
    """Types de notifications"""
    AUTORISATION_BON_ENLEVEMENT = "AUTORISATION_BON_ENLEVEMENT"
    BON_ENLEVEMENT_AUTORISE = "BON_ENLEMENT_AUTORISE"
    RECEPTION_CREEE = "RECEPTION_CREEE"
    RECEPTION_VALIDEE = "RECEPTION_VALIDEE"
    STOCK_MIS_A_JOUR = "STOCK_MIS_A_JOUR"
    ERREUR_WORKFLOW = "ERREUR_WORKFLOW"


class PrioriteNotification(Enum):
    """Priorités de notifications"""
    BASSE = "BASSE"
    NORMALE = "NORMALE"
    HAUTE = "HAUTE"
    CRITIQUE = "CRITIQUE"


class NotificationService:
    """Service pour gérer les notifications"""
    
    @staticmethod
    def create_notification(
        db: Session,
        type_notification: TypeNotification,
        titre: str,
        message: str,
        destinataires: List[str],
        priorite: PrioriteNotification = PrioriteNotification.NORMALE,
        reference_id: Optional[int] = None,
        reference_type: Optional[str] = None
    ) -> dict:
        """
        Crée une notification
        
        Args:
            db: Session de base de données
            type_notification: Type de notification
            titre: Titre de la notification
            message: Message de la notification
            destinataires: Liste des destinataires (emails ou usernames)
            priorite: Priorité de la notification
            reference_id: ID de l'objet référence
            reference_type: Type de l'objet référence
        
        Returns:
            dict: Notification créée
        """
        notification = {
            "id": None,  # Sera assigné par la base de données
            "type": type_notification.value,
            "titre": titre,
            "message": message,
            "destinataires": destinataires,
            "priorite": priorite.value,
            "reference_id": reference_id,
            "reference_type": reference_type,
            "date_creation": datetime.utcnow(),
            "lue": False
        }
        
        # TODO: Enregistrer dans la base de données
        # Pour l'instant, on retourne juste l'objet
        print(f"Notification créée: {titre} -> {destinataires}")
        
        return notification
    
    @staticmethod
    def notify_bon_enlevement_authorisation(
        db: Session,
        slip_id: int,
        slip_numero: str,
        responsables: List[str]
    ):
        """
        Notifie les responsables pour autorisation d'un bon d'enlèvement
        
        Args:
            db: Session de base de données
            slip_id: ID du bon d'enlèvement
            slip_numero: Numéro du bon d'enlèvement
            responsables: Liste des responsables à notifier
        """
        titre = "Autorisation requise - Bon d'enlèvement"
        message = f"Le bon d'enlèvement #{slip_numero} est en attente d'autorisation."
        
        NotificationService.create_notification(
            db=db,
            type_notification=TypeNotification.AUTORISATION_BON_ENLEVEMENT,
            titre=titre,
            message=message,
            destinataires=responsables,
            priorite=PrioriteNotification.HAUTE,
            reference_id=slip_id,
            reference_type="removal_slip"
        )
    
    @staticmethod
    def notify_bon_enlevement_authorized(
        db: Session,
        slip_id: int,
        slip_numero: str,
        demandeur: str
    ):
        """
        Notifie le demandeur que le bon d'enlèvement a été autorisé
        
        Args:
            db: Session de base de données
            slip_id: ID du bon d'enlèvement
            slip_numero: Numéro du bon d'enlèvement
            demandeur: Username du demandeur
        """
        titre = "Bon d'enlèvement autorisé"
        message = f"Votre bon d'enlèvement #{slip_numero} a été autorisé."
        
        NotificationService.create_notification(
            db=db,
            type_notification=TypeNotification.BON_ENLEVEMENT_AUTORISE,
            titre=titre,
            message=message,
            destinataires=[demandeur],
            priorite=PrioriteNotification.NORMALE,
            reference_id=slip_id,
            reference_type="removal_slip"
        )
    
    @staticmethod
    def notify_reception_created(
        db: Session,
        reception_id: int,
        magasiniers: List[str]
    ):
        """
        Notifie les magasiniers qu'une réception a été créée
        
        Args:
            db: Session de base de données
            reception_id: ID de la réception
            magasiniers: Liste des magasiniers à notifier
        """
        titre = "Nouvelle réception Mag3"
        message = f"Une nouvelle réception Mag3 #{reception_id} est en attente de validation."
        
        NotificationService.create_notification(
            db=db,
            type_notification=TypeNotification.RECEPTION_CREEE,
            titre=titre,
            message=message,
            destinataires=magasiniers,
            priorite=PrioriteNotification.HAUTE,
            reference_id=reception_id,
            reference_type="reception_mag3"
        )
    
    @staticmethod
    def notify_reception_validated(
        db: Session,
        reception_id: int,
        slip_id: int,
        demandeur: str
    ):
        """
        Notifie le demandeur que la réception a été validée
        
        Args:
            db: Session de base de données
            reception_id: ID de la réception
            slip_id: ID du bon d'enlèvement
            demandeur: Username du demandeur
        """
        titre = "Réception Mag3 validée"
        message = f"La réception Mag3 #{reception_id} a été validée et le stock a été mis à jour."
        
        NotificationService.create_notification(
            db=db,
            type_notification=TypeNotification.RECEPTION_VALIDEE,
            titre=titre,
            message=message,
            destinataires=[demandeur],
            priorite=PrioriteNotification.NORMALE,
            reference_id=reception_id,
            reference_type="reception_mag3"
        )
    
    @staticmethod
    def notify_stock_updated(
        db: Session,
        article_id: int,
        magasin_id: str,
        quantite: int,
        responsables: List[str]
    ):
        """
        Notifie les responsables que le stock a été mis à jour
        
        Args:
            db: Session de base de données
            article_id: ID de l'article
            magasin_id: ID du magasin
            quantite: Quantité mise à jour
            responsables: Liste des responsables à notifier
        """
        titre = "Stock mis à jour"
        message = f"Le stock de l'article #{article_id} dans le magasin {magasin_id} a été mis à jour (+{quantite})."
        
        NotificationService.create_notification(
            db=db,
            type_notification=TypeNotification.STOCK_MIS_A_JOUR,
            titre=titre,
            message=message,
            destinataires=responsables,
            priorite=PrioriteNotification.BASSE,
            reference_id=article_id,
            reference_type="article"
        )
    
    @staticmethod
    def notify_workflow_error(
        db: Session,
        workflow_type: str,
        error_message: str,
        responsables: List[str]
    ):
        """
        Notifie les responsables d'une erreur dans le workflow
        
        Args:
            db: Session de base de données
            workflow_type: Type de workflow
            error_message: Message d'erreur
            responsables: Liste des responsables à notifier
        """
        titre = "Erreur workflow"
        message = f"Erreur dans le workflow {workflow_type}: {error_message}"
        
        NotificationService.create_notification(
            db=db,
            type_notification=TypeNotification.ERREUR_WORKFLOW,
            titre=titre,
            message=message,
            destinataires=responsables,
            priorite=PrioriteNotification.CRITIQUE,
            reference_type="workflow"
        )
