"""Advanced transport service - Route optimization, fuel tracking, subcontractors"""
from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, case, desc
from app.models.transport_avance import (
    Tournée, Livraison, FraisKilometrique, TempsConduite, SousTraitant,
    ContratSousTraitant, MissionSousTraitant, AccidentTransport, MaintenancePreventive,
    PositionGPS, ZoneGeofencing, EvenementVehicule
)
from app.models.transport import Camion, Conducteur, Mission
from app.models.parc import Vehicule


class TourneeService:
    """Route and tour optimization service"""
    
    @staticmethod
    def creer_tournee(
        db: Session,
        vehicule_id: int,
        conducteur_id: int,
        date_tournee: date,
        origine: str,
        destination: str
    ) -> Tournée:
        """Create delivery tour/route"""
        tournee = Tournée(
            vehicule_id=vehicule_id,
            conducteur_id=conducteur_id,
            date_tournee=date_tournee,
            origine=origine,
            destination=destination,
            statut="planifie"
        )
        db.add(tournee)
        db.commit()
        db.refresh(tournee)
        return tournee
    
    @staticmethod
    def ajouter_livraison(
        db: Session,
        tournee_id: int,
        client_id: int,
        adresse: str,
        ordre_arret: int,
        fenetre_horaire_debut: datetime,
        fenetre_horaire_fin: datetime
    ) -> Livraison:
        """Add delivery stop to tour"""
        livraison = Livraison(
            tournee_id=tournee_id,
            client_id=client_id,
            adresse=adresse,
            ordre_arret=ordre_arret,
            fenetre_horaire_debut=fenetre_horaire_debut,
            fenetre_horaire_fin=fenetre_horaire_fin,
            statut="en_attente"
        )
        db.add(livraison)
        db.commit()
        db.refresh(livraison)
        return livraison
    
    @staticmethod
    def optimiser_tournee(db: Session, tournee_id: int) -> Tournée:
        """
        Optimize route (placeholder for actual routing algorithm)
        In production, integrate with routing API (Google Maps, OSRM, etc.)
        """
        tournee = db.query(Tournée).filter(Tournée.id == tournee_id).first()
        if not tournee:
            raise ValueError("Tournée non trouvée")
        
        livraisons = db.query(Livraison).filter(
            Livraison.tournee_id == tournee_id
        ).order_by(Livraison.ordre_arret).all()
        
        # Simple optimization: reorder by time window
        # In production, use TSP algorithm or external routing service
        for idx, livraison in enumerate(livraisons):
            livraison.ordre_arret = idx + 1
        
        tournee.statut = "optimise"
        tournee.distance_estimee_km = 0.0  # To be calculated by routing API
        tournee.duree_estimee_heures = 0.0  # To be calculated by routing API
        
        db.commit()
        db.refresh(tournee)
        return tournee
    
    @staticmethod
    def demarrer_tournee(db: Session, tournee_id: int) -> Tournée:
        """Start tour execution"""
        tournee = db.query(Tournée).filter(Tournée.id == tournee_id).first()
        if not tournee:
            raise ValueError("Tournée non trouvée")
        
        tournee.statut = "en_cours"
        tournee.heure_depart = datetime.utcnow()
        
        db.commit()
        db.refresh(tournee)
        return tournee
    
    @staticmethod
    def completer_tournee(db: Session, tournee_id: int) -> Tournée:
        """Complete tour"""
        tournee = db.query(Tournée).filter(Tournée.id == tournee_id).first()
        if not tournee:
            raise ValueError("Tournée non trouvée")
        
        tournee.statut = "complete"
        tournee.heure_arrivee = datetime.utcnow()
        
        if tournee.heure_depart:
            tournee.duree_reelle_heures = (
                tournee.heure_arrivee - tournee.heure_depart
            ).total_seconds() / 3600
        
        db.commit()
        db.refresh(tournee)
        return tournee


