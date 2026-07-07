# app/services/transport_service.py - Service métier pour le module K-Transport
from decimal import Decimal
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime

from app.models.transport import (
    CamionFlotte, ChauffeurProfil, MissionTransport,
    StatutMission, StatutCamion, PanneVehicule, StatutPanne,
    VehiculeDocument, ChauffeurDocument
)
from app.models.magasin import BandeLivraison
from app.schemas.transport import (
    CamionFlotteCreate, CamionFlotteUpdate,
    ChauffeurProfilCreate, ChauffeurProfilUpdate,
    MissionCreate, MissionUpdate, PanneVehiculeUpdate
)
from app.schemas.magasin import BandeLivraisonCreate, BandeLivraisonUpdate
from app.utils.audit import AuditService
from app.utils.logger import get_logger
from app.utils.cache import cache_service, invalidate_cache_pattern

logger = get_logger(__name__)

# Seuil alerte siphonnage carburant (10%)
SEUIL_ECART_CARBURANT = Decimal('0.10')


class CamionFlotteService:
    """Service pour la gestion de la flotte de camions"""

    @staticmethod
    def get_all_camions(db: Session, skip: int = 0, limit: int = 100) -> List[CamionFlotte]:
        cache_key = f"transport:camions:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(CamionFlotte).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_camion(db: Session, camion_id: int) -> Optional[CamionFlotte]:
        cache_key = f"transport:camion:{camion_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(CamionFlotte).filter(CamionFlotte.id == camion_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_camions_disponibles(db: Session) -> List[CamionFlotte]:
        cache_key = "transport:camions:disponibles"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(CamionFlotte).filter(
            CamionFlotte.statut == StatutCamion.DISPONIBLE
        ).all()
        cache_service.set(cache_key, result, expire=180)
        return result

    @staticmethod
    def create_camion(db: Session, camion: CamionFlotteCreate, cree_par: str) -> CamionFlotte:
        db_camion = CamionFlotte(**camion.dict(), cree_par=cree_par)
        db.add(db_camion)
        db.commit()
        db.refresh(db_camion)
        
        # Invalider le cache
        invalidate_cache_pattern("transport:camions:*")
        
        logger.info(f"Camion créé: {db_camion.immatriculation}", extra={"camion_id": db_camion.id})
        return db_camion

    @staticmethod
    def update_camion(db: Session, camion_id: int, camion: CamionFlotteUpdate) -> Optional[CamionFlotte]:
        db_camion = CamionFlotteService.get_camion(db, camion_id)
        if db_camion:
            for field, value in camion.dict(exclude_unset=True).items():
                setattr(db_camion, field, value)
            db.commit()
            db.refresh(db_camion)
            
            # Invalider le cache
            invalidate_cache_pattern("transport:camions:*")
        return db_camion

    @staticmethod
    def delete_camion(db: Session, camion_id: int) -> bool:
        db_camion = CamionFlotteService.get_camion(db, camion_id)
        if db_camion:
            db.delete(db_camion)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("transport:camions:*")
            return True
        return False

    @staticmethod
    def mettre_en_maintenance(db: Session, camion_id: int) -> Optional[CamionFlotte]:
        """Met le camion en maintenance"""
        db_camion = CamionFlotteService.get_camion(db, camion_id)
        if db_camion:
            db_camion.statut = StatutCamion.EN_MAINTENANCE
            db.commit()
            db.refresh(db_camion)
            
            # Invalider le cache
            invalidate_cache_pattern("transport:camions:*")
        return db_camion

    @staticmethod
    def mettre_disponible(db: Session, camion_id: int) -> Optional[CamionFlotte]:
        """Met le camion disponible s'il n'a pas de pannes non résolues"""
        # Vérifier s'il y a des pannes non résolues
        pannes_actives = db.query(PanneVehicule).filter(
            PanneVehicule.vehicule_id == camion_id,
            PanneVehicule.statut.in_([StatutPanne.A_REPARER, StatutPanne.EN_COURS])
        ).count()
        
        if pannes_actives > 0:
            raise ValueError("Impossible de rendre le camion disponible : pannes non résolues.")

        db_camion = CamionFlotteService.get_camion(db, camion_id)
        if db_camion:
            db_camion.statut = StatutCamion.DISPONIBLE
            db.commit()
            db.refresh(db_camion)
            
            # Invalider le cache
            invalidate_cache_pattern("transport:camions:*")
        return db_camion


