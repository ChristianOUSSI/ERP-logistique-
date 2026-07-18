# app/models/audit.py  Tables audit_log et http_audit_log
from sqlalchemy import String, JSON, ForeignKey, Integer, DateTime, func, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


class AuditLog(BaseModel):
    """Table d'audit métier pour traçabilité juridique (CRUD sur entités)."""
    __tablename__ = "audit_log"

    table_name: Mapped[str] = mapped_column(String(100), nullable=False)
    record_id: Mapped[str] = mapped_column(String(255), nullable=False)
    action: Mapped[str] = mapped_column(String(50), nullable=False)  # INSERT/UPDATE/DELETE
    old_values: Mapped[dict | None] = mapped_column(JSON)
    new_values: Mapped[dict | None] = mapped_column(JSON)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    agency_id: Mapped[int | None] = mapped_column(Integer, ForeignKey('agencies.id', ondelete="CASCADE"))
    ip_address: Mapped[str | None] = mapped_column(String(50))
    user_agent: Mapped[str | None] = mapped_column(String(255))
    context: Mapped[dict | None] = mapped_column(JSON)
    hash_signature: Mapped[str | None] = mapped_column(String(64))  # SHA-256 for immutability

    agency = relationship("Agency", back_populates="audit_logs")


class HTTPAuditLog(BaseModel):
    """Table d'audit HTTP pour traçabilité des requêtes API."""
    __tablename__ = "http_audit_log"

    user_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    agency_id: Mapped[int | None] = mapped_column(Integer, ForeignKey('agencies.id', ondelete="CASCADE"), nullable=True)
    request_method: Mapped[str] = mapped_column(String(10), nullable=False)
    request_path: Mapped[str] = mapped_column(String(500), nullable=False)
    request_query_params: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    request_body_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    response_status_code: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_ms: Mapped[int] = mapped_column(Integer, nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(50), nullable=True)
    tcode: Mapped[str | None] = mapped_column(String(20), nullable=True)
    module: Mapped[str | None] = mapped_column(String(50), nullable=True)
    request_id: Mapped[str | None] = mapped_column(String(255), nullable=True)

    agency = relationship("Agency", back_populates="http_audit_logs")


# Listeners pour l'immuabilité
from sqlalchemy import event

@event.listens_for(AuditLog, 'before_update')
def receive_before_update(mapper, connection, target):
    raise Exception("L'Audit Log est immuable. Les mises à jour sont interdites.")

@event.listens_for(AuditLog, 'before_delete')
def receive_before_delete(mapper, connection, target):
    raise Exception("L'Audit Log est immuable. Les suppressions sont interdites.")
