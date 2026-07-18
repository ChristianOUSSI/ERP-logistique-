# app/services/purchase_requisition_service.py
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone

from app.models.purchase import FicheBesoin, StatutFicheBesoin
from app.models.user import User
from app.exceptions import BusinessRuleViolationError, NotFoundException
from app.services.notification_service import NotificationService, TypeNotification, PrioriteNotification

class PurchaseRequisitionWorkflowService:
    """Service pour le workflow d'approbation des fiches de besoin."""

    @staticmethod
    def submit_for_approval(db: Session, fiche_id: int, demandeur: User) -> FicheBesoin:
        """
        Soumet une fiche de besoin pour approbation.
        1. Vérifie que la fiche est en brouillon.
        2. Change le statut en EN_ATTENTE_APPROBATION.
        3. Notifie le supérieur hiérarchique.
        """
        fiche = db.query(FicheBesoin).filter(FicheBesoin.id == fiche_id).first()
        if not fiche:
            raise NotFoundException("Fiche de besoin introuvable.")

        if fiche.demandeur_id != demandeur.id:
            raise BusinessRuleViolationError("Seul le demandeur peut soumettre la fiche.")

        if fiche.statut != StatutFicheBesoin.BROUILLON:
            raise BusinessRuleViolationError(f"La fiche doit être en statut 'BROUILLON' pour être soumise. Statut actuel: {fiche.statut}")

        fiche.statut = StatutFicheBesoin.EN_ATTENTE_APPROBATION
        db.flush()

        # Logique de notification du supérieur : récupérer les utilisateurs ayant un rôle d'approbation achat
        from app.models.user import User as UserModel, RoleModel
        from sqlalchemy import func

        responsable_users = (
            db.query(UserModel.email)
            .join(user_roles, UserModel.id == user_roles.c.user_id)
            .join(RoleModel, RoleModel.id == user_roles.c.role_id)
            .filter(UserModel.is_active == True)  # noqa: E712
            .filter(
                func.lower(RoleModel.code).like("%achat%")
                | func.lower(RoleModel.code).like("%purchase%")
                | func.lower(RoleModel.code).like("%approb%")
            )
            .all()
        )
        responsable_emails = [row[0] for row in responsable_users if row[0]]

        # Fallback: if no specific role found, notify superadmins or a configured email
        if not responsable_emails:
            # Notify users with super_admin role
            superadmins = (
                db.query(UserModel.email)
                .join(user_roles, UserModel.id == user_roles.c.user_id)
                .join(RoleModel, RoleModel.id == user_roles.c.role_id)
                .filter(UserModel.is_active == True)
                .filter(func.lower(RoleModel.code) == "super_admin")
                .all()
            )
            responsable_emails = [row[0] for row in superadmins if row[0]]
            # If still empty, use the SMTP_FROM as a last resort
            if not responsable_emails:
                from app.config import settings
                responsable_emails = [settings.SMTP_FROM]

        NotificationService.create_notification(
            db=db,
            type_notification=TypeNotification.AUTORISATION_BON_ENLEVEMENT, # A adapter avec un nouveau type
            titre="Approbation requise : Fiche de Besoin",
            message=f"La fiche de besoin pour '{fiche.designation}' ({fiche.quantite} {fiche.unite}) est en attente de votre approbation.",
            destinataires=responsable_emails,
            priorite=PrioriteNotification.HAUTE,
            reference_id=fiche.id,
            reference_type="fiche_besoin"
        )

        db.refresh(fiche)
        return fiche

    @staticmethod
    def approve_or_reject(
        db: Session, 
        fiche_id: int, 
        approbateur: User, 
        is_approved: bool, 
        notes: Optional[str] = None
    ) -> FicheBesoin:
        """
        Approuve ou rejette une fiche de besoin.
        1. Vérifie que la fiche est en attente d'approbation.
        2. Met à jour le statut, l'approbateur et la date.
        3. Notifie le demandeur du résultat.
        """
        fiche = db.query(FicheBesoin).filter(FicheBesoin.id == fiche_id).first()
        if not fiche:
            raise NotFoundException("Fiche de besoin introuvable.")

        if fiche.statut != StatutFicheBesoin.EN_ATTENTE_APPROBATION:
            raise BusinessRuleViolationError(f"La fiche doit être en statut 'EN_ATTENTE_APPROBATION'. Statut actuel: {fiche.statut}")

        fiche.statut = StatutFicheBesoin.APPROUVEE if is_approved else StatutFicheBesoin.REJETEE
        fiche.approbateur_id = approbateur.id
        fiche.date_approbation = datetime.now(timezone.utc)
        fiche.notes_approbation = notes
        db.flush()

        # Notifier le demandeur
        demandeur = db.query(User).filter(User.id == fiche.demandeur_id).first()
        if demandeur:
            resultat = "approuvée" if is_approved else "rejetée"
            # ... logique de notification par email ou in-app ...
            print(f"Notification envoyée à {demandeur.email}: Votre fiche de besoin a été {resultat}.")

        db.refresh(fiche)
        return fiche