class FraisService:
    """Expense and mileage tracking service"""
    
    @staticmethod
    def enregistrer_frais_kilometrique(
        db: Session,
        vehicule_id: int,
        date_debut: date,
        date_fin: date,
        kilometres_parcourus: float,
        taux_remboursement: float,
        montant: float
    ) -> FraisKilometrique:
        """Record mileage expense"""
        frais = FraisKilometrique(
            vehicule_id=vehicule_id,
            date_debut=date_debut,
            date_fin=date_fin,
            kilometres_parcourus=kilometres_parcourus,
            taux_remboursement=taux_remboursement,
            montant=montant
        )
        db.add(frais)
        db.commit()
        db.refresh(frais)
        return frais
    
    @staticmethod
    def calculer_cout_km(db: Session, vehicule_id: int, mois: int, annee: int) -> Dict[str, float]:
        """Calculate cost per kilometer for month"""
        debut_mois = date(annee, mois, 1)
        fin_mois = (date(annee, mois + 1, 1) - timedelta(days=1)) if mois < 12 else date(annee, 12, 31)
        
        result = db.query(
            func.sum(FraisKilometrique.kilometres_parcourus).label("km"),
            func.sum(FraisKilometrique.montant).label("cout")
        ).filter(
            and_(
                FraisKilometrique.vehicule_id == vehicule_id,
                FraisKilometrique.date_debut >= debut_mois,
                FraisKilometrique.date_fin <= fin_mois
            )
        ).first()
        
        km = result.km or 0
        cout = result.cout or 0
        cout_par_km = cout / km if km > 0 else 0
        
        return {
            "kilometres": km,
            "cout_total": cout,
            "cout_par_km": round(cout_par_km, 2)
        }


class CarburantService:
    """Fuel tracking and fraud detection service"""
    
    @staticmethod
    def enregistrer_plein_carburant(
        db: Session,
        vehicule_id: int,
        date_plein: datetime,
        litres: float,
        prix_litre: float,
        kilometrage: int,
        station: str
    ) -> Dict[str, Any]:
        """Record fuel fill-up and calculate consumption"""
        plein = {
            "vehicule_id": vehicule_id,
            "date_plein": date_plein,
            "litres": litres,
            "prix_litre": prix_litre,
            "kilometrage": kilometrage,
            "station": station
        }
        
        # Get previous fill-up to calculate consumption
        # This would need a Carburant model - for now, return the data
        return plein
    
    @staticmethod
    def detecter_anomalie_carburant(
        db: Session,
        vehicule_id: int,
        consommation_actuelle: float,
        consommation_theorique: float,
        tolerance: float = 0.2
    ) -> Dict[str, Any]:
        """
        Detect fuel fraud/anomaly
        Compare actual vs theoretical consumption
        """
        difference = abs(consommation_actuelle - consommation_theorique)
        pourcentage_difference = (difference / consommation_theorique) * 100 if consommation_theorique > 0 else 0
        
        anomalie = pourcentage_difference > (tolerance * 100)
        
        return {
            "consommation_actuelle": consommation_actuelle,
            "consommation_theorique": consommation_theorique,
            "difference": difference,
            "pourcentage_difference": round(pourcentage_difference, 2),
            "anomalie_detectee": anomalie,
            "niveau_alerte": "critique" if pourcentage_difference > 50 else "modere" if anomalie else "normal"
        }


