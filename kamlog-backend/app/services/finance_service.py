# app/services/finance_service.py - Service métier pour le module K-Finance
import difflib
from decimal import Decimal
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime

from app.models.finance import Facture, Encaissement, GrilleTarifaire, StatutFacture, Avoir
from app.models.tiers import Tiers
from app.schemas.finance import (
    FactureCreate,
    FactureUpdate,
    EncaissementCreate,
    EncaissementUpdate,
    GrilleTarifaireCreate,
    GrilleTarifaireUpdate,
    AvoirCreate
)
from app.repositories.finance_repository import AvoirRepository
from app.exceptions import NotFoundException, ConflictException, BusinessLogicException
from app.utils.audit import AuditService
from app.utils.logger import get_logger
from app.utils.cache import cache_service, invalidate_cache_pattern
from app.config import settings

logger = get_logger(__name__)

TVA_CAMEROUN = Decimal(str(settings.TVA_RATE))


class FactureService:
    """Service pour la gestion des factures"""

    @staticmethod
    def get_all_factures(db: Session, skip: int = 0, limit: int = 100) -> List[Facture]:
        cache_key = f"finance:factures:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Facture).options(
            selectinload(Facture.tiers)
        ).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_facture(db: Session, facture_id: int) -> Optional[Facture]:
        cache_key = f"finance:facture:{facture_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Facture).filter(Facture.id == facture_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_factures_by_tiers(db: Session, tiers_id: int) -> List[Facture]:
        cache_key = f"finance:factures:tiers:{tiers_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Facture).filter(Facture.tiers_id == tiers_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_factures_non_soldées(db: Session) -> List[Facture]:
        cache_key = "finance:factures:non_soldees"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Facture).filter(
            Facture.statut.in_([StatutFacture.EMISE, StatutFacture.PARTIELLEMENT_PAYEE])
        ).all()
        cache_service.set(cache_key, result, expire=180)
        return result

    @staticmethod
    def create_facture(db: Session, facture: FactureCreate, cree_par: str) -> Facture:
        # Calculer le montant TTC
        montant_ht = facture.montant_ht_xaf
        tva_xaf = (montant_ht * TVA_CAMEROUN).quantize(Decimal('1'))
        montant_ttc = montant_ht + tva_xaf
        
        db_facture = Facture(
            **facture.model_dump(exclude={'montant_ttc_xaf'}),
            montant_ttc_xaf=montant_ttc
        )
        db.add(db_facture)
        db.commit()
        db.refresh(db_facture)
        
        # Invalider le cache
        invalidate_cache_pattern("finance:factures:*")
        
        logger.info(f"Facture créée: {db_facture.numero_facture}", extra={"facture_id": db_facture.id})
        return db_facture

    @staticmethod
    def update_facture(db: Session, facture_id: int, facture: FactureUpdate) -> Optional[Facture]:
        db_facture = FactureService.get_facture(db, facture_id)
        if db_facture:
            for field, value in facture.dict(exclude_unset=True).items():
                setattr(db_facture, field, value)
            db.commit()
            db.refresh(db_facture)
            
            # Invalider le cache
            invalidate_cache_pattern("finance:factures:*")
        return db_facture

    @staticmethod
    def delete_facture(db: Session, facture_id: int) -> bool:
        db_facture = FactureService.get_facture(db, facture_id)
        if db_facture:
            db.delete(db_facture)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("finance:factures:*")
            return True
        return False

    @staticmethod
    def valider_facture(db: Session, facture_id: int, valide_par: str) -> Optional[Facture]:
        """Valide une facture"""
        db_facture = FactureService.get_facture(db, facture_id)
        if db_facture:
            db_facture.statut = StatutFacture.EMISE
            db_facture.valide_par = valide_par
            db_facture.date_validation = datetime.now()
            db.commit()
            db.refresh(db_facture)
            
            # Invalider le cache
            invalidate_cache_pattern("finance:factures:*")
        return db_facture

    @staticmethod
    def annuler_facture(db: Session, facture_id: int) -> Optional[Facture]:
        """Annule une facture"""
        db_facture = FactureService.get_facture(db, facture_id)
        if db_facture:
            db_facture.statut = StatutFacture.ANNULEE
            db.commit()
            db.refresh(db_facture)
            
            # Invalider le cache
            invalidate_cache_pattern("finance:factures:*")
        return db_facture


