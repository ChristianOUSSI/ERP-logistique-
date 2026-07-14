# app/models/transport.py  Modèles K-Transport Complets
import enum
from decimal import Decimal
from sqlalchemy import String, Numeric, Boolean, Text, ForeignKey, Index, Integer, DateTime, Date, JSON, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, date
from app.models.base import BaseModel

# ─── Énumérations ──────────────────────────────────────────

class TypeMateriel(str, enum.Enum):
    TRACTEUR = "TR"
    REMORQUE = "RE"
    SEMI_REMORQUE = "SR"

class TypeVehicule(str, enum.Enum):
    BENNE_VRAC = "BENNE_VRAC"
    PORTE_CONTENEUR = "PORTE_CONTENEUR"
    CITERNE = "CITERNE"
    FRIGORIFIQUE = "FRIGORIFIQUE"
    PLATEAU = "PLATEAU"
    TAUTLINER = "TAUTLINER"
    FOURGON = "FOURGON"
    PORTE_ENGIN = "PORTE_ENGIN"

class StatutMission(str, enum.Enum):
    BROUILLON = "BROUILLON"
    PLANIFIE = "PLANIFIE"
    VALIDE = "VALIDE"
    EN_CHARGEMENT = "EN_CHARGEMENT"
    EN_ROUTE = "EN_ROUTE"
    EN_LIVRAISON = "EN_LIVRAISON"
    LIVRE = "LIVRE"
    FACTURE = "FACTURE"
    TERMINEE = "TERMINEE"

class StatutCamion(str, enum.Enum):
    DISPONIBLE = "DISPONIBLE"
    EN_MAINTENANCE = "EN_MAINTENANCE"
    EN_ROUTE = "EN_ROUTE"
    EN_CHARGEMENT = "EN_CHARGEMENT"
    BLOQUE_HSE = "BLOQUE_HSE"

class StatutChauffeur(str, enum.Enum):
    EN_SERVICE = "EN_SERVICE"
    EN_REPOS = "EN_REPOS"
    EN_MISSION = "EN_MISSION"
    EN_FORMATION = "EN_FORMATION"

class StatutPanne(str, enum.Enum):
    A_REPARER = "A_REPARER"
    EN_COURS = "EN_COURS"
    RESOLU = "RESOLU"


# ─── Flotte (Véhicules & Remorques) ─────────────────────────

class CamionFlotte(BaseModel):
    __tablename__ = "camions_flotte"

    immatriculation: Mapped[str] = mapped_column(String(20), unique=True) # Ex: LT TR 123 AB
    type_materiel: Mapped[TypeMateriel] = mapped_column(default=TypeMateriel.TRACTEUR)
    type_vehicule: Mapped[TypeVehicule]
    marque: Mapped[str] = mapped_column(String(50))
    modele: Mapped[str] = mapped_column(String(50))
    charge_utile_kg: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    volume_reservoir_litres: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    conso_theorique_l_100: Mapped[Decimal | None] = mapped_column(Numeric(6, 2), nullable=True)
    
    gps_tracker_id: Mapped[str | None] = mapped_column(String(100), unique=True)
    remorque_id: Mapped[int | None] = mapped_column(ForeignKey('camions_flotte.id'))
    
    statut: Mapped[StatutCamion] = mapped_column(default=StatutCamion.DISPONIBLE)
    actif: Mapped[bool] = mapped_column(Boolean, default=True)
    proprietes_dynamiques: Mapped[dict | None] = mapped_column(JSON, default={}, comment="Variables libres dynamiques (Assurance, Numéro Pneu...)")

    remorque_attachee: Mapped['CamionFlotte'] = relationship(remote_side="CamionFlotte.id", backref="tracteur_parent")
    documents: Mapped[list['VehiculeDocument']] = relationship(back_populates='vehicule', cascade="all, delete-orphan")
    pannes: Mapped[list['PanneVehicule']] = relationship(back_populates='vehicule', cascade="all, delete-orphan")
    missions: Mapped[list['MissionTransport']] = relationship(
        back_populates='camion', 
        foreign_keys="[MissionTransport.camion_id]"
    )


