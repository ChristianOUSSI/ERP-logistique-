# app/models/notification.py - Modèle pour les notifications persistantes
from sqlalchemy import String, Boolean, DateTime, Integer, Enum, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.models.base import BaseModel
import enum


class TypeNotification(str, enum.Enum):
    """Types de notifications"""
    AUTORISATION_BON_ENLEVEMENT = "AUTORISATION_BON_ENLEVEMENT"
    BON_ENLEVEMENT_AUTORISE = "BON_ENLEVEMENT_AUTORISE"
    RECEPTION_CREEE = "RECEPTION_CREEE"
    RECEPTION_VALIDEE = "RECEPTION_VALIDEE"
    STOCK_MIS_A_JOUR = "STOCK_MIS_A_JOUR"
    ERREUR_WORKFLOW = "ERREUR_WORKFLOW"
    LIMITE_CREDIT = "LIMITE_CREDIT"
    ALERTE_STOCK = "ALERTE_STOCK"
    MAINTENANCE_VEHICULE = "MAINTENANCE_VEHICULE"
    MISSION_TERMINEE = "MISSION_TERMINEE"


class PrioriteNotification(str, enum.Enum):
    """Priorités de notifications"""
    BASSE = "BASSE"
    NORMALE = "NORMALE"
    HAUTE = "HAUTE"
    CRITIQUE = "CRITIQUE"


class StatutNotification(str, enum.Enum):
    """Statuts de notifications"""
    NON_LUE = "NON_LUE"
    LUE = "LUE"
    ARCHIVEE = "ARCHIVEE"


class Notification(BaseModel):
    """Modèle pour les notifications persistantes"""
    __tablename__ = "notifications"

    type_notification: Mapped[TypeNotification] = mapped_column(String(50), nullable=False)
    titre: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(String(1000), nullable=False)
    priorite: Mapped[PrioriteNotification] = mapped_column(String(20), default=PrioriteNotification.NORMALE)
    statut: Mapped[StatutNotification] = mapped_column(String(20), default=StatutNotification.NON_LUE)
    
    # Destinataire
    destinataire_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    destinataire = relationship("User", foreign_keys=[destinataire_id])
    
    # Expéditeur (optionnel - pour notifications système)
    expediteur_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    expediteur = relationship("User", foreign_keys=[expediteur_id])
    
    # Multi-tenancy
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id"), nullable=False)
    agency = relationship("Agency")
    
    # Référence vers l'objet source
    reference_type: Mapped[str] = mapped_column(String(50), nullable=True)  # "removal_slip", "reception_mag3", etc.
    reference_id: Mapped[int] = mapped_column(Integer, nullable=True)
    
    # Données contextuelles
    contexte: Mapped[dict] = mapped_column(JSON, nullable=True)
    
    # Timestamps
    date_creation: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    date_lecture: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=True)
    date_archivage: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Métadonnées d'envoi
    canal_envoye: Mapped[str] = mapped_column(String(100), nullable=True)  # "in_app", "email", "sms"
    date_envoi: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=True)
    tentatives_envoi: Mapped[int] = mapped_column(Integer, default=0)
    
    def __repr__(self):
        return f"<Notification(id={self.id}, type={self.type_notification}, destinataire={self.destinataire_id})>"


class NotificationDestination(BaseModel):
    """Table de liaison pour les notifications multi-destinataires"""
    __tablename__ = "notifications_destinations"

    notification_id: Mapped[int] = mapped_column(Integer, ForeignKey("notifications.id"), nullable=False)
    destinataire_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    statut: Mapped[StatutNotification] = mapped_column(String(20), default=StatutNotification.NON_LUE)
    date_lecture: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relations
    notification = relationship("Notification")
    destinataire = relationship("User")