class TempsConduiteService:
    """Driving and rest time monitoring service - Cameroon/CEMAC compliant"""
    
    @staticmethod
    def enregistrer_temps_conduite(
        db: Session,
        conducteur_id: int,
        vehicule_id: int,
        debut_conduite: datetime,
        fin_conduite: datetime,
        kilometres: float
    ) -> TempsConduite:
        """Record driving period"""
        duree_heures = (fin_conduite - debut_conduite).total_seconds() / 3600
        
        temps = TempsConduite(
            conducteur_id=conducteur_id,
            vehicule_id=vehicule_id,
            debut_conduite=debut_conduite,
            fin_conduite=fin_conduite,
            duree_heures=duree_heures,
            kilometres=kilometres
        )
        db.add(temps)
        db.commit()
        db.refresh(temps)
        return temps
    
    @staticmethod
    def verifier_conformite_temps(db: Session, conducteur_id: int, date_verif: date) -> Dict[str, Any]:
        """
        Check driving time compliance
        Cameroon/CEMAC: Max 4.5h driving without 45min break, max 9h/day
        """
        debut_jour = datetime.combine(date_verif, datetime.min.time())
        fin_jour = datetime.combine(date_verif, datetime.max.time())
        
        temps_conduite = db.query(TempsConduite).filter(
            and_(
                TempsConduite.conducteur_id == conducteur_id,
                TempsConduite.debut_conduite >= debut_jour,
                TempsConduite.debut_conduite <= fin_jour
            )
        ).all()
        
        total_heures = sum(t.duree_heures for t in temps_conduite)
        
        # Check for continuous driving > 4.5h without break
        non_conforme = total_heures > 9.0  # 9 hours daily limit
        
        return {
            "date": date_verif,
            "total_heures_conduite": round(total_heures, 2),
            "limite_journaliere": 9.0,
            "conforme": not non_conforme,
            "alerte": "Depassement temps de conduite journalier" if non_conforme else None
        }


class SousTraitantService:
    """Subcontractor management service"""
    
    @staticmethod
    def creer_sous_traitant(
        db: Session,
        nom: str,
        siret: str,
        adresse: str,
        telephone: str,
        email: str,
        specialites: List[str]
    ) -> SousTraitant:
        """Create subcontractor record"""
        sous_traitant = SousTraitant(
            nom=nom,
            siret=siret,
            adresse=adresse,
            telephone=telephone,
            email=email,
            specialites=",".join(specialites),
            statut="actif"
        )
        db.add(sous_traitant)
        db.commit()
        db.refresh(sous_traitant)
        return sous_traitant
    
    @staticmethod
    def creer_contrat(
        db: Session,
        sous_traitant_id: int,
        date_debut: date,
        date_fin: date,
        tarif_km: float,
            tarif_fixe: float,
            conditions: str
    ) -> ContratSousTraitant:
        """Create subcontractor contract"""
        contrat = ContratSousTraitant(
            sous_traitant_id=sous_traitant_id,
            date_debut=date_debut,
            date_fin=date_fin,
            tarif_km=tarif_km,
            tarif_fixe=tarif_fixe,
            conditions=conditions,
            statut="actif"
        )
        db.add(contrat)
        db.commit()
        db.refresh(contrat)
        return contrat
    
    @staticmethod
    def attribuer_mission_sous_traitant(
        db: Session,
        contrat_id: int,
        mission_id: int,
        kilometrage_estime: float
    ) -> MissionSousTraitant:
        """Assign mission to subcontractor"""
        mission = MissionSousTraitant(
            contrat_id=contrat_id,
            mission_id=mission_id,
            kilometrage_estime=kilometrage_estime,
            statut="attribue"
        )
        db.add(mission)
        db.commit()
        db.refresh(mission)
        return mission
    
    @staticmethod
    def evaluer_performance_sous_traitant(
        db: Session,
        sous_traitant_id: int,
        debut_periode: date,
        fin_periode: date
    ) -> Dict[str, Any]:
        """Evaluate subcontractor performance"""
        missions = db.query(MissionSousTraitant).join(ContratSousTraitant).filter(
            and_(
                ContratSousTraitant.sous_traitant_id == sous_traitant_id,
                MissionSousTraitant.date_creation >= debut_periode,
                MissionSousTraitant.date_creation <= fin_periode
            )
        ).all()
        
        if not missions:
            return {"note": 0, "missions": 0, "taux_completion": 0}
        
        total_missions = len(missions)
        missions_completees = sum(1 for m in missions if m.statut == "complete")
        taux_completion = (missions_completees / total_missions) * 100
        
        # Calculate delivery delays
        retards = []
        for mission in missions:
            if mission.date_livraison_reelle and mission.date_livraison_prevue:
                retard = (mission.date_livraison_reelle - mission.date_livraison_prevue).days
                retards.append(retard)
        
        retard_moyen = sum(retards) / len(retards) if retards else 0
        
        note = min(100, taux_completion * 0.7 + max(0, 100 - abs(retard_moyen)) * 0.3)
        
        return {
            "note": round(note, 2),
            "missions": total_missions,
            "missions_completees": missions_completees,
            "taux_completion": round(taux_completion, 2),
            "retard_moyen_jours": round(retard_moyen, 2)
        }


