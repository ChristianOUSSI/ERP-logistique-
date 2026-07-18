from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(50), unique=True, index=True, nullable=False)
    titre = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    statut = Column(String(50), default="OUVERT") # OUVERT, EN_COURS, RESOLU, FERME
    priorite = Column(String(50), default="MOYENNE") # BASSE, MOYENNE, HAUTE, URGENTE
    
    # Relations
    tiers_id = Column(Integer, ForeignKey("tiers.id", ondelete="CASCADE"), nullable=False)
    mission_id = Column(Integer, ForeignKey("missions_transport.id", ondelete="CASCADE"), nullable=True)
    
    # Dates
    date_creation = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    date_resolution = Column(DateTime, nullable=True)
    
    # Relationships
    tiers = relationship("Tiers")
    mission = relationship("MissionTransport")
