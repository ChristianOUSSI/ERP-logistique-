# app/services/gateway_service.py - Service pour les passerelles inter-modules
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime

from app.models.gateway import Passerelle, CommandeFacture, CommandeLivraison, ReceptionStock, FacturePaiement, MissionFacture
from app.schemas.shared import (
    PasserelleCreate, PasserelleUpdate, Passerelle,
    CommandeFactureDTO, CommandeLivraisonDTO, ReceptionStockDTO,
    FacturePaiementDTO, MissionFactureDTO, BonLivraisonFactureDTO,
    TypePasserelle, StatutPasserelle
)
from app.utils.logger import get_logger

logger = get_logger(__name__)


class GatewayService:
    """Service pour gérer les passerelles entre modules"""
    
    def __init__(self):
        pass
    
    def create_passerelle(
        self,
        db: Session,
        passerelle: PasserelleCreate,
        user_id: Optional[str] = None
    ) -> Passerelle:
        """
        Crée une nouvelle passerelle entre modules.
        
        Args:
            db: Session de base de données
            passerelle: Données de la passerelle
            user_id: ID de l'utilisateur qui crée la passerelle
            
        Returns:
            La passerelle créée
        """
        db_passerelle = Passerelle(**passerelle.model_dump())
        db.add(db_passerelle)
        db.commit()
        db.refresh(db_passerelle)
        
        logger.info(
            f"Passerelle créée: {passerelle.type_passerelle} "
            f"{passerelle.source_module}→{passerelle.cible_module}",
            extra={"passerelle_id": db_passerelle.id, "user_id": user_id}
        )
        
        return db_passerelle
    
    def get_passerelle(self, db: Session, passerelle_id: int) -> Optional[Passerelle]:
        """Récupère une passerelle par son ID."""
        return db.query(Passerelle).filter(Passerelle.id == passerelle_id).first()
    
    def get_passerelles_by_source(
        self,
        db: Session,
        source_module: str,
        source_id: int
    ) -> List[Passerelle]:
        """Récupère toutes les passerelles pour une source donnée."""
        return db.query(Passerelle).filter(
            Passerelle.source_module == source_module,
            Passerelle.source_id == source_id
        ).all()
    
    def get_passerelles_by_cible(
        self,
        db: Session,
        cible_module: str,
        cible_id: int
    ) -> List[Passerelle]:
        """Récupère toutes les passerelles pour une cible donnée."""
        return db.query(Passerelle).filter(
            Passerelle.cible_module == cible_module,
            Passerelle.cible_id == cible_id
        ).all()
    
    def get_passerelles_en_attente(self, db: Session) -> List[Passerelle]:
        """Récupère toutes les passerelles en attente de traitement."""
        return db.query(Passerelle).filter(
            Passerelle.statut == StatutPasserelle.EN_ATTENTE
        ).all()
    
    def update_passerelle(
        self,
        db: Session,
        passerelle_id: int,
        passerelle_update: PasserelleUpdate,
        user_id: Optional[str] = None
    ) -> Optional[Passerelle]:
        """
        Met à jour une passerelle.
        
        Args:
            db: Session de base de données
            passerelle_id: ID de la passerelle
            passerelle_update: Données de mise à jour
            user_id: ID de l'utilisateur qui met à jour
            
        Returns:
            La passerelle mise à jour ou None
        """
        db_passerelle = self.get_passerelle(db, passerelle_id)
        if not db_passerelle:
            return None
        
        update_data = passerelle_update.model_dump(exclude_unset=True)
        
        # Si le statut passe à TRAITE, mettre à jour la date de traitement
        if passerelle_update.statut == StatutPasserelle.TRAITE:
            update_data["date_traitement"] = datetime.utcnow()
            if user_id:
                update_data["traite_par"] = user_id
        
        for field, value in update_data.items():
            setattr(db_passerelle, field, value)
        
        db.commit()
        db.refresh(db_passerelle)
        
        logger.info(
            f"Passerelle mise à jour: {db_passerelle.type_passerelle} "
            f"statut={db_passerelle.statut}",
            extra={"passerelle_id": db_passerelle.id, "user_id": user_id}
        )
        
        return db_passerelle
    
    # ============ Passerelles spécifiques ============
    
    def creer_commande_facture(
        self,
        db: Session,
        dto: CommandeFactureDTO,
        user_id: Optional[str] = None
    ) -> Passerelle:
        """
        Crée une passerelle Commande → Facture.
        
        Args:
            db: Session de base de données
            dto: Données de la commande
            user_id: ID de l'utilisateur
            
        Returns:
            La passerelle créée
        """
        passerelle = PasserelleCreate(
            type_passerelle=TypePasserelle.COMMANDE_FACTURE,
            source_module="magasin",
            source_id=dto.commande_id,
            cible_module="finance",
            donnees=dto.model_dump()
        )
        
        return self.create_passerelle(db, passerelle, user_id)
    
    def creer_commande_livraison(
        self,
        db: Session,
        dto: CommandeLivraisonDTO,
        user_id: Optional[str] = None
    ) -> Passerelle:
        """Crée une passerelle Commande → Livraison."""
        passerelle = PasserelleCreate(
            type_passerelle=TypePasserelle.COMMANDE_LIVRAISON,
            source_module="magasin",
            source_id=dto.commande_id,
            cible_module="transport",
            donnees=dto.model_dump()
        )
        
        return self.create_passerelle(db, passerelle, user_id)
    
    def creer_reception_stock(
        self,
        db: Session,
        dto: ReceptionStockDTO,
        user_id: Optional[str] = None
    ) -> Passerelle:
        """Crée une passerelle Réception → Stock."""
        passerelle = PasserelleCreate(
            type_passerelle=TypePasserelle.RECEPTION_STOCK,
            source_module="magasin",
            source_id=dto.reception_id,
            cible_module="magasin",
            donnees=dto.model_dump()
        )
        
        return self.create_passerelle(db, passerelle, user_id)
    
    def creer_facture_paiement(
        self,
        db: Session,
        dto: FacturePaiementDTO,
        user_id: Optional[str] = None
    ) -> Passerelle:
        """Crée une passerelle Facture → Paiement."""
        passerelle = PasserelleCreate(
            type_passerelle=TypePasserelle.FACTURE_PAIEMENT,
            source_module="finance",
            source_id=dto.facture_id,
            cible_module="finance",
            donnees=dto.model_dump()
        )
        
        return self.create_passerelle(db, passerelle, user_id)
    
    def creer_mission_facture(
        self,
        db: Session,
        dto: MissionFactureDTO,
        user_id: Optional[str] = None
    ) -> Passerelle:
        """Crée une passerelle Mission → Facture."""
        passerelle = PasserelleCreate(
            type_passerelle=TypePasserelle.MISSION_FACTURE,
            source_module="transport",
            source_id=dto.mission_id,
            cible_module="finance",
            donnees=dto.model_dump()
        )
        
        return self.create_passerelle(db, passerelle, user_id)
    
    def traiter_passerelle(
        self,
        db: Session,
        passerelle_id: int,
        cible_id: int,
        user_id: Optional[str] = None
    ) -> Optional[Passerelle]:
        """
        Traite une passerelle (marque comme traitée et lie à l'entité cible).
        
        Args:
            db: Session de base de données
            passerelle_id: ID de la passerelle
            cible_id: ID de l'entité cible créée
            user_id: ID de l'utilisateur qui traite
            
        Returns:
            La passerelle mise à jour ou None
        """
        update = PasserelleUpdate(
            cible_id=cible_id,
            statut=StatutPasserelle.TRAITE
        )
        
        return self.update_passerelle(db, passerelle_id, update, user_id)
    
    def echouer_passerelle(
        self,
        db: Session,
        passerelle_id: int,
        message_erreur: str,
        user_id: Optional[str] = None
    ) -> Optional[Passerelle]:
        """
        Marque une passerelle comme échouée.
        
        Args:
            db: Session de base de données
            passerelle_id: ID de la passerelle
            message_erreur: Message d'erreur
            user_id: ID de l'utilisateur
            
        Returns:
            La passerelle mise à jour ou None
        """
        update = PasserelleUpdate(
            statut=StatutPasserelle.ECHOUE,
            message_erreur=message_erreur
        )
        
        return self.update_passerelle(db, passerelle_id, update, user_id)


# Instance globale du service
gateway_service = GatewayService()