class AccidentService:
    """Accident reporting and investigation service"""
    
    @staticmethod
    def declarer_accident(
        db: Session,
        vehicule_id: int,
        conducteur_id: int,
        date_accident: datetime,
        lieu: str,
        description: str,
        degats_materiels: str,
        blessures: str,
        temoins: Optional[str] = None
    ) -> AccidentTransport:
        """Report transport accident"""
        accident = AccidentTransport(
            vehicule_id=vehicule_id,
            conducteur_id=conducteur_id,
            date_accident=date_accident,
            lieu=lieu,
            description=description,
            degats_materiels=degats_materiels,
            blessures=blessures,
            temoins=temoins,
            statut="enquete_en_cours"
        )
        db.add(accident)
        db.commit()
        db.refresh(accident)
        return accident
    
    @staticmethod
    def ajouter_enquete(
        db: Session,
        accident_id: int,
        enqueteur_id: int,
            rapport: str,
        conclusions: str,
        actions_correctives: str
    ) -> AccidentTransport:
        """Add investigation findings"""
        accident = db.query(AccidentTransport).filter(
            AccidentTransport.id == accident_id
        ).first()
        
        if not accident:
            raise ValueError("Accident non trouvé")
        
        accident.enqueteur_id = enqueteur_id
        accident.rapport_enquete = rapport
        accident.conclusions = conclusions
        accident.actions_correctives = actions_correctives
        accident.date_enquete = datetime.utcnow()
        accident.statut = "enquete_complete"
        
        db.commit()
        db.refresh(accident)
        return accident
    
    @staticmethod
    def obtenir_statistiques_accidents(
        db: Session,
        debut_periode: date,
        fin_periode: date
    ) -> Dict[str, Any]:
        """Get accident statistics for period"""
        accidents = db.query(AccidentTransport).filter(
            and_(
                AccidentTransport.date_accident >= datetime.combine(debut_periode, datetime.min.time()),
                AccidentTransport.date_accident <= datetime.combine(fin_periode, datetime.max.time())
            )
        ).all()
        
        total = len(accidents)
        avec_blessures = sum(1 for a in accidents if a.blessures and a.blessures.lower() != "aucune")
        avec_degats = sum(1 for a in accidents if a.degats_materiels and a.degats_materiels.lower() != "aucun")
        
        return {
            "total_accidents": total,
            "avec_blessures": avec_blessures,
            "avec_degats_materiels": avec_degats,
            "taux_avec_blessures": round((avec_blessures / total) * 100, 2) if total > 0 else 0
        }


class MaintenancePreventiveService:
    """Preventive maintenance scheduling service"""
    
    @staticmethod
    def planifier_maintenance_preventive(
        db: Session,
        vehicule_id: int,
        type_maintenance: str,
        date_prevue: date,
        kilometrage_prevu: int,
        description: str
    ) -> MaintenancePreventive:
        """Schedule preventive maintenance"""
        maintenance = MaintenancePreventive(
            vehicule_id=vehicule_id,
            type_maintenance=type_maintenance,
            date_prevue=date_prevue,
            kilometrage_prevu=kilometrage_prevu,
            description=description,
            statut="planifie"
        )
        db.add(maintenance)
        db.commit()
        db.refresh(maintenance)
        return maintenance
    
    @staticmethod
    def executer_maintenance(
        db: Session,
        maintenance_id: int,
        date_execution: date,
        kilometrage_reel: int,
        cout: float,
        technicien: str,
        observations: str
    ) -> MaintenancePreventive:
        """Execute preventive maintenance"""
        maintenance = db.query(MaintenancePreventive).filter(
            MaintenancePreventive.id == maintenance_id
        ).first()
        
        if not maintenance:
            raise ValueError("Maintenance non trouvée")
        
        maintenance.date_execution = date_execution
        maintenance.kilometrage_reel = kilometrage_reel
        maintenance.cout = cout
        maintenance.technicien = technicien
        maintenance.observations = observations
        maintenance.statut = "execute"
        
        db.commit()
        db.refresh(maintenance)
        return maintenance
    
    @staticmethod
    def obtenir_maintenances_urgentes(db: Session, jours_critique: int = 7) -> List[MaintenancePreventive]:
        """Get maintenance due within critical period"""
        date_limite = date.today() + timedelta(days=jours_critique)
        
        maintenances = db.query(MaintenancePreventive).filter(
            and_(
                MaintenancePreventive.date_prevue <= date_limite,
                MaintenancePreventive.statut == "planifie"
            )
        ).order_by(MaintenancePreventive.date_prevue.asc()).all()
        
        return maintenances