class EncaissementService:
    """Service pour la gestion des encaissements"""

    @staticmethod
    def get_all_encaissements(db: Session, skip: int = 0, limit: int = 100) -> List[Encaissement]:
        cache_key = f"finance:encaissements:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Encaissement).options(
            selectinload(Encaissement.tiers)
        ).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_encaissement(db: Session, encaissement_id: int) -> Optional[Encaissement]:
        cache_key = f"finance:encaissement:{encaissement_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Encaissement).filter(Encaissement.id == encaissement_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_encaissements_by_tiers(db: Session, tiers_id: int) -> List[Encaissement]:
        cache_key = f"finance:encaissements:tiers:{tiers_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Encaissement).filter(Encaissement.tiers_id == tiers_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_encaissements_non_lettrés(db: Session) -> List[Encaissement]:
        cache_key = "finance:encaissements:non_lettres"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Encaissement).filter(Encaissement.lettree == False).all()
        cache_service.set(cache_key, result, expire=180)
        return result

    @staticmethod
    def create_encaissement(db: Session, encaissement: EncaissementCreate, cree_par: str) -> Encaissement:
        db_encaissement = Encaissement(**encaissement.model_dump())
        db.add(db_encaissement)
        db.commit()
        db.refresh(db_encaissement)
        
        # Invalider le cache
        invalidate_cache_pattern("finance:encaissements:*")
        invalidate_cache_pattern("finance:factures:*")
        
        logger.info(f"Encaissement créé: {db_encaissement.reference}", extra={"encaissement_id": db_encaissement.id})
        return db_encaissement

    @staticmethod
    def update_encaissement(db: Session, encaissement_id: int, encaissement: EncaissementUpdate) -> Optional[Encaissement]:
        db_encaissement = EncaissementService.get_encaissement(db, encaissement_id)
        if db_encaissement:
            for field, value in encaissement.model_dump(exclude_unset=True).items():
                setattr(db_encaissement, field, value)
            db.commit()
            db.refresh(db_encaissement)
            
            # Invalider le cache
            invalidate_cache_pattern("finance:encaissements:*")
            invalidate_cache_pattern("finance:factures:*")
        return db_encaissement

    @staticmethod
    def delete_encaissement(db: Session, encaissement_id: int) -> bool:
        db_encaissement = EncaissementService.get_encaissement(db, encaissement_id)
        if db_encaissement:
            db.delete(db_encaissement)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("finance:encaissements:*")
            invalidate_cache_pattern("finance:factures:*")
            return True
        return False

    @staticmethod
    def lettrer_encaissement(db: Session, encaissement_id: int, facture_id: int) -> Optional[Encaissement]:
        """Lettre un encaissement à une facture"""
        db_encaissement = EncaissementService.get_encaissement(db, encaissement_id)
        if db_encaissement:
            db_encaissement.lettree = True
            db_encaissement.facture_id = facture_id
            db.commit()
            db.refresh(db_encaissement)
            
            # Invalider le cache
            invalidate_cache_pattern("finance:encaissements:*")
            invalidate_cache_pattern("finance:factures:*")
        return db_encaissement