class ChauffeurProfilService:
    """Service pour la gestion des profils chauffeurs"""

    @staticmethod
    def get_all_chauffeurs(db: Session, skip: int = 0, limit: int = 100) -> List[ChauffeurProfil]:
        cache_key = f"transport:chauffeurs:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(ChauffeurProfil).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_chauffeur(db: Session, chauffeur_id: int) -> Optional[ChauffeurProfil]:
        cache_key = f"transport:chauffeur:{chauffeur_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(ChauffeurProfil).filter(ChauffeurProfil.id == chauffeur_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_chauffeurs_disponibles(db: Session) -> List[ChauffeurProfil]:
        """Récupère les chauffeurs sans mission active"""
        cache_key = "transport:chauffeurs:disponibles"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        chauffeurs_actifs = db.query(MissionTransport.chauffeur_id).filter(
            MissionTransport.statut.in_([
                StatutMission.EN_CHARGEMENT,
                StatutMission.EN_ROUTE,
                StatutMission.EN_LIVRAISON,
            ])
        ).subquery()
        
        result = db.query(ChauffeurProfil).filter(
            ChauffeurProfil.id.notin_(chauffeurs_actifs)
        ).all()
        cache_service.set(cache_key, result, expire=180)
        return result

    @staticmethod
    def create_chauffeur(db: Session, chauffeur: ChauffeurProfilCreate, cree_par: str) -> ChauffeurProfil:
        db_chauffeur = ChauffeurProfil(**chauffeur.dict(), cree_par=cree_par)
        db.add(db_chauffeur)
        db.commit()
        db.refresh(db_chauffeur)
        
        # Invalider le cache
        invalidate_cache_pattern("transport:chauffeurs:*")
        
        logger.info(f"Chauffeur créé: {db_chauffeur.prenom} {db_chauffeur.nom}", extra={"chauffeur_id": db_chauffeur.id})
        return db_chauffeur

    @staticmethod
    def update_chauffeur(db: Session, chauffeur_id: int, chauffeur: ChauffeurProfilUpdate) -> Optional[ChauffeurProfil]:
        db_chauffeur = ChauffeurProfilService.get_chauffeur(db, chauffeur_id)
        if db_chauffeur:
            for field, value in chauffeur.dict(exclude_unset=True).items():
                setattr(db_chauffeur, field, value)
            db.commit()
            db.refresh(db_chauffeur)
            
            # Invalider le cache
            invalidate_cache_pattern("transport:chauffeurs:*")
        return db_chauffeur

    @staticmethod
    def delete_chauffeur(db: Session, chauffeur_id: int) -> bool:
        db_chauffeur = ChauffeurProfilService.get_chauffeur(db, chauffeur_id)
        if db_chauffeur:
            db.delete(db_chauffeur)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("transport:chauffeurs:*")
            return True
        return False


