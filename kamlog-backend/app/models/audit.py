# app/models/audit.py  Table audit_log globale
from sqlalchemy import String, JSON, ForeignKey, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


class AuditLog(BaseModel):
    """Table d'audit global pour traçabilité juridique."""
    __tablename__ = "audit_log"

    table_name: Mapped[str] = mapped_column(String(100), nullable=False)
    record_id: Mapped[int] = mapped_column(Integer, nullable=False)
    action: Mapped[str] = mapped_column(String(20), nullable=False)  # INSERT/UPDATE/DELETE
    old_values: Mapped[dict | None] = mapped_column(JSON)
    new_values: Mapped[dict | None] = mapped_column(JSON)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey('users.id'))
    agency_id: Mapped[int | None] = mapped_column(Integer, ForeignKey('agencies.id'))
    ip_address: Mapped[str | None] = mapped_column(String(50))
    
    agency = relationship("Agency", back_populates="audit_logs")
