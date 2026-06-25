# app/repositories/transport_repository.py - Repository pour les modèles du K-Transport
from sqlalchemy.orm import Session
from typing import Optional, List
from sqlalchemy import and_, or_
from datetime import datetime
from decimal import Decimal

from app.models.transport import (
    CamionFlotte, ChauffeurProfil, MissionTransport,
    StatutMission, StatutCamion
)
from app.models.magasin import BandeLivraison
from app.repositories.base_repository import BaseRepository


class CamionFlotteRepository(BaseRepository[CamionFlotte]):
    """Repository pour les opérations sur la flotte de camions."""
    
    def __init__(self):
        super().__init__(CamionFlotte)
    
    def get_by_immatriculation(self, db: Session, immatriculation: str) -> Optional[CamionFlotte]:
        """
        Récupère un camion par son immatriculation.
        
        Args:
            db: Session de base de données
            immatriculation: Immatriculation du camion
            
        Returns:
            Le camion trouvé ou None
        """
        return db.query(CamionFlotte).filter(
            CamionFlotte.immatriculation == immatriculation
        ).first()
    
    def get_by_statut(self, db: Session, statut: StatutCamion) -> List[CamionFlotte]:
        """
        Récupère tous les camions par statut.
        
        Args:
            db: Session de base de données
            statut: Statut des camions
            
        Returns:
            Liste des camions correspondants
        """
        return db.query(CamionFlotte).filter(
            and_(
                CamionFlotte.statut == statut,
                CamionFlotte.deleted_at == None
            )
        ).all()
    
    def get_available_camions(self, db: Session) -> List[CamionFlotte]:
        """
        Récupère tous les camions disponibles.
        
        Args:
            db: Session de base de données
            
        Returns:
            Liste des camions disponibles
        """
        return db.query(CamionFlotte).filter(
            and_(
                CamionFlotte.statut == StatutCamion.DISPONIBLE,
                CamionFlotte.deleted_at == None
            )
        ).all()
    
    def get_camions_requiring_maintenance(self, db: Session) -> List[CamionFlotte]:
        """
        Récupère tous les camions nécessitant une maintenance.
        
        Args:
            db: Session de base de données
            
        Returns:
            Liste des camions nécessitant une maintenance
        """
        return db.query(CamionFlotte).filter(
            and_(
                CamionFlotte.kilometrage_actuel >= CamionFlotte.kilometrage_maintenance,
                CamionFlotte.deleted_at == None
            )
        ).all()


class ChauffeurProfilRepository(BaseRepository[ChauffeurProfil]):
    """Repository pour les opérations sur les profils de chauffeurs."""
    
    def __init__(self):
        super().__init__(ChauffeurProfil)
    
    def get_by_permis(self, db: Session, numero_permis: str) -> Optional[ChauffeurProfil]:
        """
        Récupère un chauffeur par son numéro de permis.
        
        Args:
            db: Session de base de données
            numero_permis: Numéro de permis
            
        Returns:
            Le chauffeur trouvé ou None
        """
        return db.query(ChauffeurProfil).filter(
            ChauffeurProfil.numero_permis == numero_permis
        ).first()
    
    def get_available_chauffeurs(self, db: Session) -> List[ChauffeurProfil]:
        """
        Récupère tous les chauffeurs disponibles.
        
        Args:
            db: Session de base de données
            
        Returns:
            Liste des chauffeurs disponibles
        """
        return db.query(ChauffeurProfil).filter(
            and_(
                ChauffeurProfil.est_disponible == True,
                ChauffeurProfil.deleted_at == None
            )
        ).all()
    
    def search_by_name(self, db: Session, name: str) -> List[ChauffeurProfil]:
        """
        Recherche des chauffeurs par nom (recherche partielle).
        
        Args:
            db: Session de base de données
            name: Nom ou partie du nom à rechercher
            
        Returns:
            Liste des chauffeurs correspondants
        """
        return db.query(ChauffeurProfil).filter(
            and_(
                or_(
                    ChauffeurProfil.nom.ilike(f"%{name}%"),
                    ChauffeurProfil.prenom.ilike(f"%{name}%")
                ),
                ChauffeurProfil.deleted_at == None
            )
        ).all()