class GrilleTarifaireService:
    """Service pour la gestion des grilles tarifaires"""

    @staticmethod
    def get_all_grilles(db: Session, skip: int = 0, limit: int = 100) -> List[GrilleTarifaire]:
        cache_key = f"finance:grilles:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(GrilleTarifaire).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_grille(db: Session, grille_id: int) -> Optional[GrilleTarifaire]:
        cache_key = f"finance:grille:{grille_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(GrilleTarifaire).filter(GrilleTarifaire.id == grille_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_grilles_by_type(db: Session, type_service: str) -> List[GrilleTarifaire]:
        cache_key = f"finance:grilles:type:{type_service}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(GrilleTarifaire).filter(GrilleTarifaire.type_service == type_service).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_grille_active(db: Session, type_service: str) -> Optional[GrilleTarifaire]:
        cache_key = f"finance:grille:active:{type_service}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(GrilleTarifaire).filter(
            GrilleTarifaire.type_service == type_service,
            GrilleTarifaire.active == True
        ).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def create_grille(db: Session, grille: GrilleTarifaireCreate, cree_par: str) -> GrilleTarifaire:
        db_grille = GrilleTarifaire(**grille.dict(), cree_par=cree_par)
        db.add(db_grille)
        db.commit()
        db.refresh(db_grille)
        
        # Invalider le cache
        invalidate_cache_pattern("finance:grilles:*")
        
        logger.info(f"Grille tarifaire créée: {db_grille.code}", extra={"grille_id": db_grille.id})
        return db_grille

    @staticmethod
    def update_grille(db: Session, grille_id: int, grille: GrilleTarifaireUpdate) -> Optional[GrilleTarifaire]:
        db_grille = GrilleTarifaireService.get_grille(db, grille_id)
        if db_grille:
            for field, value in grille.dict(exclude_unset=True).items():
                setattr(db_grille, field, value)
            db.commit()
            db.refresh(db_grille)
            
            # Invalider le cache
            invalidate_cache_pattern("finance:grilles:*")
        return db_grille

    @staticmethod
    def delete_grille(db: Session, grille_id: int) -> bool:
        db_grille = GrilleTarifaireService.get_grille(db, grille_id)
        if db_grille:
            db.delete(db_grille)
            db.commit()
            
            # Invalider le cache
            invalidate_cache_pattern("finance:grilles:*")
            return True
        return False

    @staticmethod
    def activer_grille(db: Session, grille_id: int) -> Optional[GrilleTarifaire]:
        """Active une grille tarifaire"""
        db_grille = GrilleTarifaireService.get_grille(db, grille_id)
        if db_grille:
            # Désactiver les autres grilles du même type
            db.query(GrilleTarifaire).filter(
                GrilleTarifaire.type_service == db_grille.type_service,
                GrilleTarifaire.id != grille_id
            ).update({"active": False})
            
            db_grille.active = True
            db.commit()
            db.refresh(db_grille)
            
            # Invalider le cache
            invalidate_cache_pattern("finance:grilles:*")
        return db_grille


class EncoursService:
    """Service pour le calcul de l'encours client"""

    @staticmethod
    def calculer_encours_client(db: Session, tiers_id: int) -> dict:
        """
        Calcule l'encours en temps réel pour un client.
        Encours = Somme(factures non soldées) - Somme(encaissements)
        """
        cache_key = f"finance:encours:{tiers_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        
        # Total factures émises non soldées
        from sqlalchemy import func
        total_factures = db.query(func.sum(Facture.montant_ttc_xaf)).filter(
            Facture.tiers_id == tiers_id,
            Facture.statut.in_([
                StatutFacture.EMISE,
                StatutFacture.PARTIELLEMENT_PAYEE,
            ])
        ).scalar() or Decimal('0')

        # Total encaissements reçus (non lettrés)
        total_encaissements = db.query(func.sum(Encaissement.montant_xaf)).filter(
            Encaissement.tiers_id == tiers_id,
            Encaissement.lettree == False,
        ).scalar() or Decimal('0')

        encours_xaf = total_factures - total_encaissements

        # Récupérer la limite crédit du tiers
        tiers = db.query(Tiers).filter(Tiers.id == tiers_id).first()
        limite = Decimal(str(tiers.limite_credit_xaf)) if tiers else Decimal('0')

        result = {
            "tiers_id": tiers_id,
            "encours_xaf": encours_xaf,
            "limite_credit_xaf": limite,
            "taux_occupation": (encours_xaf / limite * 100) if limite > 0 else None,
            "alerte": encours_xaf >= limite * Decimal("0.9"),
            "bloque": encours_xaf >= limite,
        }
        
        cache_service.set(cache_key, result, expire=120)
        return result

    @staticmethod
    def verifier_limite_credit(db: Session, tiers_id: int, montant_new_facture: Decimal) -> None:
        """Lève ValueError si le nouvel encours dépasse la limite."""
        encours = EncoursService.calculer_encours_client(db, tiers_id)
        nouvel_encours = encours['encours_xaf'] + montant_new_facture
        if encours['limite_credit_xaf'] > 0 and nouvel_encours > encours['limite_credit_xaf']:
            raise ValueError(
                f"Limite crédit dépassée : encours {nouvel_encours:,.0f} XAF"
                f" > limite {encours['limite_credit_xaf']:,.0f} XAF"
            )


def calculer_tva(montant_ht: Decimal) -> dict:
    """Calcule les montants HT, TVA 19.25%, TTC en XAF."""
    tva_xaf = (montant_ht * TVA_CAMEROUN).quantize(Decimal('1'))
    return {
        "montant_ht_xaf": montant_ht,
        "tva_xaf": tva_xaf,
        "montant_ttc_xaf": montant_ht + tva_xaf,
        "taux_tva": float(TVA_CAMEROUN * 100),
    }