class MissionTransportService:
    """Service pour la gestion des missions de transport"""

    @staticmethod
    def get_all_missions(db: Session, skip: int = 0, limit: int = 100) -> List[MissionTransport]:
        cache_key = f"transport:missions:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(MissionTransport).options(
            selectinload(MissionTransport.camion),
            selectinload(MissionTransport.chauffeur)
        ).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_mission(db: Session, mission_id: int) -> Optional[MissionTransport]:
        cache_key = f"transport:mission:{mission_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(MissionTransport).options(
            selectinload(MissionTransport.camion),
            selectinload(MissionTransport.chauffeur)
        ).filter(MissionTransport.id == mission_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_missions_by_chauffeur(db: Session, chauffeur_id: int) -> List[MissionTransport]:
        cache_key = f"transport:missions:chauffeur:{chauffeur_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(MissionTransport).filter(MissionTransport.chauffeur_id == chauffeur_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_missions_by_client(db: Session, client_id: int) -> List[MissionTransport]:
        cache_key = f"transport:missions:client:{client_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(MissionTransport).filter(MissionTransport.tiers_id == client_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_missions_actives(db: Session) -> List[MissionTransport]:
        cache_key = "transport:missions:actives"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(MissionTransport).options(
            selectinload(MissionTransport.camion),
            selectinload(MissionTransport.chauffeur)
        ).filter(
            MissionTransport.statut.in_([
                StatutMission.EN_CHARGEMENT,
                StatutMission.EN_ROUTE,
                StatutMission.EN_LIVRAISON,
            ])
        ).all()
        cache_service.set(cache_key, result, expire=180)
        return result

    @staticmethod
    def create_mission(db: Session, mission: MissionCreate, cree_par: str) -> MissionTransport:
        # Valider les règles métier
        MissionTransportService.valider_creation_mission(db, mission)
        
        db_mission = MissionTransport(**mission.dict(), cree_par=cree_par)
        db.add(db_mission)
        
        # Mettre le camion en chargement
        camion = CamionFlotteService.get_camion(db, mission.camion_id)
        if camion:
            camion.statut = StatutCamion.EN_CHARGEMENT
        
        db.commit()
        db.refresh(db_mission)
        
        # Invalider le cache
        invalidate_cache_pattern("transport:missions:*")
        invalidate_cache_pattern("transport:camions:*")
        invalidate_cache_pattern("transport:chauffeurs:*")
        
        logger.info(f"Mission créée: {db_mission.reference}", extra={"mission_id": db_mission.id})
        return db_mission

    @staticmethod
    def update_mission(db: Session, mission_id: int, mission: MissionUpdate) -> Optional[MissionTransport]:
        db_mission = MissionTransportService.get_mission(db, mission_id)
        if db_mission:
            for field, value in mission.dict(exclude_unset=True).items():
                setattr(db_mission, field, value)
            db.commit()
            db.refresh(db_mission)
            
            # Invalider le cache
            invalidate_cache_pattern("transport:missions:*")
        return db_mission

    @staticmethod
    def delete_mission(db: Session, mission_id: int) -> bool:
        db_mission = MissionTransportService.get_mission(db, mission_id)
        if db_mission:
            db.delete(db_mission)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("transport:missions:*")
            return True
        return False

    @staticmethod
    def valider_creation_mission(db: Session, data: MissionCreate) -> None:
        """
        Règles métier AVANT création mission :
        1. Camion non déjà EN_ROUTE / EN_CHARGEMENT / BLOQUE_HSE / EN_MAINTENANCE
        2. Chauffeur non déjà assigné à une mission active
        3. Cohérence type_camion / nature_fret
        4. Garde-fou (Conformité Légale): Vérification de validité des documents (Camion, Remorque, Chauffeur)
        """
        from datetime import date
        from app.models.transport import VehiculeDocument, ChauffeurDocument
        today = date.today()

        # Règle 1 : tracteur disponible et non bloqué
        camion = CamionFlotteService.get_camion(db, data.camion_id)
        if not camion:
            raise ValueError("Tracteur introuvable")
        if camion.statut in (StatutCamion.EN_ROUTE, StatutCamion.EN_CHARGEMENT, StatutCamion.BLOQUE_HSE, StatutCamion.EN_MAINTENANCE):
            raise ValueError(f"Tracteur {camion.immatriculation} indisponible - statut : {camion.statut}")

        # Si remorque spécifiée, vérifier remorque
        remorque = None
        if data.remorque_id:
            remorque = CamionFlotteService.get_camion(db, data.remorque_id)
            if not remorque:
                raise ValueError("Remorque introuvable")
            if remorque.statut in (StatutCamion.EN_ROUTE, StatutCamion.EN_CHARGEMENT, StatutCamion.BLOQUE_HSE, StatutCamion.EN_MAINTENANCE):
                raise ValueError(f"Remorque {remorque.immatriculation} indisponible - statut : {remorque.statut}")

        # Règle 2 : chauffeur disponible
        mission_active = db.query(MissionTransport).filter(
            MissionTransport.chauffeur_id == data.chauffeur_id,
            MissionTransport.statut.in_([
                StatutMission.EN_CHARGEMENT,
                StatutMission.EN_ROUTE,
                StatutMission.EN_LIVRAISON,
            ])
        ).first()
        if mission_active:
            raise ValueError("Chauffeur déjà affecté à une mission en cours")

        # Règle 3 : cohérence type
        MissionTransportService._verifier_coherence_type(camion.type_vehicule, data.nature_fret)

        # Règle 4 : GARDE-FOU LÉGAL (Documents)
        # 4.a Documents Tracteur (Assurance, Visite Technique)
        docs_tracteur = db.query(VehiculeDocument).filter(VehiculeDocument.vehicule_id == data.camion_id).all()
        doc_types = [doc.type_document for doc in docs_tracteur]
        if 'ASSURANCE' not in doc_types or 'VISITE_TECHNIQUE' not in doc_types:
            raise ValueError(f"Le tracteur {camion.immatriculation} n'a pas tous les documents obligatoires enregistrés (ASSURANCE, VISITE_TECHNIQUE).")
        for doc in docs_tracteur:
            if doc.date_expiration < today:
                raise ValueError(f"Garde-fou: Document {doc.type_document} expiré pour le tracteur {camion.immatriculation} depuis le {doc.date_expiration}.")

        # 4.b Documents Remorque
        if data.remorque_id and remorque:
            docs_remorque = db.query(VehiculeDocument).filter(VehiculeDocument.vehicule_id == data.remorque_id).all()
            doc_types_rem = [doc.type_document for doc in docs_remorque]
            if 'ASSURANCE' not in doc_types_rem or 'VISITE_TECHNIQUE' not in doc_types_rem:
                raise ValueError(f"La remorque {remorque.immatriculation} n'a pas tous les documents obligatoires enregistrés.")
            for doc in docs_remorque:
                if doc.date_expiration < today:
                    raise ValueError(f"Garde-fou: Document {doc.type_document} expiré pour la remorque {remorque.immatriculation}.")

        # 4.c Documents Chauffeur (Permis, FIMO)
        docs_chauffeur = db.query(ChauffeurDocument).filter(ChauffeurDocument.chauffeur_id == data.chauffeur_id).all()
        doc_types_chauffeur = [doc.type_document for doc in docs_chauffeur]
        if 'PERMIS' not in doc_types_chauffeur or 'FIMO' not in doc_types_chauffeur:
            raise ValueError("Le chauffeur n'a pas les documents obligatoires enregistrés (PERMIS, FIMO).")
        for doc in docs_chauffeur:
            if doc.date_expiration < today:
                raise ValueError(f"Garde-fou: Document {doc.type_document} expiré pour le chauffeur depuis le {doc.date_expiration}.")

    @staticmethod
    def _verifier_coherence_type(type_vehicule: str, nature_fret: str) -> None:
        """Vérifie la compatibilité camion/marchandise selon les règles KAMLOG."""
        INCOMPATIBLES = {
            'BENNE_VRAC': {'CONTENEUR_20', 'CONTENEUR_40'},
            'PORTE_CONTENEUR': {'VRAC', 'CONVENTIONNEL'},
            'CITERNE': {'CONTENEUR_20', 'CONTENEUR_40', 'VRAC_SOLIDE'},
        }
        interdits = INCOMPATIBLES.get(type_vehicule, set())
        if nature_fret in interdits:
            raise ValueError(
                f'Incohérence : {type_vehicule} incompatible avec {nature_fret}'
            )

    @staticmethod
    def demarrer_mission(db: Session, mission_id: int) -> Optional[MissionTransport]:
        """Démarre une mission (EN_ROUTE)"""
        db_mission = MissionTransportService.get_mission(db, mission_id)
        if db_mission:
            db_mission.statut = StatutMission.EN_ROUTE
            
            # Mettre le camion en route
            camion = CamionFlotteService.get_camion(db, db_mission.camion_id)
            if camion:
                camion.statut = StatutCamion.EN_ROUTE
            
            db.commit()
            db.refresh(db_mission)
            
            # Invalider le cache
            invalidate_cache_pattern("transport:missions:*")
            invalidate_cache_pattern("transport:camions:*")
        return db_mission

    @staticmethod
    def terminer_mission(db: Session, mission_id: int) -> Optional[MissionTransport]:
        """Termine une mission (TERMINEE)"""
        db_mission = MissionTransportService.get_mission(db, mission_id)
        if db_mission:
            db_mission.statut = StatutMission.TERMINEE
            # Mettre le camion disponible
            camion = CamionFlotteService.get_camion(db, db_mission.camion_id)
            if camion:
                camion.statut = StatutCamion.DISPONIBLE
            db.commit()
            db.refresh(db_mission)
            invalidate_cache_pattern("transport:missions:*")
            invalidate_cache_pattern("transport:camions:*")
            invalidate_cache_pattern("transport:chauffeurs:*")
        return db_mission

    @staticmethod
    def valider_livraison(db: Session, mission_id: int, signature: str, nom_receptionnaire: str) -> Optional[MissionTransport]:
        """E-POD: Valider la livraison et déclencher la facturation."""
        from app.services.finance_service import FactureService
        
        db_mission = MissionTransportService.get_mission(db, mission_id)
        if not db_mission:
            raise ValueError("Mission introuvable.")
            
        if db_mission.statut in [StatutMission.LIVRE, StatutMission.FACTURE]:
            raise ValueError("Cette mission a déjà été livrée.")

        db_mission.statut = StatutMission.LIVRE
        db_mission.preuve_livraison_signature = signature
        db_mission.nom_receptionnaire = nom_receptionnaire
        db_mission.date_livraison_reelle = datetime.now()
        
        # Libérer les ressources
        camion = CamionFlotteService.get_camion(db, db_mission.camion_id)
        if camion:
            camion.statut = StatutCamion.DISPONIBLE
        
        # Générer automatiquement la facture (K-Finance)
        try:
            FactureService.generer_facture_transport(db, db_mission)
        except Exception as e:
            # On logge l'erreur mais on ne bloque pas l'EPOD
            from app.utils.logger import get_logger
            logger = get_logger(__name__)
            logger.error(f"Echec facturation auto pour mission {mission_id}: {str(e)}")

        db.commit()
        db.refresh(db_mission)
        
        invalidate_cache_pattern("transport:missions:*")
        invalidate_cache_pattern("transport:camions:*")
        invalidate_cache_pattern("transport:chauffeurs:*")
        
        return db_mission


class BandeLivraisonService:
    """Service pour la gestion des bandes de livraison"""

    @staticmethod
    def get_all_bandes(db: Session, skip: int = 0, limit: int = 100) -> List[BandeLivraison]:
        cache_key = f"transport:bandes:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(BandeLivraison).options(
            selectinload(BandeLivraison.mission)
        ).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_bande(db: Session, bande_id: int) -> Optional[BandeLivraison]:
        cache_key = f"transport:bande:{bande_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(BandeLivraison).filter(BandeLivraison.id == bande_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_bandes_by_mission(db: Session, mission_id: int) -> List[BandeLivraison]:
        cache_key = f"transport:bandes:mission:{mission_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(BandeLivraison).filter(BandeLivraison.mission_id == mission_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def create_bande(db: Session, bande: BandeLivraisonCreate, cree_par: str) -> BandeLivraison:
        db_bande = BandeLivraison(**bande.dict(), cree_par=cree_par)
        db.add(db_bande)
        db.commit()
        db.refresh(db_bande)
        
        # Invalider le cache
        invalidate_cache_pattern("transport:bandes:*")
        
        logger.info(f"Bande de livraison créée: {db_bande.numero_bande}", extra={"bande_id": db_bande.id})
        return db_bande

    @staticmethod
    def update_bande(db: Session, bande_id: int, bande: BandeLivraisonUpdate) -> Optional[BandeLivraison]:
        db_bande = BandeLivraisonService.get_bande(db, bande_id)
        if db_bande:
            for field, value in bande.dict(exclude_unset=True).items():
                setattr(db_bande, field, value)
            db.commit()
            db.refresh(db_bande)
            
            # Invalider le cache
            invalidate_cache_pattern("transport:bandes:*")
        return db_bande

    @staticmethod
    def delete_bande(db: Session, bande_id: int) -> bool:
        db_bande = BandeLivraisonService.get_bande(db, bande_id)
        if db_bande:
            db.delete(db_bande)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("transport:bandes:*")
            return True
        return False


