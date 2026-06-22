# app/services/purchase_requisition_service.py
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.models.purchase import FicheBesoin, StatutFicheBesoin
from app.models.user import User
from app.exceptions import BusinessRuleViolationError, ResourceNotFoundError
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
            raise ResourceNotFoundError("Fiche de besoin introuvable.")
        
        if fiche.demandeur_id != demandeur.id:
            raise BusinessRuleViolationError("Seul le demandeur peut soumettre la fiche.")

        if fiche.statut != StatutFicheBesoin.BROUILLON:
            raise BusinessRuleViolationError(f"La fiche doit être en statut 'BROUILLON' pour être soumise. Statut actuel: {fiche.statut}")

        fiche.statut = StatutFicheBesoin.EN_ATTENTE_APPROBATION
        db.commit()

        # Logique de notification du supérieur (simplifiée)
        # En production, on irait chercher le N+1 dans un organigramme
        responsable_email = "responsable.achats@kamlog.cm" # Placeholder

        NotificationService.create_notification(
            db=db,
            type_notification=TypeNotification.AUTORISATION_BON_ENLEVEMENT, # A adapter avec un nouveau type
            titre="Approbation requise : Fiche de Besoin",
            message=f"La fiche de besoin pour '{fiche.designation}' ({fiche.quantite} {fiche.unite}) est en attente de votre approbation.",
            destinataires=[responsable_email],
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
            raise ResourceNotFoundError("Fiche de besoin introuvable.")

        if fiche.statut != StatutFicheBesoin.EN_ATTENTE_APPROBATION:
            raise BusinessRuleViolationError(f"La fiche doit être en statut 'EN_ATTENTE_APPROBATION'. Statut actuel: {fiche.statut}")

        fiche.statut = StatutFicheBesoin.APPROUVEE if is_approved else StatutFicheBesoin.REJETEE
        fiche.approbateur_id = approbateur.id
        fiche.date_approbation = datetime.utcnow()
        fiche.notes_approbation = notes
        db.commit()

        # Notifier le demandeur
        demandeur = db.query(User).filter(User.id == fiche.demandeur_id).first()
        if demandeur:
            resultat = "approuvée" if is_approved else "rejetée"
            # ... logique de notification par email ou in-app ...
            print(f"Notification envoyée à {demandeur.email}: Votre fiche de besoin a été {resultat}.")

        db.refresh(fiche)
        return fiche