from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Employe(Base):
    __tablename__ = "employes"

    id = Column(Integer, primary_key=True, index=True)
    matricule = Column(String(50), unique=True, index=True, nullable=False)
    nom = Column(String(100), nullable=False)
    prenom = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True)
    telephone = Column(String(20))
    departement = Column(String(100)) # LOGISTIQUE, FINANCE, ADMINISTRATION, etc.
    poste = Column(String(100))
    date_embauche = Column(Date, nullable=False)
    statut = Column(String(50), default="ACTIF") # ACTIF, EN_CONGE, SUSPENDU, ANCIEN
    
    # User linkage (optional, for portal access)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User")
    
    contrats = relationship("Contrat", back_populates="employe", cascade="all, delete-orphan")
    conges = relationship("Conge", back_populates="employe", cascade="all, delete-orphan")
    fiches_paie = relationship("FichePaie", back_populates="employe", cascade="all, delete-orphan")


class Contrat(Base):
    __tablename__ = "contrats"

    id = Column(Integer, primary_key=True, index=True)
    employe_id = Column(Integer, ForeignKey("employes.id"), nullable=False)
    type_contrat = Column(String(50)) # CDI, CDD, PRESTATION
    salaire_base = Column(Numeric(12, 2), nullable=False)
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date, nullable=True)
    est_actif = Column(Boolean, default=True)

    employe = relationship("Employe", back_populates="contrats")


class Conge(Base):
    __tablename__ = "conges"

    id = Column(Integer, primary_key=True, index=True)
    employe_id = Column(Integer, ForeignKey("employes.id"), nullable=False)
    type_conge = Column(String(50)) # ANNUEL, MALADIE, MATERNITE, SANS_SOLDE
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date, nullable=False)
    statut = Column(String(50), default="EN_ATTENTE") # EN_ATTENTE, APPROUVE, REFUSE
    motif = Column(String(255), nullable=True)

    employe = relationship("Employe", back_populates="conges")


class FichePaie(Base):
    __tablename__ = "fiches_paie"

    id = Column(Integer, primary_key=True, index=True)
    employe_id = Column(Integer, ForeignKey("employes.id"), nullable=False)
    periode = Column(String(7), nullable=False) # Format YYYY-MM
    salaire_base = Column(Numeric(12, 2), nullable=False)
    primes = Column(Numeric(12, 2), default=0)
    deductions = Column(Numeric(12, 2), default=0)
    net_a_payer = Column(Numeric(12, 2), nullable=False)
    date_generation = Column(DateTime, default=datetime.utcnow)
    statut = Column(String(50), default="BROUILLON") # BROUILLON, VALIDEE, PAYEE

    employe = relationship("Employe", back_populates="fiches_paie")