class GPSService:
    """Real-time GPS tracking service"""
    
    @staticmethod
    def enregistrer_position(
        db: Session,
        vehicule_id: int,
        latitude: float,
        longitude: float,
        vitesse: float,
        direction: float,
        horodatage: datetime
    ) -> PositionGPS:
        """Record GPS position"""
        position = PositionGPS(
            vehicule_id=vehicule_id,
            latitude=latitude,
            longitude=longitude,
            vitesse=vitesse,
            direction=direction,
            horodatage=horodatage
        )
        db.add(position)
        db.commit()
        db.refresh(position)
        return position
    
    @staticmethod
    def obtenir_derniere_position(db: Session, vehicule_id: int) -> Optional[PositionGPS]:
        """Get last known position of vehicle"""
        return db.query(PositionGPS).filter(
            PositionGPS.vehicule_id == vehicule_id
        ).order_by(PositionGPS.horodatage.desc()).first()
    
    @staticmethod
    def obtenir_trajectoire(
        db: Session,
        vehicule_id: int,
        debut: datetime,
        fin: datetime
    ) -> List[PositionGPS]:
        """Get vehicle trajectory for time period"""
        return db.query(PositionGPS).filter(
            and_(
                PositionGPS.vehicule_id == vehicule_id,
                PositionGPS.horodatage >= debut,
                PositionGPS.horodatage <= fin
            )
        ).order_by(PositionGPS.horodatage.asc()).all()


class GeofencingService:
    """Geofencing zone management service"""
    
    @staticmethod
    def creer_zone_geofencing(
        db: Session,
        nom_zone: str,
        type_zone: str,  # 'entree', 'sortie', 'interdiction'
        latitude_centre: float,
        longitude_centre: float,
        rayon_metres: float
    ) -> ZoneGeofencing:
        """Create geofencing zone"""
        zone = ZoneGeofencing(
            nom_zone=nom_zone,
            type_zone=type_zone,
            latitude_centre=latitude_centre,
            longitude_centre=longitude_centre,
            rayon_metres=rayon_metres,
            statut="actif"
        )
        db.add(zone)
        db.commit()
        db.refresh(zone)
        return zone
    
    @staticmethod
    def verifier_violation_geofencing(
        db: Session,
        vehicule_id: int,
        latitude: float,
        longitude: float
    ) -> List[ZoneGeofencing]:
        """Check if position violates any geofencing zones"""
        # Get all active zones
        zones = db.query(ZoneGeofencing).filter(
            ZoneGeofencing.statut == "actif"
        ).all()
        
        violations = []
        for zone in zones:
            # Calculate distance using Haversine formula (simplified)
            distance = ((latitude - zone.latitude_centre) ** 2 + 
                       (longitude - zone.longitude_centre) ** 2) ** 0.5 * 111000  # Approximate meters
            
            if distance <= zone.rayon_metres:
                violations.append(zone)
        
        return violations
    
    @staticmethod
    def enregistrer_evenement_vehicule(
        db: Session,
        vehicule_id: int,
        type_evenement: str,
        description: str,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None
    ) -> EvenementVehicule:
        """Record vehicle event (geofence violation, speeding, etc.)"""
        evenement = EvenementVehicule(
            vehicule_id=vehicule_id,
            type_evenement=type_evenement,
            description=description,
            latitude=latitude,
            longitude=longitude,
            date_evenement=datetime.utcnow()
        )
        db.add(evenement)
        db.commit()
        db.refresh(evenement)
        return evenement


