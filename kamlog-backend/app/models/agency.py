from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.models.base import Base

class Agency(Base):
    __tablename__ = "agencies"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    nom = Column(String(150), nullable=False)
    adresse = Column(String(255), nullable=True)
    ville = Column(String(100), default="Douala")
    pays = Column(String(100), default="Cameroun")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
