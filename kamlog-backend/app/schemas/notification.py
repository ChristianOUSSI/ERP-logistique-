# app/schemas/notification.py - Schémas Pydantic pour les notifications
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.notification import TypeNotification, PrioriteNotification, StatutNotification


class NotificationBase(BaseModel):
    """Schéma de base pour les notifications"""
    type_notification: TypeNotification
    titre: str = Field(..., max_length=200)
    message: str = Field(..., max_length=1000)
    priorite: PrioriteNotification = PrioriteNotification.NORMALE
    reference_type: Optional[str] = Field(None, max_length=50)
    reference_id: Optional[int] = None
    contexte: Optional[Dict[str, Any]] = None


class NotificationCreate(NotificationBase):
    """Schéma pour créer une notification"""
    destinataire_id: int
    expediteur_id: Optional[int] = None


class NotificationUpdate(BaseModel):
    """Schéma pour mettre à jour une notification"""
    statut: Optional[StatutNotification] = None
    date_lecture: Optional[datetime] = None
    date_archivage: Optional[datetime] = None


class NotificationResponse(NotificationBase):
    """Schéma pour la réponse des notifications"""
    id: int
    destinataire_id: int
    expediteur_id: Optional[int] = None
    agency_id: int
    statut: StatutNotification
    date_creation: datetime
    date_lecture: Optional[datetime] = None
    date_archivage: Optional[datetime] = None
    canal_envoye: Optional[str] = None
    date_envoi: Optional[datetime] = None
    tentatives_envoi: int = 0
    model_config = ConfigDict(from_attributes=True)


class NotificationStats(BaseModel):
    """Schéma pour les statistiques de notifications"""
    total_unread: int = Field(..., description="Nombre total de notifications non lues")
    high_priority_unread: int = Field(..., description="Nombre de notifications haute priorité non lues")


class NotificationFilter(BaseModel):
    """Schéma pour filtrer les notifications"""
    statut: Optional[StatutNotification] = None
    type_notification: Optional[TypeNotification] = None
    priorite: Optional[PrioriteNotification] = None
    date_debut: Optional[datetime] = None
    date_fin: Optional[datetime] = None