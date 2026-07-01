# app/routers/notifications.py - Router API pour les notifications
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.utils.rbac import get_current_user, require_permission
from app.models.user import User
from app.models.notification import Notification, TypeNotification, StatutNotification
from app.services.notification_service import NotificationService
from app.schemas.notification import (
    NotificationResponse, 
    NotificationCreate, 
    NotificationUpdate,
    NotificationStats
)
from app.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.get("/", response_model=List[NotificationResponse])
def get_my_notifications(
    statut: Optional[StatutNotification] = Query(None, description="Filtrer par statut"),
    type_notification: Optional[TypeNotification] = Query(None, description="Filtrer par type"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère les notifications de l'utilisateur connecté.
    """
    try:
        notifications = NotificationService.get_notifications_by_user(
            db=db,
            destinataire_id=current_user.id,
            agency_id=current_user.agency_id,
            statut=statut,
            type_notification=type_notification,
            skip=skip,
            limit=limit
        )
        return notifications
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des notifications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des notifications"
        )


@router.get("/stats", response_model=NotificationStats)
def get_notification_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère les statistiques de notifications de l'utilisateur.
    """
    try:
        unread_count = NotificationService.get_unread_count(
            db=db,
            destinataire_id=current_user.id,
            agency_id=current_user.agency_id
        )
        
        # Compter par priorité
        high_priority = db.query(Notification).filter(
            Notification.destinataire_id == current_user.id,
            Notification.agency_id == current_user.agency_id,
            Notification.statut == StatutNotification.NON_LUE,
            Notification.priorite.in_(["HAUTE", "CRITIQUE"])
        ).count()
        
        return NotificationStats(
            total_unread=unread_count,
            high_priority_unread=high_priority
        )
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des statistiques"
        )


@router.put("/{notification_id}/mark-read", response_model=NotificationResponse)
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Marque une notification comme lue.
    """
    try:
        notification = NotificationService.mark_as_read(
            db=db,
            notification_id=notification_id,
            destinataire_id=current_user.id
        )
        
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification non trouvée"
            )
        
        return notification
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors du marquage comme lu: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors du marquage de la notification"
        )


@router.put("/mark-all-read")
def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Marque toutes les notifications comme lues.
    """
    try:
        count = NotificationService.mark_all_as_read(
            db=db,
            destinataire_id=current_user.id,
            agency_id=current_user.agency_id
        )
        
        return {"message": f"{count} notifications marquées comme lues"}
    except Exception as e:
        logger.error(f"Erreur lors du marquage global: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors du marquage des notifications"
        )


@router.delete("/read")
def delete_read_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Supprime toutes les notifications lues.
    """
    try:
        count = NotificationService.delete_read_notifications(
            db=db,
            destinataire_id=current_user.id,
            agency_id=current_user.agency_id
        )
        
        return {"message": f"{count} notifications supprimées"}
    except Exception as e:
        logger.error(f"Erreur lors de la suppression: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la suppression des notifications"
        )


# Endpoints d'administration (ADMIN uniquement)

@router.post("/", response_model=NotificationResponse)
@require_permission("notifications:create")
def create_notification(
    notification_data: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Crée une nouvelle notification (ADMIN uniquement).
    """
    try:
        notification = NotificationService.create_notification(
            db=db,
            type_notification=notification_data.type_notification,
            titre=notification_data.titre,
            message=notification_data.message,
            destinataire_id=notification_data.destinataire_id,
            agency_id=current_user.agency_id,
            priorite=notification_data.priorite,
            reference_id=notification_data.reference_id,
            reference_type=notification_data.reference_type,
            contexte=notification_data.contexte,
            expediteur_id=current_user.id
        )
        
        return notification
    except Exception as e:
        logger.error(f"Erreur lors de la création: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création de la notification"
        )


@router.get("/all", response_model=List[NotificationResponse])
@require_permission("notifications:read_all")
def get_all_notifications(
    destinataire_id: Optional[int] = Query(None, description="Filtrer par destinataire"),
    statut: Optional[StatutNotification] = Query(None, description="Filtrer par statut"),
    type_notification: Optional[TypeNotification] = Query(None, description="Filtrer par type"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère toutes les notifications de l'agence (ADMIN uniquement).
    """
    try:
        # Si destinataire_id est fourni, récupérer ses notifications
        if destinataire_id:
            notifications = NotificationService.get_notifications_by_user(
                db=db,
                destinataire_id=destinataire_id,
                agency_id=current_user.agency_id,
                statut=statut,
                type_notification=type_notification,
                skip=skip,
                limit=limit
            )
        else:
            # Sinon, récupérer toutes les notifications de l'agence
            query = db.query(Notification).filter(
                Notification.agency_id == current_user.agency_id
            )
            
            if statut:
                query = query.filter(Notification.statut == statut)
            if type_notification:
                query = query.filter(Notification.type_notification == type_notification)
            
            notifications = query.order_by(Notification.date_creation.desc()).offset(skip).limit(limit).all()
        
        return notifications
    except Exception as e:
        logger.error(f"Erreur lors de la récupération globale: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des notifications"
        )