def calculer_ecart_carburant(
    consommation_reelle_litres: Decimal,
    distance_km: Decimal,
    consommation_theorique_l_100: Decimal,
) -> Decimal:
    """Retourne le taux d'écart. Si > 10% → alerte siphonnage."""
    theorique = (distance_km / 100) * consommation_theorique_l_100
    if theorique == 0:
        return Decimal('0')
    return (consommation_reelle_litres - theorique).abs() / theorique


class PanneVehiculeService:
    """Service pour la gestion des pannes de véhicules"""

    @staticmethod
    def update_panne(db: Session, camion_id: int, panne_id: int, panne_update: PanneVehiculeUpdate) -> Optional[PanneVehicule]:
        db_panne = db.query(PanneVehicule).filter(
            PanneVehicule.id == panne_id,
            PanneVehicule.vehicule_id == camion_id
        ).first()
        
        if not db_panne:
            return None
            
        for field, value in panne_update.dict(exclude_unset=True).items():
            setattr(db_panne, field, value)
            
        db.commit()
        db.refresh(db_panne)
        return db_panne


class AlertesService:
    """Service pour gérer les alertes opérationnelles (documents, etc.)"""

    @staticmethod
    def get_expiring_documents(db: Session) -> dict:
        from datetime import date, timedelta
        target_date = date.today() + timedelta(days=30)
        
        vehicules_docs = db.query(VehiculeDocument).filter(
            VehiculeDocument.date_expiration <= target_date
        ).all()
        
        chauffeurs_docs = db.query(ChauffeurDocument).filter(
            ChauffeurDocument.date_expiration <= target_date
        ).all()
        
        return {
            "vehicules": vehicules_docs,
            "chauffeurs": chauffeurs_docs
        }


