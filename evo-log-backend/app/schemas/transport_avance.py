"""Pydantic schemas for advanced transport module"""
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


# Tournée schemas
class TourneeBase(BaseModel):
    vehicule_id: int
    conducteur_id: int
    date_tournee: date
    origine: str
    destination: str


class TourneeCreate(TourneeBase):
    pass


class TourneeUpdate(BaseModel):
    statut: Optional[str] = None
    distance_estimee_km: Optional[float] = None
    duree_estimee_heures: Optional[float] = None


class TourneeResponse(TourneeBase):
    id: int
    statut: str
    distance_estimee_km: Optional[float] = None
    duree_estimee_heures: Optional[float] = None
    heure_depart: Optional[datetime] = None
    heure_arrivee: Optional[datetime] = None
    duree_reelle_heures: Optional[float] = None
    
    class Config:
        from_attributes = True


# Livraison schemas
class LivraisonBase(BaseModel):
    tournee_id: int
    client_id: int
    adresse: str
    ordre_arret: int
    fenetre_horaire_debut: datetime
    fenetre_horaire_fin: datetime


class LivraisonCreate(LivraisonBase):
    pass


class LivraisonUpdate(BaseModel):
    statut: Optional[str] = None
    date_livraison_reelle: Optional[datetime] = None
    signature: Optional[str] = None
    photo_preuve: Optional[str] = None


class LivraisonResponse(LivraisonBase):
    id: int
    statut: str
    date_livraison_reelle: Optional[datetime] = None
    signature: Optional[str] = None
    photo_preuve: Optional[str] = None
    
    class Config:
        from_attributes = True


# FraisKilometrique schemas
class FraisKilometriqueBase(BaseModel):
    vehicule_id: int
    date_debut: date
    date_fin: date
    kilometres_parcourus: float
    taux_remboursement: float
    montant: float


class FraisKilometriqueCreate(FraisKilometriqueBase):
    pass


class FraisKilometriqueResponse(FraisKilometriqueBase):
    id: int
    
    class Config:
        from_attributes = True


# TempsConduite schemas
class TempsConduiteBase(BaseModel):
    conducteur_id: int
    vehicule_id: int
    debut_conduite: datetime
    fin_conduite: datetime
    kilometres: float


class TempsConduiteCreate(TempsConduiteBase):
    pass


class TempsConduiteResponse(TempsConduiteBase):
    id: int
    duree_heures: float
    
    class Config:
        from_attributes = True


class ConformiteTempsResponse(BaseModel):
    date: date
    total_heures_conduite: float
    limite_journaliere: float
    conforme: bool
    alerte: Optional[str] = None


# SousTraitant schemas
class SousTraitantBase(BaseModel):
    nom: str
    siret: str
    adresse: str
    telephone: str
    email: str
    specialites: List[str]


class SousTraitantCreate(SousTraitantBase):
    pass


class SousTraitantUpdate(BaseModel):
    statut: Optional[str] = None
    specialites: Optional[List[str]] = None


class SousTraitantResponse(SousTraitantBase):
    id: int
    statut: str
    
    class Config:
        from_attributes = True


# ContratSousTraitant schemas
class ContratSousTraitantBase(BaseModel):
    sous_traitant_id: int
    date_debut: date
    date_fin: date
    tarif_km: float
    tarif_fixe: float
    conditions: str


class ContratSousTraitantCreate(ContratSousTraitantBase):
    pass


class ContratSousTraitantUpdate(BaseModel):
    statut: Optional[str] = None


class ContratSousTraitantResponse(ContratSousTraitantBase):
    id: int
    statut: str
    
    class Config:
        from_attributes = True


# MissionSousTraitant schemas
class MissionSousTraitantBase(BaseModel):
    contrat_id: int
    mission_id: int
    kilometrage_estime: float


class MissionSousTraitantCreate(MissionSousTraitantBase):
    pass


class MissionSousTraitantUpdate(BaseModel):
    kilometrage_reel: Optional[float] = None
    date_livraison_prevue: Optional[date] = None
    date_livraison_reelle: Optional[date] = None
    statut: Optional[str] = None


class MissionSousTraitantResponse(MissionSousTraitantBase):
    id: int
    kilometrage_reel: Optional[float] = None
    date_livraison_prevue: Optional[date] = None
    date_livraison_reelle: Optional[date] = None
    date_creation: datetime
    statut: str
    
    class Config:
        from_attributes = True


