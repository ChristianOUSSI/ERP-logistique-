"""
Advanced transport models - Complete logistics for Cameroon/CEMAC
Includes route optimization, fleet management, subcontractors, GPS tracking
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, Enum, Date, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class StatutTournée(str, enum.Enum):
    """Route status"""
    PLANIFIEE = "planifiee"
    EN_COURS = "en_cours"
    TERMINEE = "terminee"
    ANNULEE = "annulee"
    EN_RETARD = "en_retard"


class Tournée(Base):
    """Route optimization model - Delivery tours"""
    __tablename__ = "tours"
    
    id = Column(Integer, primary_key=True, index=True)
    numero_tournee = Column(String(50), unique=True, nullable=False)
    conducteur_id = Column(Integer, ForeignKey('conducteurs.id'), nullable=False)
    camion_id = Column(Integer, ForeignKey('camions.id'), nullable=False)
    date_tournee = Column(Date, nullable=False)
    statut = Column(Enum(StatutTournée), default=StatutTournée.PLANIFIEE)
    nombre_livraisons = Column(Integer, default=0)
    nombre_livraisons_effectuees = Column(Integer, default=0)
    distance_totale = Column(Numeric)
    duree_estimee = Column(Integer)  # En minutes
    duree_reelle = Column(Integer)
    cout_estime = Column(Numeric)
    cout_reel = Column(Numeric)
    performance = Column(Numeric)  # Pourcentage de livraisons réussies
    type_tournee = Column(String(50))  # urbaine, rurale, longue_distance
    notes = Column(Text)
    createur = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    conducteur = relationship("Conducteur")
    camion = relationship("Camion")
    livraisons = relationship("Livraison", back_populates="tournee")


class Livraison(Base):
    """Delivery model"""
    __tablename__ = "livraisons"
    
    id = Column(Integer, primary_key=True, index=True)
    numero_livraison = Column(String(50), unique=True, nullable=False)
    tournee_id = Column(Integer, ForeignKey('tours.id'), nullable=False)
    client_id = Column(Integer, ForeignKey('clients.id'), nullable=False)
    point_dechargement = Column(String(200), nullable=False)
    heure_debut_prevue = Column(String(10))
    heure_fin_prevue = Column(String(10))
    heure_debut_reelle = Column(String(10))
    heure_fin_reelle = Column(String(10))
    statut = Column(String(20), default="en_attente")  # en_attente, en_cours, livre, echoue, annule
    nombre_colis = Column(Integer, default=0)
    poids_total = Column(Numeric)
    preuve_livraison = Column(Text)  # Signature, photo
    commentaire = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    tournee = relationship("Tournée", back_populates="livraisons")
    client = relationship("Client")


class FraisKilometrique(Base):
    """Mileage expense model - Cameroon compliant"""
    __tablename__ = "frais_kilometriques"
    
    id = Column(Integer, primary_key=True, index=True)
    employe_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    mission_id = Column(Integer, ForeignKey('missions.id'))
    date_frais = Column(Date, server_default=func.current_date())
    kilometrage_parcouru = Column(Numeric, nullable=False)
    kilometrage_theorique = Column(Numeric)
    taux_indemnite = Column(Numeric, default=0)  # FCFA/km according to Cameroon rates
    montant_indemnite = Column(Numeric)
    economie_carburant = Column(Numeric)  # Fuel economy vs theoretical
    surconsommation = Column(Numeric)
    note_performance = Column(Numeric)
    statut = Column(String(20), default="en_attente")  # en_attente, valide, refuse
    validateur = Column(Integer, ForeignKey('users.id'))
    date_validation = Column(Date)
    commentaires = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    employe = relationship("User", foreign_keys=[employe_id])
    mission = relationship("Mission")


class TempsConduite(Base):
    """Driving time tracking model - Cameroon labor law compliant"""
    __tablename__ = "temps_conduite"
    
    id = Column(Integer, primary_key=True, index=True)
    conducteur_id = Column(Integer, ForeignKey('conducteurs.id'), nullable=False)
    mission_id = Column(Integer, ForeignKey('missions.id'))
    date = Column(Date, nullable=False)
    heure_debut_conduite = Column(String(10), nullable=False)
    heure_fin_conduite = Column(String(10))
    temps_conduite = Column(Integer)  # En minutes
    temps_repos = Column(Integer)  # En minutes
    temps_service = Column(Integer)  # En minutes
    depassement_temps = Column(Integer, default=0)  # En minutes
    conformite_legale = Column(Boolean, default=True)
    statut = Column(String(20), default="conforme")  # conforme, non_conforme, en_violation
    validateur = Column(Integer, ForeignKey('users.id'))
    commentaires = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    conducteur = relationship("Conducteur")
    mission = relationship("Mission")


class SousTraitant(Base):
    """Subcontractor model"""
    __tablename__ = "sous_traitants"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    nom = Column(String(100), nullable=False)
    type_service = Column(String(50))  # transport, logistique, manutention
    specialite = Column(String(100))
    numero_licence = Column(String(50))
    adresse = Column(Text)
    ville = Column(String(50))
    pays = Column(String(50), default="Cameroun")
    telephone = Column(String(20))
    email = Column(String(100))
    flotte_taille = Column(Integer)
    capacite_transport = Column(Numeric)  # Tonnes
    assurance_responsabilite_civile = Column(Numeric)
    statut = Column(String(20), default="actif")  # actif, inactif, suspendu
    date_debut_contrat = Column(Date)
    date_fin_contrat = Column(Date)
    evaluation_performance = Column(Numeric)  # Note 1-10
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    contrats = relationship("ContratSousTraitant", back_populates="sous_traitant")


class ContratSousTraitant(Base):
    """Subcontractor contract model"""
    __tablename__ = "contrats_sous_traitants"
    
    id = Column(Integer, primary_key=True, index=True)
    sous_traitant_id = Column(Integer, ForeignKey('sous_traitants.id'), nullable=False)
    numero_contrat = Column(String(50), unique=True, nullable=False)
    type_service = Column(String(50))
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date)
    tarif_unitaire = Column(Numeric)
    unite_tarif = Column(String(20))  # km, tonne, livraison
    volume_minimum = Column(Numeric)
    conditions_paiement = Column(Text)
    garanties = Column(Text)
    penalties = Column(Text)
    statut = Column(String(20), default="actif")  # actif, expire, resilie, suspendu
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    sous_traitant = relationship("SousTraitant", back_populates="contrats")


class MissionSousTraitant(Base):
    """Subcontractor mission model"""
    __tablename__ = "missions_sous_traitant"
    
    id = Column(Integer, primary_key=True, index=True)
    numero_mission = Column(String(50), unique=True, nullable=False)
    sous_traitant_id = Column(Integer, ForeignKey('sous_traitants.id'), nullable=False)
    contrat_id = Column(Integer, ForeignKey('contrats_sous_traitants.id'))
    client_id = Column(Date, nullable=False)
    date_mission = Column(Date, nullable=False)
    point_depart = Column(String(200), nullable=False)
    point_arrivee = Column(String(200), nullable=False)
    distance = Column(Numeric)
    type_marchandise = Column(String(100))
    poids = Column(Numeric)
    statut = Column(String(20), default="planifiee")  # planifie, en_cours, terminee, annulee
    cout_estime = Column(Numeric)
    cout_reel = Column(Numeric)
    qualite_service = Column(Numeric)  # Note 1-10
    ponctualite = Column(Numeric)  # Note 1-10
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    sous_traitant = relationship("SousTraitant")
    contrat = relationship("ContratSousTraitant")


class AccidentTransport(Base):
    """Transport accident model"""
    __tablename__ = "accidents_transport"
    
    id = Column(Integer, primary_key=True, index=True)
    numero_accident = Column(String(50), unique=True, nullable=False)
    vehicule_id = Column(Integer, ForeignKey('vehicules.id'), nullable=False)
    conducteur_id = Column(Integer, ForeignKey('conducteurs.id'), nullable=False)
    mission_id = Column(Integer, ForeignKey('missions.id'))
    date_accident = Column(DateTime(timezone=True), nullable=False)
    heure_accident = Column(String(10))
    lieu = Column(String(200), nullable=False)
    type_accident = Column(String(50))  # collision, renversement, blessure, materiel
    gravite = Column(String(20))  # legere, moyenne, grave, mortel
    blesses = Column(Integer, default=0)
    deces = Integer, default=0)
    degats_materiels = Column(Text)
    temoins = Column(Text)
    rapport_police = Column(String(100))
    constat = Column(Text)
    assureur = Column(String(100))
    numero_police = Column(String(50))
    montant_dommages = Column(Numeric)
    montant_rembourse = Column(Numeric)
    statut = Column(String(20), default="en_cours")  # en_cours, clos, en_litige
    date_clos = Column(Date)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    vehicule = relationship("Vehicule")
    conducteur = relationship("Conducteur")
    mission = relationship("Mission")


class MaintenancePreventive(Base):
    """Preventive maintenance scheduling model"""
    __tablename__ = "maintenances_preventives"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicule_id = Column(Integer, ForeignKey('vehicules.id'), nullable=False)
    type_maintenance = Column(String(50))  # vidange, filtre, pneumatique, general
    kilometrage_prevu = Column(Integer, nullable=False)
    date_prevue = Column(Date, nullable=False)
    date_effective = Column(Date)
    periodicite = Column(Integer)  # En jours/km
    statut = Column(String(20), default="planifie")  # planifie, realisee, reportee, annulee
    cout_estime = Column(Numeric)
    cout_reel = Column(Numeric)
    realise_par = Column(String(100))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    vehicule = relationship("Vehicule")


class PositionGPS(Base):
    """GPS tracking model - Real-time fleet tracking"""
    __tablename__ = "positions_gps"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicule_id = Column(Integer, ForeignKey('vehicules.id'), nullable=False)
    conducteur_id = Column(Integer, ForeignKey('conducteurs.id'))
    latitude = Column(Numeric, nullable=False)
    longitude = Column(Numeric, nullable=False)
    altitude = Column(Numeric)
    vitesse = Column(Numeric, default=0)
    direction = Column(Numeric)  # En degrés 0-360
    horodatage = Column(DateTime(timezone=True), server_default=func.now())
    statut_moteur = Column(String(20))  # allume, eteint, demarre
    statut_vehicule = Column(String(20))  # en_mouvement, arrete, garage
    kilmetrage_actuel = Column(Integer)
    niveau_carburant = Column(Integer)  # Pourcentage
    niveau_huile = Column(Integer)  # Pourcentage
    temperature_moteur = Column(Numeric)
    code_zone = Column(String(50))  # Geofencing zone
    alerte = Column(Text)  # Zone exit, speeding, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    vehicule = relationship("Vehicule")
    conducteur = relationship("Conducteur")


class ZoneGeofencing(Base):
    """Geofencing zone model"""
    __tablename__ = "zones_geofencing"
    
    id = Column(Integer, primary_key=True, index=True)
    nom_zone = Column(String(100), nullable=False)
    type_zone = Column(String(50))  # client, danger, interdit, autorise
    description = Column(Text)
    latitude_centre = Column(Numeric, nullable=False)
    longitude_centre = Column(Numeric, nullable=False)
    rayon = Column(Numeric, nullable=False)  # En mètres
    ville = Column(String(50))
    pays = Column(String(50), default="Cameroun")
    alerte_entree = Column(Boolean, default=True)
    alerte_sortie = Column(Boolean, default=True)
    limite_vitesse = Column(Integer)  # km/h
    statut = Column(String(20), default="actif")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class EvenementVehicule(Base):
    """Vehicle event model"""
    __tablename__ = "evenements_vehicule"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicule_id = Column(Integer, ForeignKey('vehicules.id'), nullable=False)
    type_evenement = Column(String(50))  # demarrage, arret, ouverture_porte, fermeture_porte
    date_evenement = Column(DateTime(timezone=True), server_default=func.now())
    localisation = Column(String(200))
    operateur = Column(String(100))
    description = Column(Text)
    pieces_jointes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    vehicule = relationship("Vehicule")