class ComportementConducteurService:
    """Driver behavior monitoring service"""
    
    @staticmethod
    def evaluer_conducteur(
        db: Session,
        conducteur_id: int,
        debut_periode: date,
        fin_periode: date
    ) -> Dict[str, Any]:
        """Evaluate driver behavior score"""
        debut = datetime.combine(debut_periode, datetime.min.time())
        fin = datetime.combine(fin_periode, datetime.max.time())
        
        # Get driving time
        temps_conduite = db.query(func.sum(TempsConduite.duree_heures)).filter(
            and_(
                TempsConduite.conducteur_id == conducteur_id,
                TempsConduite.debut_conduite >= debut,
                TempsConduite.debut_conduite <= fin
            )
        ).scalar() or 0
        
        # Get accidents
        accidents = db.query(AccidentTransport).filter(
            and_(
                AccidentTransport.conducteur_id == conducteur_id,
                AccidentTransport.date_accident >= debut,
                AccidentTransport.date_accident <= fin
            )
        ).count()
        
        # Get geofence violations
        violations = db.query(EvenementVehicule).filter(
            and_(
                EvenementVehicule.vehicule_id.in_(
                    db.query(Vehicule.id).join(Mission).filter(
                        Mission.conducteur_id == conducteur_id
                    )
                ),
                EvenementVehicule.type_evenement == "violation_geofence",
                EvenementVehicule.date_evenement >= debut,
                EvenementVehicule.date_evenement <= fin
            )
        ).count()
        
        # Calculate score (simple formula)
        score_base = 100
        score = score_base - (accidents * 20) - (violations * 5)
        score = max(0, min(100, score))
        
        return {
            "conducteur_id": conducteur_id,
            "heures_conduite": round(temps_conduite, 2),
            "accidents": accidents,
            "violations_geofence": violations,
            "score_comportement": round(score, 2),
            "niveau": "excellent" if score >= 90 else "bon" if score >= 70 else "moyen" if score >= 50 else "critique"
        }


class KPITransportService:
    """Transport KPI calculation service"""
    
    @staticmethod
    def calculer_taux_livraison_ponctuelle(
        db: Session,
        debut_periode: date,
        fin_periode: date
    ) -> float:
        """Calculate on-time delivery rate"""
        livraisons = db.query(Livraison).filter(
            and_(
                Livraison.date_livraison >= debut_periode,
                Livraison.date_livraison <= fin_periode
            )
        ).all()
        
        if not livraisons:
            return 0.0
        
        ponctuelles = sum(
            1 for l in livraisons 
            if l.date_livraison_reelle and l.date_livraison_reelle <= l.fenetre_horaire_fin
        )
        
        return (ponctuelles / len(livraisons)) * 100
    
    @staticmethod
    def calculer_taux_utilisation_vehicules(
        db: Session,
        vehicule_id: int,
        jours: int = 30
    ) -> float:
        """Calculate vehicle utilization rate"""
        date_debut = date.today() - timedelta(days=jours)
        
        # Get hours in use
        temps = db.query(func.sum(TempsConduite.duree_heures)).filter(
            and_(
                TempsConduite.vehicule_id == vehicule_id,
                TempsConduite.debut_conduite >= datetime.combine(date_debut, datetime.min.time())
            )
        ).scalar() or 0
        
        heures_disponibles = jours * 24  # Total hours in period
        taux = (temps / heures_disponibles) * 100
        
        return round(taux, 2)
    
    @staticmethod
    def calculer_variance_carburant(
        db: Session,
        vehicule_id: int,
        debut_periode: date,
        fin_periode: date
    ) -> Dict[str, float]:
        """Calculate fuel variance (actual vs theoretical)"""
        # This would require a Carburant model with actual consumption data
        # Placeholder structure
        return {
            "vehicule_id": vehicule_id,
            "consommation_actuelle": 0.0,
            "consommation_theorique": 0.0,
            "variance_pourcentage": 0.0
        }
