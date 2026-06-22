# app/models/tiers.py  Modèle SQLAlchemy Tiers
import enum
from sqlalchemy import String, Boolean, Numeric, Text, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel


class StatutTiers(str, enum.Enum):
    ACTIF = "ACTIF"
    BLOQUE = "BLOQUE"
    INACTIF = "INACTIF"


class Tiers(BaseModel):
    __tablename__ = "tiers"

    # Identification
    code_tiers: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    raison_sociale: Mapped[str] = mapped_column(String(200), nullable=False)
    niu: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    rccm: Mapped[str | None] = mapped_column(String(50))

    # Contact
    email: Mapped[str | None] = mapped_column(String(100))
    telephone: Mapped[str | None] = mapped_column(String(30))
    adresse: Mapped[str | None] = mapped_column(Text)
    ville: Mapped[str | None] = mapped_column(String(100))
    pays: Mapped[str] = mapped_column(String(50), default='Cameroun')

    # Statut
    statut: Mapped[StatutTiers] = mapped_column(
        default=StatutTiers.ACTIF, nullable=False
    )

    # Habilitations services (booléens)
    autorise_transport: Mapped[bool] = mapped_column(Boolean, default=False)
    autorise_transit: Mapped[bool] = mapped_column(Boolean, default=False)
    autorise_acconage: Mapped[bool] = mapped_column(Boolean, default=False)
    autorise_magasinage: Mapped[bool] = mapped_column(Boolean, default=False)

    # Finance SYSCOHADA
    compte_syscohada: Mapped[str | None] = mapped_column(String(20))
    limite_credit_xaf: Mapped[int] = mapped_column(Numeric(15, 0), default=0)

    # Index pour recherches rapides
    __table_args__ = (
        Index("ix_tiers_niu", "niu"),
        Index("ix_tiers_statut", "statut"),
        Index("ix_tiers_code", "code_tiers"),
    )
