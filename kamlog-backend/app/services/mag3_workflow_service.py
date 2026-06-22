# app/services/mag3_workflow_service.py - Service pour les workflows Mag3
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from decimal import Decimal

from app.exceptions import BusinessLogicException
from app.models.removal_slip import RemovalSlip, StatutRemovalSlip
from app.models.reception_mag3 import ReceptionMag3, StatutReceptionMag3
from app.models.user import User
from app.services.magasin_service import StockService
from app.services.notification_service import NotificationService
from app.services.reception_mag3_service import ReceptionMag3Service
from app.services.removal_slip_service import RemovalSlipService


class Mag3WorkflowService:
    """Service pour les workflows Mag3 (bon d'enlèvement → réception)"""

    @staticmethod
    def _get_user_agency_id(db: Session, username: str) -> int:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise ValueError(f"Utilisateur introuvable pour username={username}")
        return user.agency_id
    
    @staticmethod
    def create_removal_slip_workflow(db: Session, slip_data, user: str) -> RemovalSlip:
        """
        Workflow complet de création de bon d'enlèvement:
        1. Créer le bon d'enlèvement
        2. Mettre en attente d'autorisation
        3. Notifier les responsables
        """
        slip = RemovalSlipService.create_removal_slip(db, slip_data, user)

        # Notifier les responsables pour autorisation (multi-tenancy via agency_id)
        agency_id = Mag3WorkflowService._get_user_agency_id(db, user)

        responsables_stock_ids = []
        responsables_stock_ids.extend(
            NotificationService.get_users_by_role(db, "ADMIN", agency_id)
        )
        responsables_stock_ids.extend(
            NotificationService.get_users_by_role(db, "DISPATCHER", agency_id)
        )

        NotificationService.notify_bon_enlevement_authorisation(
            db=db,
            slip_id=slip.id,
            slip_numero=slip.numero_bon,
            responsables=responsables_stock_ids,
        )

        return slip
    
    @staticmethod
    def authorize_removal_slip_workflow(db: Session, slip_id: int, authorized_by: str) -> RemovalSlip:
        """
        Workflow d'autorisation de bon d'enlèvement:
        1. Vérifier que le bon existe
        2. Vérifier que le bon est en attente
        3. Autoriser le bon
        4. Mettre à jour la date d'autorisation
        5. Notifier le demandeur
        """
        slip = RemovalSlipService.get_removal_slip(db, slip_id)
        if not slip:
            raise ValueError("Bon d'enlèvement non trouvé")
        
        if slip.statut != StatutRemovalSlip.EN_ATTENTE:
            raise ValueError(f"Le bon doit être en attente pour être autorisé. Statut actuel: {slip.statut}")
        
        authorized_slip = RemovalSlipService.authorize_removal_slip(db, slip_id, authorized_by)
        
        # Notifier le demandeur
        NotificationService.notify_bon_enlevement_authorized(
            db=db,
            slip_id=slip_id,
            slip_numero=slip.numero_bon,
            demandeur=slip.demande_par
        )
        
        return authorized_slip
    
    @staticmethod
    def create_reception_from_slip_workflow(db: Session, slip_id: int, reception_data, user: str) -> ReceptionMag3:
        """
        Workflow de création de réception à partir d'un bon d'enlèvement:
        1. Vérifier que le bon d'enlèvement existe
        2. Vérifier que le bon est autorisé
        3. Créer la réception Mag3
        4. Lier la réception au bon d'enlèvement
        5. Mettre en attente de validation
        6. Notifier les magasiniers
        """
        slip = RemovalSlipService.get_removal_slip(db, slip_id)
        if not slip:
            raise ValueError("Bon d'enlèvement non trouvé")
        
        if slip.statut != StatutRemovalSlip.AUTORISE:
            raise ValueError(f"Le bon doit être autorisé pour créer une réception. Statut actuel: {slip.statut}")
        
        # Vérifier si une réception existe déjà pour ce bon
        existing_receptions = ReceptionMag3Service.get_receptions_mag3_by_removal_slip(db, slip_id)
        if existing_receptions:
            raise ValueError("Une réception existe déjà pour ce bon d'enlèvement")
        
        # Créer la réception avec les données du bon d'enlèvement
        reception_data.removal_slip_id = slip_id
        reception_data.magasin_source = slip.magasin_source
        reception_data.article_id = slip.article_id
        reception_data.quantite_attendue = slip.quantite
        reception_data.unite = slip.unite
        reception_data.declaration_douaniere = slip.declaration_douaniere
        
        reception = ReceptionMag3Service.create_reception_mag3(db, reception_data, user)

        # Notifier les magasiniers (GATE_AGENT) en tenant compte de l'agence
        agency_id = Mag3WorkflowService._get_user_agency_id(db, user)
        magasiniers_ids = NotificationService.get_users_by_role(db, "GATE_AGENT", agency_id)

        NotificationService.notify_reception_created(
            db=db,
            reception_id=reception.id,
            magasiniers=magasiniers_ids,
        )

        return reception
    
    @staticmethod
    def validate_reception_workflow(db: Session, reception_id: int, received_by: str) -> ReceptionMag3:
        """
        Workflow de validation de réception:
        1. Vérifier que la réception existe
        2. Vérifier que la réception est en attente
        3. Valider la réception
        4. Mettre à jour le stock dans le magasin de destination
        5. Mettre à jour le statut du bon d'enlèvement
        6. Notifier les parties concernées (à implémenter)
        """
        reception = ReceptionMag3Service.get_reception_mag3(db, reception_id)
        if not reception:
            raise ValueError("Réception Mag3 non trouvée")
        
        if reception.statut != StatutReceptionMag3.EN_ATTENTE:
            raise ValueError(f"La réception doit être en attente pour être validée. Statut actuel: {reception.statut}")
        
        # Vérifier que les quantités sont cohérentes
        if reception.quantite_recue <= Decimal('0'):
            raise ValueError("La quantité reçue doit être supérieure à 0")
        
        validated_reception = ReceptionMag3Service.validate_reception_mag3(db, reception_id, received_by)
        
        # ATOMICITÉ: Toutes les opérations dans une transaction unique
        try:
            with db.begin():
                # Mettre à jour le stock dans le magasin de destination
                StockService.update_stock(
                    db=db,
                    article_id=reception.article_id,
                    magasin_id=reception.magasin_destination,
                    quantite=reception.quantite_recue,
                    type_mouvement="ENTREE",
                    reference=f"Reception Mag3 #{reception_id}",
                    utilisateur=received_by
                )
                
                # Mettre à jour le statut du bon d'enlèvement
                if reception.removal_slip_id:
                    slip = RemovalSlipService.get_removal_slip(db, reception.removal_slip_id)
                    if slip and slip.statut == StatutRemovalSlip.AUTORISE:
                        from app.schemas.removal_slip import RemovalSlipUpdate
                        slip_update = RemovalSlipUpdate(statut=StatutRemovalSlip.LIVRE)
                        RemovalSlipService.update_removal_slip(db, reception.removal_slip_id, slip_update)
                
                # Notification du succès
                if reception.removal_slip_id:
                    slip = RemovalSlipService.get_removal_slip(db, reception.removal_slip_id)
                    if slip:
                        NotificationService.notify_reception_validated(
                            db=db,
                            reception_id=reception_id,
                            slip_id=reception.removal_slip_id,
                            demandeur=slip.demande_par
                        )
                
                # Notifier les responsables du stock (ADMIN + DISPATCHER)
                agency_id = Mag3WorkflowService._get_user_agency_id(db, received_by)
                responsables_stock_ids = []
                responsables_stock_ids.extend(
                    NotificationService.get_users_by_role(db, "ADMIN", agency_id)
                )
                responsables_stock_ids.extend(
                    NotificationService.get_users_by_role(db, "DISPATCHER", agency_id)
                )

                NotificationService.notify_stock_updated(
                    db=db,
                    article_id=reception.article_id,
                    magasin_id=reception.magasin_destination,
                    quantite=reception.quantite_recue,
                    responsables=responsables_stock_ids,
                )
                
        except Exception as e:
            # ROLLBACK automatique par context manager
            # Mettre le statut de la réception en erreur
            from app.schemas.reception_mag3 import ReceptionMag3Update
            reception_update = ReceptionMag3Update(statut=StatutReceptionMag3.ERREUR)
            ReceptionMag3Service.update_reception_mag3(db, reception_id, reception_update)
            
            # Notifier l'erreur
            agency_id = Mag3WorkflowService._get_user_agency_id(db, received_by)
            responsables_ids = []
            responsables_ids.extend(NotificationService.get_users_by_role(db, "ADMIN", agency_id))
            responsables_ids.extend(NotificationService.get_users_by_role(db, "DISPATCHER", agency_id))

            NotificationService.notify_workflow_error(
                db=db,
                workflow_type="validation_reception_mag3",
                error_message=str(e),
                responsables=responsables_ids,
            )
            
            # Log structuré au lieu de print
            from app.utils.logger import get_logger
            logger = get_logger(__name__)
            logger.error(f"Erreur critique dans workflow Mag3 - Reception {reception_id}: {str(e)}", exc_info=True)
            
            raise BusinessLogicException(f"Échec validation réception: {str(e)}")
        
        return validated_reception
    
    @staticmethod
    def get_workflow_status(db: Session, slip_id: int) -> dict:
        """
        Récupère le statut du workflow pour un bon d'enlèvement:
        - Statut du bon d'enlèvement
        - Existence d'une réception
        - Statut de la réception
        """
        slip = RemovalSlipService.get_removal_slip(db, slip_id)
        if not slip:
            return {"error": "Bon d'enlèvement non trouvé"}
        
        receptions = ReceptionMag3Service.get_receptions_mag3_by_removal_slip(db, slip_id)
        
        workflow_status = {
            "slip_id": slip_id,
            "slip_statut": slip.statut.value,
            "slip_autorise": slip.statut == StatutRemovalSlip.AUTORISE,
            "reception_created": len(receptions) > 0,
            "reception_statut": receptions[0].statut.value if receptions else None,
            "reception_validee": receptions[0].statut == StatutReceptionMag3.COMPLETEE if receptions else False,
            "workflow_complete": False
        }
        
        # Le workflow est complet si le bon est autorisé et la réception est validée
        if workflow_status["slip_autorise"] and workflow_status["reception_validee"]:
            workflow_status["workflow_complete"] = True
        
        return workflow_status
    
    @staticmethod
    def get_pending_workflows(db: Session) -> list:
        """
        Récupère les workflows en attente:
        - Bons d'enlèvement en attente d'autorisation
        - Réceptions en attente de validation
        """
        pending_slips = RemovalSlipService.get_all_removal_slips(db, 0, 100)
        pending_slips = [s for s in pending_slips if s.statut == StatutRemovalSlip.EN_ATTENTE]
        
        pending_receptions = ReceptionMag3Service.get_all_receptions_mag3(db, 0, 100)
        pending_receptions = [r for r in pending_receptions if r.statut == StatutReceptionMag3.EN_ATTENTE]
        
        return {
            "pending_authorizations": len(pending_slips),
            "pending_validations": len(pending_receptions),
            "pending_slips": pending_slips,
            "pending_receptions": pending_receptions
        }
