# app/models/base.py  BaseModel commun à toutes les tables
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, func, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from app.database import Base


class BaseModel(Base):
    """
    Modèle de base KAMLOG :
    - id auto-généré
    - created_at / updated_at automatiques
    - soft delete avec deleted_at
    """
    __abstract__ = True

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    def soft_delete(self) -> None:
        """Suppression logique  ne jamais supprimer physiquement en prod."""
        self.deleted_at = func.now()