# AccidentTransport schemas
class AccidentTransportBase(BaseModel):
    vehicule_id: int
    conducteur_id: int
    date_accident: datetime
    lieu: str
    description: str
    degats_materiels: str
    blessures: str
    temoins: Optional[str] = None


class AccidentTransportCreate(AccidentTransportBase):
    pass


class AccidentTransportUpdate(BaseModel):
    enqueteur_id: Optional[int] = None
    rapport_enquete: Optional[str] = None
    conclusions: Optional[str] = None
    actions_correctives: Optional[str] = None
    statut: Optional[str] = None


class AccidentTransportResponse(AccidentTransportBase):
    id: int
    enqueteur_id: Optional[int] = None
    rapport_enquete: Optional[str] = None
    conclusions: Optional[str] = None
    actions_correctives: Optional[str] = None
    date_enquete: Optional[datetime] = None
    statut: str
    
    class Config:
        from_attributes = True


# MaintenancePreventive schemas
class MaintenancePreventiveBase(BaseModel):
    vehicule_id: int
    type_maintenance: str
    date_prevue: date
    kilometrage_prevu: int
    description: str


class MaintenancePreventiveCreate(MaintenancePreventiveBase):
    pass


class MaintenancePreventiveUpdate(BaseModel):
    date_execution: Optional[date] = None
    kilometrage_reel: Optional[int] = None
    cout: Optional[float] = None
    technicien: Optional[str] = None
    observations: Optional[str] = None
    statut: Optional[str] = None


class MaintenancePreventiveResponse(MaintenancePreventiveBase):
    id: int
    date_execution: Optional[date] = None
    kilometrage_reel: Optional[int] = None
    cout: Optional[float] = None
    technicien: Optional[str] = None
    observations: Optional[str] = None
    statut: str
    
    class Config:
        from_attributes = True


# PositionGPS schemas
class PositionGPSBase(BaseModel):
    vehicule_id: int
    latitude: float
    longitude: float
    vitesse: float
    direction: float
    horodatage: datetime


class PositionGPSCreate(PositionGPSBase):
    pass


class PositionGPSResponse(PositionGPSBase):
    id: int
    
    class Config:
        from_attributes = True


# ZoneGeofencing schemas
class ZoneGeofencingBase(BaseModel):
    nom_zone: str
    type_zone: str  # 'entree', 'sortie', 'interdiction'
    latitude_centre: float
    longitude_centre: float
    rayon_metres: float


class ZoneGeofencingCreate(ZoneGeofencingBase):
    pass


class ZoneGeofencingUpdate(BaseModel):
    statut: Optional[str] = None


class ZoneGeofencingResponse(ZoneGeofencingBase):
    id: int
    statut: str
    
    class Config:
        from_attributes = True


# EvenementVehicule schemas
class EvenementVehiculeBase(BaseModel):
    vehicule_id: int
    type_evenement: str
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class EvenementVehiculeCreate(EvenementVehiculeBase):
    pass


class EvenementVehiculeResponse(EvenementVehiculeBase):
    id: int
    date_evenement: datetime
    
    class Config:
        from_attributes = True


# KPI Response schemas
class CoutKmResponse(BaseModel):
    vehicule_id: int
    kilometres: float
    cout_total: float
    cout_par_km: float


class AnomalieCarburantResponse(BaseModel):
    consommation_actuelle: float
    consommation_theorique: float
    difference: float
    pourcentage_difference: float
    anomalie_detectee: bool
    niveau_alerte: str


class PerformanceSousTraitantResponse(BaseModel):
    sous_traitant_id: int
    note: float
    missions: int
    missions_completees: int
    taux_completion: float
    retard_moyen_jours: float


class StatistiquesAccidentsResponse(BaseModel):
    total_accidents: int
    avec_blessures: int
    avec_degats_materiels: int
    taux_avec_blessures: float


class ComportementConducteurResponse(BaseModel):
    conducteur_id: int
    heures_conduite: float
    accidents: int
    violations_geofence: int
    score_comportement: float
    niveau: str


class KPITransportResponse(BaseModel):
    taux_livraison_ponctuelle: float
    taux_utilisation_vehicules: float
    variance_carburant: dict