class VehiculeDocument(BaseModel):
    __tablename__ = "vehicule_documents"

    vehicule_id: Mapped[int] = mapped_column(ForeignKey('camions_flotte.id'))
    type_document: Mapped[str] = mapped_column(String(50)) # CARTE_GRISE, VISITE_TECHNIQUE, ASSURANCE, PATENTE
    numero: Mapped[str] = mapped_column(String(100))
    date_emission: Mapped[date] = mapped_column(Date)
    date_expiration: Mapped[date] = mapped_column(Date)
    fichier_url: Mapped[str | None] = mapped_column(String(255))
    
    vehicule: Mapped['CamionFlotte'] = relationship(back_populates='documents')


class PanneVehicule(BaseModel):
    __tablename__ = "pannes_vehicule"

    vehicule_id: Mapped[int] = mapped_column(ForeignKey('camions_flotte.id'))
    description: Mapped[str] = mapped_column(Text)
    date_declaration: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    date_reparation_prevue: Mapped[date | None] = mapped_column(Date)
    statut: Mapped[StatutPanne] = mapped_column(default=StatutPanne.A_REPARER)
    declare_par: Mapped[str | None] = mapped_column(String(100))
    notes_resolution: Mapped[str | None] = mapped_column(Text)
    
    vehicule: Mapped['CamionFlotte'] = relationship(back_populates='pannes')


class ControleHSE(BaseModel):
    __tablename__ = "controles_hse"

    vehicule_id: Mapped[int] = mapped_column(ForeignKey('camions_flotte.id'))
    controleur: Mapped[str] = mapped_column(String(100))
    date_controle: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    vehicule_bloque: Mapped[bool] = mapped_column(Boolean, default=False)
    motif_blocage: Mapped[str | None] = mapped_column(Text)
    
    vehicule: Mapped['CamionFlotte'] = relationship()


# ─── Ressources Humaines (Chauffeurs) ──────────────────────

class ChauffeurProfil(BaseModel):
    __tablename__ = "chauffeurs"

    nom: Mapped[str] = mapped_column(String(100))
    prenom: Mapped[str] = mapped_column(String(100))
    telephone: Mapped[str] = mapped_column(String(30))
    adresse: Mapped[str | None] = mapped_column(Text)
    contact_urgence_nom: Mapped[str | None] = mapped_column(String(100))
    contact_urgence_telephone: Mapped[str | None] = mapped_column(String(30))
    
    numero_permis: Mapped[str] = mapped_column(String(50), unique=True)
    categorie_permis: Mapped[str] = mapped_column(String(10))
    
    statut: Mapped[StatutChauffeur] = mapped_column(default=StatutChauffeur.EN_SERVICE)
    affectation_vehicule_id: Mapped[int | None] = mapped_column(ForeignKey('camions_flotte.id'))
    specialisation: Mapped[str | None] = mapped_column(String(100))
    date_entree: Mapped[date | None] = mapped_column(Date)
    salaire_base: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), default=0)
    actif: Mapped[bool] = mapped_column(Boolean, default=True)

    vehicule_attitre: Mapped['CamionFlotte'] = relationship()
    documents: Mapped[list['ChauffeurDocument']] = relationship(back_populates='chauffeur', cascade="all, delete-orphan")
    missions: Mapped[list['MissionTransport']] = relationship(back_populates='chauffeur')


class ChauffeurDocument(BaseModel):
    __tablename__ = "chauffeur_documents"

    chauffeur_id: Mapped[int] = mapped_column(ForeignKey('chauffeurs.id'))
    type_document: Mapped[str] = mapped_column(String(50)) # PERMIS, FIMO, CERTIFICAT_MEDICAL
    numero: Mapped[str] = mapped_column(String(100))
    date_emission: Mapped[date] = mapped_column(Date)
    date_expiration: Mapped[date] = mapped_column(Date)
    fichier_url: Mapped[str | None] = mapped_column(String(255))
    
    chauffeur: Mapped['ChauffeurProfil'] = relationship(back_populates='documents')


