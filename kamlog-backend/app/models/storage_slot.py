# app/models/storage_slot.py
from sqlalchemy import Column, Integer, String, Numeric(18, 4), Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from app.models.base import BaseModel

class StorageSlot(BaseModel):
    """
    Emplacement précis de stockage dans un magasin (WMS).
    Exemple : Allée A, Rack 2, Niveau 3, Emplacement 4 (A-02-03-04)
    """
    __tablename__ = "storage_slots"

    magasin_id: Mapped[int] = mapped_column(ForeignKey("magasins.id", ondelete="CASCADE"), index=True)
    
    # Identifiant complet de l'emplacement
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    
    aisle: Mapped[Optional[str]] = mapped_column(String(10)) # Allée
    rack: Mapped[Optional[str]] = mapped_column(String(10))  # Etagère
    level: Mapped[Optional[str]] = mapped_column(String(10)) # Niveau
    bin: Mapped[Optional[str]] = mapped_column(String(10))   # Emplacement final
    
    # Capacité max de l'emplacement (en volume m3 ou en poids kg)
    max_weight_kg: Mapped[Optional[float]] = mapped_column(Numeric(18, 4))
    max_volume_cbm: Mapped[Optional[float]] = mapped_column(Numeric(18, 4))
    
    # État
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_occupied: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relations (Optionnel si vous liez un Slot à ses Stocks)
    # stocks: Mapped[list["Stock"]] = relationship("Stock", back_populates="slot")
