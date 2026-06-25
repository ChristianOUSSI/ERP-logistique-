# app/models/transport.py  Modèles K-Transport Complets
import enum
from decimal import Decimal
from sqlalchemy import String, Numeric, Boolean, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


class TypeVehicule(str, enum.Enum):
    BENNE_VRAC = "BENNE_VRAC"
    PORTE_CONTENEUR = "PORTE_CONTENEUR"
    CITERNE = "CITERNE"
    FRIGORIFIQUE = "FRIGORIFIQUE"
    PLATEAU = "PLATEAU"


class StatutMission(str, enum.Enum):
    PLANIFIE = "PLANIFIE"
    EN_CHARGEMENT = "EN_CHARGEMENT"
    EN_ROUTE = "EN_ROUTE"
    EN_LIVRAISON = "EN_LIVRAISON"
    LIVRE = "LIVRE"
    CLOTURE = "CLOTURE"


class StatutCamion(str, enum.Enum):
    DISPONIBLE = "DISPONIBLE"
    MAINTENANCE = "MAINTENANCE"
    EN_ROUTE = "EN_ROUTE"
    EN_CHARGEMENT = "EN_CHARGEMENT"


class CamionFlotte(BaseModel):
    __tablename__ = "camions_flotte"

    immatriculation: Mapped[str] = mapped_column(String(20), unique=True)
    type_vehicule: Mapped[TypeVehicule]
    marque: Mapped[str] = mapped_column(String(50))
    modele: Mapped[str] = mapped_column(String(50))
    charge_utile_kg: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    volume_reservoir_litres: Mapped[Decimal] = mapped_column(Numeric(8, 2))
    conso_theorique_l_100: Mapped[Decimal] = mapped_column(Numeric(6, 2))
    statut: Mapped[str] = mapped_column(String(30), default='DISPONIBLE')
    actif: Mapped[bool] = mapped_column(Boolean, default=True)

    missions: Mapped[list['MissionTransport']] = relationship(back_populates='camion')


class ChauffeurProfil(BaseModel):
    __tablename__ = "chauffeurs"

    nom: Mapped[str] = mapped_column(String(100))
    prenom: Mapped[str] = mapped_column(String(100))
    numero_permis: Mapped[str] = mapped_column(String(50), unique=True)
    categorie_permis: Mapped[str] = mapped_column(String(10))
    telephone: Mapped[str] = mapped_column(String(30))
    actif: Mapped[bool] = mapped_column(Boolean, default=True)

    missions: Mapped[list['MissionTransport']] = relationship(back_populates='chauffeur')


class MissionTransport(BaseModel):
    __tablename__ = "missions_transport"

    reference: Mapped[str] = mapped_column(String(30), unique=True)
    tiers_id: Mapped[int] = mapped_column(ForeignKey('tiers.id'))
    camion_id: Mapped[int] = mapped_column(ForeignKey('camions_flotte.id'))
    chauffeur_id: Mapped[int] = mapped_column(ForeignKey('chauffeurs.id'))
    dossier_id: Mapped[int | None] = mapped_column(ForeignKey('dossiers_operationnels.id'))

    origine: Mapped[str] = mapped_column(String(200))
    destination: Mapped[str] = mapped_column(String(200))
    distance_km: Mapped[Decimal] = mapped_column(Numeric(8, 2))
    type_marchandise: Mapped[str] = mapped_column(String(50))
    poids_kg: Mapped[Decimal | None] = mapped_column(Numeric(12, 3))

    statut: Mapped[StatutMission] = mapped_column(default=StatutMission.PLANIFIE)
    notes: Mapped[str | None] = mapped_column(Text)

    camion: Mapped['CamionFlotte'] = relationship(back_populates='missions')
    chauffeur: Mapped['ChauffeurProfil'] = relationship(back_populates='missions')

    __table_args__ = (Index("ix_missions_statut", "statut"),)
