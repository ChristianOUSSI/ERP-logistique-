from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from datetime import datetime
from app.models.base import Base


class Tiers(Base):
    __tablename__ = "tiers"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    nom = Column(String(255), nullable=False)
    type = Column(String(50), default="CLIENT")  # CLIENT, FOURNISSEUR, TRANSITAIRE, AGENT
    email = Column(String(255), nullable=True)
    telephone = Column(String(50), nullable=True)
    adresse = Column(Text, nullable=True)
    ville = Column(String(100), nullable=True)
    pays = Column(String(100), default="Cameroun")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    designation = Column(String(255), nullable=False)
    categorie = Column(String(100), nullable=True)
    unite = Column(String(50), default="PCS")
    prix_unitaire = Column(Float, default=0.0)
    stock_actuel = Column(Float, default=0.0)
    stock_minimum = Column(Float, default=0.0)
    emplacement = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Declaration(Base):
    __tablename__ = "declarations"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(50), unique=True, index=True, nullable=False)
    type = Column(String(50), default="IMPORT")  # IMPORT, EXPORT, TRANSIT
    client_nom = Column(String(255), nullable=True)
    navire = Column(String(150), nullable=True)
    port_origine = Column(String(100), nullable=True)
    port_destination = Column(String(100), nullable=True)
    nombre_conteneurs = Column(Integer, default=1)
    poids_total_kg = Column(Float, default=0.0)
    valeur_marchandise_xaf = Column(Float, default=0.0)
    statut = Column(String(50), default="EN_COURS")  # EN_COURS, VALIDEE, LIQUIDEE, ENLEVEE
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(50), unique=True, index=True, nullable=False)
    type = Column(String(50), default="LIVRAISON")  # LIVRAISON, ENLEVEMENT, TRANSFERT
    chauffeur_nom = Column(String(255), nullable=True)
    camion_immatriculation = Column(String(50), nullable=True)
    origine = Column(String(200), nullable=True)
    destination = Column(String(200), nullable=True)
    client_nom = Column(String(255), nullable=True)
    distance_km = Column(Float, default=0.0)
    statut = Column(String(50), default="PLANIFIEE")  # PLANIFIEE, EN_COURS, LIVREE, ANNULEE
    date_depart = Column(DateTime, nullable=True)
    date_arrivee = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
