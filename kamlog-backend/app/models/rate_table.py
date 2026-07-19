# app/models/rate_table.py
from sqlalchemy import String, Numeric, ForeignKey, Integer, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
import enum
from .base import BaseModel

class PricingBasis(str, enum.Enum):
    PER_KG = "PER_KG"
    PER_CBM = "PER_CBM"
    PER_PALLET = "PER_PALLET"
    PER_CONTAINER_20 = "PER_CONTAINER_20"
    PER_CONTAINER_40 = "PER_CONTAINER_40"
    FLAT_FEE = "FLAT_FEE"
    DISTANCE_KM = "DISTANCE_KM"

class TransportMode(str, enum.Enum):
    ROAD = "ROAD"
    SEA = "SEA"
    AIR = "AIR"
    RAIL = "RAIL"

class RateTable(BaseModel):
    """
    Grille tarifaire (Rate Table) applicable à un client ou à des itinéraires standards.
    """
    __tablename__ = "rate_tables"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    currency: Mapped[str] = mapped_column(String(3), default="XAF") # EUR, USD, XAF

    # Si la grille est spécifique à un client, on peut la lier à la table Tiers
    client_id: Mapped[Optional[int]] = mapped_column(ForeignKey("tiers.id", ondelete="CASCADE"), nullable=True)

    rules: Mapped[List["RateRule"]] = relationship(
        "RateRule", back_populates="rate_table", cascade="all, delete-orphan"
    )


class RateRule(BaseModel):
    """
    Règle de tarification spécifique au sein d'une grille.
    Peut dépendre de l'origine, la destination, le mode, etc.
    """
    __tablename__ = "rate_rules"

    rate_table_id: Mapped[int] = mapped_column(ForeignKey("rate_tables.id", ondelete="CASCADE"), nullable=False)
    
    origin_zone: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    destination_zone: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    transport_mode: Mapped[Optional[TransportMode]] = mapped_column(Enum(TransportMode))
    
    basis: Mapped[PricingBasis] = mapped_column(Enum(PricingBasis), nullable=False)
    
    # Range values for tiered pricing (e.g., price per kg for 0-100kg vs 100-500kg)
    min_value: Mapped[Optional[float]] = mapped_column(Numeric(18, 4))
    max_value: Mapped[Optional[float]] = mapped_column(Numeric(18, 4))
    
    unit_price: Mapped[float] = mapped_column(Numeric(18, 4), nullable=False)
    minimum_charge: Mapped[Optional[float]] = mapped_column(Numeric(18, 4))

    rate_table: Mapped["RateTable"] = relationship("RateTable", back_populates="rules")
