# app/repositories/finance_repository.py - Repository pour les modèles du K-Finance
from sqlalchemy.orm import Session
from typing import Optional, List
from sqlalchemy import and_, or_
from decimal import Decimal

from app.models.finance import Facture, Encaissement, GrilleTarifaire, StatutFacture
from app.repositories.base_repository import BaseRepository


class FactureRepository(BaseRepository[Facture]):
    """Repository pour les opérations sur les factures."""
    
    def __init__(self):
        super().__init__(Facture)
    
    def get_by_numero(self, db: Session, numero_facture: str) -> Optional[Facture]:
        """
        Récupère une facture par son numéro.
        
        Args:
            db: Session de base de données
            numero_facture: Numéro de la facture
            
        Returns:
            La facture trouvée ou None
        """
        return db.query(Facture).filter(Facture.numero_facture == numero_facture).first()
    
    def get_by_tiers(self, db: Session, tiers_id: int) -> List[Facture]:
        """
        Récupère toutes les factures d'un tiers.
        
        Args:
            db: Session de base de données
            tiers_id: ID du tiers
            
        Returns:
            Liste des factures du tiers
        """
        return db.query(Facture).filter(
            and_(
                Facture.tiers_id == tiers_id,
                Facture.deleted_at == None
            )
        ).all()
    
    def get_by_statut(self, db: Session, statut: StatutFacture) -> List[Facture]:
        """
        Récupère toutes les factures par statut.
        
        Args:
            db: Session de base de données
            statut: Statut des factures
            
        Returns:
            Liste des factures correspondantes
        """
        return db.query(Facture).filter(
            and_(
                Facture.statut == statut,
                Facture.deleted_at == None
            )
        ).all()
    
    def get_factures_en_retard(self, db: Session) -> List[Facture]:
        """
        Récupère toutes les factures en retard de paiement.
        
        Args:
            db: Session de base de données
            
        Returns:
            Liste des factures en retard
        """
        from datetime import datetime
        return db.query(Facture).filter(
            and_(
                Facture.statut == StatutFacture.EN_ATTENTE,
                Facture.date_echeance < datetime.utcnow(),
                Facture.deleted_at == None
            )
        ).all()
    
    def get_total_encaisse(self, db: Session, tiers_id: Optional[int] = None) -> Decimal:
        """
        Calcule le total encaissé pour un tiers ou tous les tiers.
        
        Args:
            db: Session de base de données
            tiers_id: ID du tiers (optionnel)
            
        Returns:
            Total encaissé
        """
        query = db.query(Facture).filter(
            and_(
                Facture.statut == StatutFacture.PAYEE,
                Facture.deleted_at == None
            )
        )
        
        if tiers_id:
            query = query.filter(Facture.tiers_id == tiers_id)
        
        result = query.with_entities(
            db.func.sum(Facture.montant_ttc)
        ).scalar()
        
        return result if result else Decimal('0')


class EncaissementRepository(BaseRepository[Encaissement]):
    """Repository pour les opérations sur les encaissements."""
    
    def __init__(self):
        super().__init__(Encaissement)
    
    def get_by_facture(self, db: Session, facture_id: int) -> List[Encaissement]:
        """
        Récupère tous les encaissements d'une facture.
        
        Args:
            db: Session de base de données
            facture_id: ID de la facture
            
        Returns:
            Liste des encaissements de la facture
        """
        return db.query(Encaissement).filter(
            Encaissement.facture_id == facture_id
        ).all()
    
    def get_by_date_range(self, db: Session, date_debut, date_fin) -> List[Encaissement]:
        """
        Récupère tous les encaissements sur une période.
        
        Args:
            db: Session de base de données
            date_debut: Date de début
            date_fin: Date de fin
            
        Returns:
            Liste des encaissements sur la période
        """
        return db.query(Encaissement).filter(
            and_(
                Encaissement.date_encaissement >= date_debut,
                Encaissement.date_encaissement <= date_fin,
                Encaissement.deleted_at == None
            )
        ).all()


class GrilleTarifaireRepository(BaseRepository[GrilleTarifaire]):
    """Repository pour les opérations sur les grilles tarifaires."""
    
    def __init__(self):
        super().__init__(GrilleTarifaire)
    
    def get_by_code(self, db: Session, code: str) -> Optional[GrilleTarifaire]:
        """
        Récupère une grille tarifaire par son code.
        
        Args:
            db: Session de base de données
            code: Code de la grille tarifaire
            
        Returns:
            La grille tarifaire trouvée ou None
        """
        return db.query(GrilleTarifaire).filter(GrilleTarifaire.code == code).first()
    
    def get_active_grilles(self, db: Session) -> List[GrilleTarifaire]:
        """
        Récupère toutes les grilles tarifaires actives.
        
        Args:
            db: Session de base de données
            
        Returns:
            Liste des grilles tarifaires actives
        """
        return db.query(GrilleTarifaire).filter(
            and_(
                GrilleTarifaire.est_actif == True,
                GrilleTarifaire.deleted_at == None
            )
        ).all()
    
    def get_by_service(self, db: Session, service: str) -> List[GrilleTarifaire]:
        """
        Récupère toutes les grilles tarifaires pour un service.
        
        Args:
            db: Session de base de données
            service: Nom du service
            
        Returns:
            Liste des grilles tarifaires du service
        """
        return db.query(GrilleTarifaire).filter(
            and_(
                GrilleTarifaire.service == service,
                GrilleTarifaire.est_actif == True,
                GrilleTarifaire.deleted_at == None
            )
        ).all()