class MissionTransportRepository(BaseRepository[MissionTransport]):
    """Repository pour les opérations sur les missions de transport."""
    
    def __init__(self):
        super().__init__(MissionTransport)
    
    def get_by_numero(self, db: Session, numero_mission: str) -> Optional[MissionTransport]:
        """
        Récupère une mission par son numéro.
        
        Args:
            db: Session de base de données
            numero_mission: Numéro de la mission
            
        Returns:
            La mission trouvée ou None
        """
        return db.query(MissionTransport).filter(
            MissionTransport.numero_mission == numero_mission
        ).first()
    
    def get_by_statut(self, db: Session, statut: StatutMission) -> List[MissionTransport]:
        """
        Récupère toutes les missions par statut.
        
        Args:
            db: Session de base de données
            statut: Statut des missions
            
        Returns:
            Liste des missions correspondantes
        """
        return db.query(MissionTransport).filter(
            and_(
                MissionTransport.statut == statut,
                MissionTransport.deleted_at == None
            )
        ).all()
    
    def get_by_camion(self, db: Session, camion_id: int) -> List[MissionTransport]:
        """
        Récupère toutes les missions d'un camion.
        
        Args:
            db: Session de base de données
            camion_id: ID du camion
            
        Returns:
            Liste des missions du camion
        """
        return db.query(MissionTransport).filter(
            and_(
                MissionTransport.camion_id == camion_id,
                MissionTransport.deleted_at == None
            )
        ).all()
    
    def get_by_chauffeur(self, db: Session, chauffeur_id: int) -> List[MissionTransport]:
        """
        Récupère toutes les missions d'un chauffeur.
        
        Args:
            db: Session de base de données
            chauffeur_id: ID du chauffeur
            
        Returns:
            Liste des missions du chauffeur
        """
        return db.query(MissionTransport).filter(
            and_(
                MissionTransport.chauffeur_id == chauffeur_id,
                MissionTransport.deleted_at == None
            )
        ).all()
    
    def get_missions_en_cours(self, db: Session) -> List[MissionTransport]:
        """
        Récupère toutes les missions en cours.
        
        Args:
            db: Session de base de données
            
        Returns:
            Liste des missions en cours
        """
        return db.query(MissionTransport).filter(
            and_(
                MissionTransport.statut == StatutMission.EN_COURS,
                MissionTransport.deleted_at == None
            )
        ).all()
    
    def get_missions_by_date_range(self, db: Session, date_debut, date_fin) -> List[MissionTransport]:
        """
        Récupère toutes les missions sur une période.
        
        Args:
            db: Session de base de données
            date_debut: Date de début
            date_fin: Date de fin
            
        Returns:
            Liste des missions sur la période
        """
        return db.query(MissionTransport).filter(
            and_(
                MissionTransport.date_debut >= date_debut,
                MissionTransport.date_debut <= date_fin,
                MissionTransport.deleted_at == None
            )
        ).all()


class BandeLivraisonRepository(BaseRepository[BandeLivraison]):
    """Repository pour les opérations sur les bandes de livraison."""
    
    def __init__(self):
        super().__init__(BandeLivraison)
    
    def get_by_numero(self, db: Session, numero_bande: str) -> Optional[BandeLivraison]:
        """
        Récupère une bande par son numéro.
        
        Args:
            db: Session de base de données
            numero_bande: Numéro de la bande
            
        Returns:
            La bande trouvée ou None
        """
        return db.query(BandeLivraison).filter(
            BandeLivraison.numero_bande == numero_bande
        ).first()
    
    def get_by_commande(self, db: Session, commande_id: int) -> List[BandeLivraison]:
        """
        Récupère toutes les bandes d'une commande.
        
        Args:
            db: Session de base de données
            commande_id: ID de la commande
            
        Returns:
            Liste des bandes de la commande
        """
        return db.query(BandeLivraison).filter(
            BandeLivraison.commande_id == commande_id
        ).all()
    
    def get_by_date(self, db: Session, date_livraison: datetime) -> List[BandeLivraison]:
        """
        Récupère toutes les bandes pour une date de livraison.
        
        Args:
            db: Session de base de données
            date_livraison: Date de livraison
            
        Returns:
            Liste des bandes pour la date
        """
        return db.query(BandeLivraison).filter(
            and_(
                BandeLivraison.date_livraison == date_livraison,
                BandeLivraison.deleted_at == None
            )
        ).all()