class AnalyticsService:
    @staticmethod
    def get_vehicles_history(db: Session, filters: dict = None) -> list[dict]:
        """
        Génère l'historique complet et la rentabilité de la flotte.
        Retourne une liste de véhicules avec leurs KPI aggrégés.
        """
        # On charge tous les camions avec leurs missions et chauffeurs associés
        query = db.query(CamionFlotte).options(
            selectinload(CamionFlotte.missions).selectinload(MissionTransport.chauffeur),
            selectinload(CamionFlotte.missions).selectinload(MissionTransport.tiers)
        )
        
        # Filtres de base sur le camion si nécessaire
        if filters and filters.get("statut"):
            query = query.filter(CamionFlotte.statut == filters["statut"])
            
        camions = query.all()
        result = []
        
        for camion in camions:
            missions = camion.missions
            
            # Filtres temporels ou par client applicables sur les missions
            if filters:
                if filters.get("date_debut"):
                    missions = [m for m in missions if m.date_creation and m.date_creation >= filters["date_debut"]]
                if filters.get("date_fin"):
                    missions = [m for m in missions if m.date_creation and m.date_creation <= filters["date_fin"]]
                if filters.get("client_id"):
                    missions = [m for m in missions if m.tiers_id == int(filters["client_id"])]
                if filters.get("chauffeur_id"):
                    missions = [m for m in missions if m.chauffeur_id == int(filters["chauffeur_id"])]

            total_missions = len(missions)
            revenus_totaux = sum([(m.montant_fret or Decimal('0')) for m in missions])
            depenses_totales = sum([((m.frais_peage or Decimal('0')) + (m.frais_annexes or Decimal('0'))) for m in missions])
            marge = revenus_totaux - depenses_totales
            
            # Extraire les clients et parcours uniques
            clients_uniques = list({m.tiers.raison_sociale for m in missions if m.tiers})
            parcours_uniques = list({f"{m.origine} - {m.destination}" for m in missions if m.origine and m.destination})
            chauffeurs_uniques = list({f"{m.chauffeur.nom} {m.chauffeur.prenom}" for m in missions if m.chauffeur})
            
            result.append({
                "camion": {
                    "id": camion.id,
                    "immatriculation": camion.immatriculation,
                    "marque": camion.marque,
                    "modele": camion.modele,
                    "statut": camion.statut
                },
                "kpis": {
                    "total_missions": total_missions,
                    "revenus_xaf": float(revenus_totaux),
                    "depenses_xaf": float(depenses_totales),
                    "marge_xaf": float(marge)
                },
                "details": {
                    "clients": clients_uniques,
                    "parcours": parcours_uniques,
                    "chauffeurs": chauffeurs_uniques
                }
            })
            
        return result

