# app/services/notification_service.py - Service de notifications (WORLD-PRO)
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.notification import Notification, TypeNotification, PrioriteNotification, StatutNotification
from app.models.user import User
from app.utils.logger import get_logger
from app.exceptions import NotFoundException, ValidationException
from decimal import Decimal

logger = get_logger(__name__)


class NotificationService:
    """Service pour gérer les notifications (WORLD-PRO avec persistance)"""
    
    @staticmethod
    def create_notification(
        db: Session,
        type_notification: TypeNotification,
        titre: str,
        message: str,
        destinataire_id: int,
        agency_id: int,
        priorite: PrioriteNotification = PrioriteNotification.NORMALE,
        reference_id: Optional[int] = None,
        reference_type: Optional[str] = None,
        contexte: Optional[Dict[str, Any]] = None,
        expediteur_id: Optional[int] = None
    ) -> Notification:
        """
        Crée et persiste une notification en base de données.
        
        Args:
            db: Session de base de données
            type_notification: Type de notification
            titre: Titre de la notification
            message: Message de la notification
            destinataire_id: ID du destinataire
            agency_id: ID de l'agence (multi-tenancy)
            priorite: Priorité de la notification
            reference_id: ID de l'objet référence
            reference_type: Type de l'objet référence
            contexte: Données contextuelles
            expediteur_id: ID de l'expéditeur (optionnel)
        
        Returns:
            Notification: Notification créée
        """
        try:
            # Vérifier que le destinataire existe
            destinataire = db.query(User).filter(User.id == destinataire_id).first()
            if not destinataire:
                raise NotFoundException(f"Destinataire {destinataire_id} non trouvé")
            
            # Créer la notification
            notification = Notification(
                type_notification=type_notification,
                titre=titre,
                message=message,
                destinataire_id=destinataire_id,
                agency_id=agency_id,
                priorite=priorite,
                reference_id=reference_id,
                reference_type=reference_type,
                contexte=contexte or {},
                expediteur_id=expediteur_id,
                statut=StatutNotification.NON_LUE
            )
            
            db.add(notification)
            db.commit()
            db.refresh(notification)
            
            # Log structuré avec toutes les informations
            logger.info(
                f"Notification créée et persistée: {titre}",
                extra={
                    "notification_id": notification.id,
                    "type": type_notification.value,
                    "destinataire_id": destinataire_id,
                    "agency_id": agency_id,
                    "priorite": priorite.value,
                    "reference_id": reference_id,
                    "reference_type": reference_type
                }
            )
            
            return notification
            
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur lors de la création de notification: {str(e)}", exc_info=True)
            raise ValidationException(f"Impossible de créer la notification: {str(e)}")
    
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
    
    @staticmethod
    def get_notifications_by_user(
        db: Session,
        destinataire_id: int,
        agency_id: int,
        statut: Optional[StatutNotification] = None,
        type_notification: Optional[TypeNotification] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Notification]:
        """
        Récupère les notifications d'un utilisateur.
        
        Args:
            db: Session de base de données
            destinataire_id: ID du destinataire
            agency_id: ID de l'agence
            statut: Filtrer par statut (optionnel)
            type_notification: Filtrer par type (optionnel)
            skip: Nombre d'enregistrements à ignorer
            limit: Nombre maximum d'enregistrements
            
        Returns:
            List[Notification]: Liste des notifications
        """
        query = db.query(Notification).filter(
            Notification.destinataire_id == destinataire_id,
            Notification.agency_id == agency_id
        )
        
        if statut:
            query = query.filter(Notification.statut == statut)
        if type_notification:
            query = query.filter(Notification.type_notification == type_notification)
        
        return query.order_by(Notification.date_creation.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def mark_as_read(db: Session, notification_id: int, destinataire_id: int) -> Optional[Notification]:
        """
        Marque une notification comme lue.
        
        Args:
            db: Session de base de données
            notification_id: ID de la notification
            destinataire_id: ID du destinataire (sécurité)
            
        Returns:
            Notification: Notification mise à jour
        """
        notification = db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.destinataire_id == destinataire_id
        ).first()
        
        if not notification:
            raise NotFoundException("Notification non trouvée")
        
        notification.statut = StatutNotification.LUE
        notification.date_lecture = datetime.utcnow()
        
        db.commit()
        db.refresh(notification)
        
        logger.info(f"Notification {notification_id} marquée comme lue par {destinataire_id}")
        
        return notification
    
    @staticmethod
    def mark_all_as_read(db: Session, destinataire_id: int, agency_id: int) -> int:
        """
        Marque toutes les notifications non lues d'un utilisateur comme lues.
        
        Args:
            db: Session de base de données
            destinataire_id: ID du destinataire
            agency_id: ID de l'agence
            
        Returns:
            int: Nombre de notifications mises à jour
        """
        count = db.query(Notification).filter(
            Notification.destinataire_id == destinataire_id,
            Notification.agency_id == agency_id,
            Notification.statut == StatutNotification.NON_LUE
        ).update({
            "statut": StatutNotification.LUE,
            "date_lecture": datetime.utcnow()
        })
        
        db.commit()
        
        logger.info(f"{count} notifications marquées comme lues pour l'utilisateur {destinataire_id}")
        
        return count
    
    @staticmethod
    def delete_read_notifications(db: Session, destinataire_id: int, agency_id: int) -> int:
        """
        Supprime les notifications lues d'un utilisateur.
        
        Args:
            db: Session de base de données
            destinataire_id: ID du destinataire
            agency_id: ID de l'agence
            
        Returns:
            int: Nombre de notifications supprimées
        """
        count = db.query(Notification).filter(
            Notification.destinataire_id == destinataire_id,
            Notification.agency_id == agency_id,
            Notification.statut == StatutNotification.LUE
        ).delete()
        
        db.commit()
        
        logger.info(f"{count} notifications lues supprimées pour l'utilisateur {destinataire_id}")
        
        return count
    
    @staticmethod
    def get_unread_count(db: Session, destinataire_id: int, agency_id: int) -> int:
        """
        Compte les notifications non lues d'un utilisateur.
        
        Args:
            db: Session de base de données
            destinataire_id: ID du destinataire
            agency_id: ID de l'agence
            
        Returns:
            int: Nombre de notifications non lues
        """
        return db.query(Notification).filter(
            Notification.destinataire_id == destinataire_id,
            Notification.agency_id == agency_id,
            Notification.statut == StatutNotification.NON_LUE
        ).count()
    
    # =================== MÉTHODES MÉTIER AVEC PERSISTANCE ===================
    
    @staticmethod
    def get_users_by_role(db: Session, role: str, agency_id: int) -> List[int]:
        """
        Récupère les IDs des utilisateurs par rôle dans une agence.
        
        Args:
            db: Session de base de données
            role: Rôle recherché
            agency_id: ID de l'agence
            
        Returns:
            List[int]: Liste des IDs utilisateurs
        """
        users = db.query(User).filter(
            User.role == role,
            User.agency_id == agency_id,
            User.is_active == True
        ).all()
        
        return [user.id for user in users]
    
    @staticmethod
    def notify_bon_enlevement_authorisation(
        db: Session,
        slip_id: int,
        slip_numero: str,
        agency_id: int,
        demandeur_id: int
    ):
        """
        Notifie les responsables pour autorisation d'un bon d'enlèvement (WORLD-PRO).
        
        Args:
            db: Session de base de données
            slip_id: ID du bon d'enlèvement
            slip_numero: Numéro du bon d'enlèvement
            agency_id: ID de l'agence
            demandeur_id: ID du demandeur
        """
        titre = "Autorisation requise - Bon d'enlèvement"
        message = f"Le bon d'enlèvement #{slip_numero} est en attente d'autorisation."
        
        # Récupérer les responsables par rôle
        responsables_ids = NotificationService.get_users_by_role(db, "ADMIN", agency_id)
        responsables_ids.extend(NotificationService.get_users_by_role(db, "DISPATCHER", agency_id))
        
        # Créer une notification pour chaque responsable
        for responsable_id in responsables_ids:
            NotificationService.create_notification(
                db=db,
                type_notification=TypeNotification.AUTORISATION_BON_ENLEVEMENT,
                titre=titre,
                message=message,
                destinataire_id=responsable_id,
                agency_id=agency_id,
                priorite=PrioriteNotification.HAUTE,
                reference_id=slip_id,
                reference_type="removal_slip",
                contexte={
                    "slip_numero": slip_numero,
                    "demandeur_id": demandeur_id,
                    "action_requise": "autorisation"
                }
            )
    
    @staticmethod
    def notify_bon_enlevement_authorized(
        db: Session,
        slip_id: int,
        slip_numero: str,
        demandeur_id: int,
        agency_id: int,
        autorise_par_id: int
    ):
        """
        Notifie le demandeur que le bon d'enlèvement a été autorisé (WORLD-PRO).
        
        Args:
            db: Session de base de données
            slip_id: ID du bon d'enlèvement
            slip_numero: Numéro du bon d'enlèvement
            demandeur_id: ID du demandeur
            agency_id: ID de l'agence
            autorise_par_id: ID de celui qui a autorisé
        """
        titre = "Bon d'enlèvement autorisé"
        message = f"Votre bon d'enlèvement #{slip_numero} a été autorisé et peut maintenant être traité."
        
        NotificationService.create_notification(
            db=db,
            type_notification=TypeNotification.BON_ENLEVEMENT_AUTORISE,
            titre=titre,
            message=message,
            destinataire_id=demandeur_id,
            agency_id=agency_id,
            priorite=PrioriteNotification.NORMALE,
            reference_id=slip_id,
            reference_type="removal_slip",
            contexte={
                "slip_numero": slip_numero,
                "autorise_par_id": autorise_par_id,
                "prochaine_etape": "creation_reception"
            },
            expediteur_id=autorise_par_id
        )
    
    @staticmethod
    def notify_reception_created(
        db: Session,
        reception_id: int,
        agency_id: int,
        cree_par_id: int
    ):
        """
        Notifie les magasiniers qu'une réception a été créée (WORLD-PRO).
        
        Args:
            db: Session de base de données
            reception_id: ID de la réception
            agency_id: ID de l'agence
            cree_par_id: ID de celui qui a créé la réception
        """
        titre = "Nouvelle réception Mag3"
        message = f"Une nouvelle réception Mag3 #{reception_id} est en attente de validation."
        
        # Récupérer les magasiniers
        magasiniers_ids = NotificationService.get_users_by_role(db, "GATE_AGENT", agency_id)
        
        for magasinier_id in magasiniers_ids:
            NotificationService.create_notification(
                db=db,
                type_notification=TypeNotification.RECEPTION_CREEE,
                titre=titre,
                message=message,
                destinataire_id=magasinier_id,
                agency_id=agency_id,
                priorite=PrioriteNotification.HAUTE,
                reference_id=reception_id,
                reference_type="reception_mag3",
                contexte={
                    "reception_id": reception_id,
                    "cree_par_id": cree_par_id,
                    "action_requise": "validation_reception"
                },
                expediteur_id=cree_par_id
            )
    
    @staticmethod
    def notify_reception_validated(
        db: Session,
        reception_id: int,
        slip_id: int,
        demandeur_id: int,
        agency_id: int,
        valide_par_id: int
    ):
        """
        Notifie le demandeur que la réception a été validée (WORLD-PRO).
        
        Args:
            db: Session de base de données
            reception_id: ID de la réception
            slip_id: ID du bon d'enlèvement
            demandeur_id: ID du demandeur
            agency_id: ID de l'agence
            valide_par_id: ID de celui qui a validé
        """
        titre = "Réception Mag3 validée"
        message = f"La réception Mag3 #{reception_id} a été validée et le stock a été mis à jour."
        
        NotificationService.create_notification(
            db=db,
            type_notification=TypeNotification.RECEPTION_VALIDEE,
            titre=titre,
            message=message,
            destinataire_id=demandeur_id,
            agency_id=agency_id,
            priorite=PrioriteNotification.NORMALE,
            reference_id=reception_id,
            reference_type="reception_mag3",
            contexte={
                "reception_id": reception_id,
                "slip_id": slip_id,
                "valide_par_id": valide_par_id,
                "workflow_status": "complete"
            },
            expediteur_id=valide_par_id
        )
    
    @staticmethod
    def notify_stock_updated(
        db: Session,
        article_id: int,
        magasin_id: str,
        quantite: Decimal,
        agency_id: int,
        mis_a_jour_par_id: int
    ):
        """
        Notifie les responsables que le stock a été mis à jour (WORLD-PRO).
        
        Args:
            db: Session de base de données
            article_id: ID de l'article
            magasin_id: ID du magasin
            quantite: Quantité mise à jour
            agency_id: ID de l'agence
            mis_a_jour_par_id: ID de celui qui a mis à jour
        """
        titre = "Stock mis à jour"
        message = f"Le stock de l'article #{article_id} dans le magasin {magasin_id} a été mis à jour (+{quantite})."
        
        # Récupérer les responsables du stock
        responsables_ids = NotificationService.get_users_by_role(db, "ADMIN", agency_id)
        responsables_ids.extend(NotificationService.get_users_by_role(db, "DISPATCHER", agency_id))
        
        for responsable_id in responsables_ids:
            NotificationService.create_notification(
                db=db,
                type_notification=TypeNotification.STOCK_MIS_A_JOUR,
                titre=titre,
                message=message,
                destinataire_id=responsable_id,
                agency_id=agency_id,
                priorite=PrioriteNotification.BASSE,
                reference_id=article_id,
                reference_type="article",
                contexte={
                    "article_id": article_id,
                    "magasin_id": magasin_id,
                    "quantite_delta": str(quantite),
                    "mis_a_jour_par_id": mis_a_jour_par_id
                },
                expediteur_id=mis_a_jour_par_id
            )
    
    @staticmethod
    def notify_workflow_error(
        db: Session,
        workflow_type: str,
        error_message: str,
        agency_id: int,
        contexte_erreur: Optional[Dict[str, Any]] = None
    ):
        """
        Notifie les responsables d'une erreur dans le workflow (WORLD-PRO).
        
        Args:
            db: Session de base de données
            workflow_type: Type de workflow
            error_message: Message d'erreur
            agency_id: ID de l'agence
            contexte_erreur: Contexte supplémentaire de l'erreur
        """
        titre = "Erreur workflow critique"
        message = f"Erreur dans le workflow {workflow_type}: {error_message}"
        
        # Récupérer tous les admins
        admins_ids = NotificationService.get_users_by_role(db, "ADMIN", agency_id)
        
        for admin_id in admins_ids:
            NotificationService.create_notification(
                db=db,
                type_notification=TypeNotification.ERREUR_WORKFLOW,
                titre=titre,
                message=message,
                destinataire_id=admin_id,
                agency_id=agency_id,
                priorite=PrioriteNotification.CRITIQUE,
                reference_type="workflow_error",
                contexte={
                    "workflow_type": workflow_type,
                    "error_message": error_message,
                    "timestamp": datetime.utcnow().isoformat(),
                    "contexte_erreur": contexte_erreur or {}
                }
            )