class BankReconciliationService:
    """Service pour le rapprochement automatique des relevés bancaires."""

    @staticmethod
    def _calculate_similarity(s1: str, s2: str) -> float:
        """Calcule le ratio de similarité entre deux chaînes."""
        if not s1 or not s2:
            return 0.0
        return difflib.SequenceMatcher(None, s1.upper(), s2.upper()).ratio()

    @staticmethod
    def perform_automatic_matching(db: Session, bank_statements: List[dict]) -> List[dict]:
        """
        Exécute l'algorithme de matching automatique entre un relevé importé et l'ERP.
        
        bank_statements: [{'date': datetime, 'description': str, 'amount': Decimal}, ...]
        """
        # Récupérer tout l'encours non lettré
        unmatched_erp = EncaissementService.get_encaissements_non_lettrés(db)
        reconciliation_results = []

        for statement in bank_statements:
            best_match = None
            highest_score = 0.0
            
            # Filtrage initial par montant exact (marge de 0.01 pour les arrondis)
            # Cela réduit drastiquement l'espace de recherche floue
            potential_matches = [
                e for e in unmatched_erp 
                if abs(e.montant_xaf - Decimal(str(statement['amount']))) < 0.01
            ]

            for erp_entry in potential_matches:
                score = 0.0
                
                # 1. Proximité de date (Poids: 30%)
                # Match idéal si les dates sont à moins de 3 jours d'intervalle
                date_diff = abs((erp_entry.date_paiement.date() - statement['date'].date()).days)
                if date_diff <= 3:
                    score += 0.3
                elif date_diff <= 7:
                    score += 0.1
                
                # 2. Similarité textuelle floue (Poids: 70%)
                # Compare la description bancaire avec la référence ERP et les notes
                sim_ref = BankReconciliationService._calculate_similarity(statement['description'], erp_entry.reference or "")
                sim_notes = BankReconciliationService._calculate_similarity(statement['description'], erp_entry.notes or "")
                score += (max(sim_ref, sim_notes) * 0.7)

                # Seuil de confiance minimal à 0.65
                if score > highest_score and score >= 0.65:
                    highest_score = score
                    best_match = erp_entry

            reconciliation_results.append({
                "bank_entry": statement,
                "erp_match": best_match,
                "confidence": round(highest_score * 100, 2)
            })
            
            # On retire l'entrée ERP pour ne pas la matcher deux fois
            if best_match:
                unmatched_erp.remove(best_match)

        return reconciliation_results


class AvoirService:
    """Service pour la gestion des avoirs."""

    def __init__(self):
        self.repo = AvoirRepository()

    def get_all_avoirs(self, db: Session, skip: int = 0, limit: int = 100) -> List[Avoir]:
        return self.repo.get_all(db, skip, limit)

    def get_avoir(self, db: Session, avoir_id: int) -> Optional[Avoir]:
        avoir = self.repo.get_by_id(db, avoir_id)
        if not avoir:
            raise NotFoundException("Avoir introuvable.")
        return avoir

    def create_avoir(self, db: Session, avoir_data: AvoirCreate, cree_par: str) -> Avoir:
        if self.repo.get_by_numero(db, avoir_data.numero_avoir):
            raise ConflictException("Un avoir avec ce numéro existe déjà.")

        db_avoir = Avoir(**avoir_data.model_dump(), cree_par=cree_par)
        return self.repo.create(db, db_avoir)

    def mark_avoir_as_used(self, db: Session, avoir_id: int) -> Avoir:
        avoir = self.get_avoir(db, avoir_id)
        if avoir.est_utilise:
            raise BusinessLogicException("Cet avoir est déjà utilisé.")
        avoir.est_utilise = True
        db.commit()
        db.refresh(avoir)
        return avoir

    def get_avoirs_by_tiers(self, db: Session, tiers_id: int) -> List[Avoir]:
        return self.repo.get_by_tiers(db, tiers_id)

    def get_unutilized_avoirs_by_tiers(self, db: Session, tiers_id: int) -> List[Avoir]:
        return self.repo.get_unutilized_by_tiers(db, tiers_id)

    def get_total_unutilized_avoir_amount(self, db: Session, tiers_id: int) -> Decimal:
        return self.repo.get_total_unutilized_amount(db, tiers_id)