# ─── Ordres de Transport (OT) ──────────────────────────────

class MissionTransport(BaseModel):
    __tablename__ = "missions_transport"

    # Bloc "Entités Contractuelles"
    reference: Mapped[str] = mapped_column(String(30), unique=True)
    tiers_id: Mapped[int] = mapped_column(ForeignKey('tiers.id'))
    dossier_id: Mapped[int | None] = mapped_column(ForeignKey('dossiers_operationnels.id'))
    expediteur_adresse: Mapped[str | None] = mapped_column(Text)
    destinataire_adresse: Mapped[str | None] = mapped_column(Text)
    contact_site: Mapped[str | None] = mapped_column(String(100))

    # Bloc "Ressources Affectées"
    camion_id: Mapped[int] = mapped_column(ForeignKey('camions_flotte.id'))
    remorque_id: Mapped[int | None] = mapped_column(ForeignKey('camions_flotte.id'))
    chauffeur_id: Mapped[int] = mapped_column(ForeignKey('chauffeurs.id'))

    # Bloc "Détails du Fret & Logistique"
    origine: Mapped[str] = mapped_column(String(200))
    destination: Mapped[str] = mapped_column(String(200))
    distance_km: Mapped[Decimal] = mapped_column(Numeric(8, 2))
    nature_fret: Mapped[str] = mapped_column(String(50))
    poids_kg: Mapped[Decimal | None] = mapped_column(Numeric(12, 3))
    volume_m3: Mapped[Decimal | None] = mapped_column(Numeric(10, 3))
    date_chargement_prevue: Mapped[datetime | None] = mapped_column(DateTime)
    date_livraison_souhaitee: Mapped[datetime | None] = mapped_column(DateTime)
    
    # E-POD (Proof of Delivery)
    preuve_livraison_signature: Mapped[str | None] = mapped_column(Text)
    nom_receptionnaire: Mapped[str | None] = mapped_column(String(100))
    date_livraison_reelle: Mapped[datetime | None] = mapped_column(DateTime)
    
    # Bloc "Volet Financier & Administratif"
    montant_fret: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    frais_peage: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), default=0)
    frais_annexes: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), default=0)
    proprietes_dynamiques: Mapped[dict | None] = mapped_column(JSON, default={}, comment="Variables libres dynamiques du trajet")

    statut: Mapped[StatutMission] = mapped_column(default=StatutMission.BROUILLON)
    notes: Mapped[str | None] = mapped_column(Text)

    # Relations
    camion: Mapped['CamionFlotte'] = relationship(foreign_keys=[camion_id], back_populates='missions')
    remorque: Mapped['CamionFlotte'] = relationship(foreign_keys=[remorque_id])
    chauffeur: Mapped['ChauffeurProfil'] = relationship(back_populates='missions')

    __table_args__ = (Index("ix_missions_statut", "statut"),)

class TicketCarburant(BaseModel):
    __tablename__ = "tickets_carburant"

    camion_id: Mapped[int] = mapped_column(ForeignKey('camions_flotte.id'))
    chauffeur_id: Mapped[int] = mapped_column(ForeignKey('chauffeurs.id'))
    quantite_litres: Mapped[Decimal] = mapped_column(Numeric(8, 2))
    prix_unitaire: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    montant_total: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    date_plein: Mapped[str] = mapped_column(String(50))
    kilometrage: Mapped[int] = mapped_column(Integer, default=0)
    station_service: Mapped[str | None] = mapped_column(String(100))
    notes: Mapped[str | None] = mapped_column(Text)
    
    camion: Mapped['CamionFlotte'] = relationship(foreign_keys=[camion_id])
    chauffeur: Mapped['ChauffeurProfil'] = relationship(foreign_keys=[chauffeur_id])

class PositionGPS(BaseModel):
    __tablename__ = "positions_gps"

    camion_id: Mapped[int] = mapped_column(ForeignKey('camions_flotte.id'), index=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    vitesse_kmh: Mapped[float] = mapped_column(Float, default=0.0)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    
    camion: Mapped['CamionFlotte'] = relationship(foreign_keys=[camion_id])
