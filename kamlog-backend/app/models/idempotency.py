# app/models/idempotency.py - Modèle pour l'idempotence
from sqlalchemy import String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.models.base import BaseModel


class IdempotencyKey(BaseModel):
    """Modèle pour stocker les clés d'idempotence"""
    __tablename__ = "idempotency_keys"

    # Clé d'idempotence fournie par le client
    idempotency_key: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    
    # Utilisateur qui a fait la requête
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User")
    
    # Multi-tenancy
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id"), nullable=False)
    agency = relationship("Agency")
    
    # Endpoint et méthode HTTP
    method: Mapped[str] = mapped_column(String(10), nullable=False)  # GET, POST, PUT, DELETE
    endpoint: Mapped[str] = mapped_column(String(500), nullable=False)
    
    # Hash du corps de la requête pour validation
    request_hash: Mapped[str] = mapped_column(String(64), nullable=False)  # SHA-256
    
    # Réponse mise en cache
    response_status_code: Mapped[int] = mapped_column(Integer, nullable=False)
    response_body: Mapped[str] = mapped_column(Text, nullable=True)
    response_headers: Mapped[str] = mapped_column(Text, nullable=True)  # JSON string
    
    # Timestamps
    date_creation: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    date_expiration: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
    
    # Métadonnées
    ip_address: Mapped[str] = mapped_column(String(45), nullable=True)  # IPv6 compatible
    user_agent: Mapped[str] = mapped_column(String(500), nullable=True)
    
    def __repr__(self):
        return f"<IdempotencyKey(key={self.idempotency_key}, user={self.user_id}, endpoint={self.endpoint})>"