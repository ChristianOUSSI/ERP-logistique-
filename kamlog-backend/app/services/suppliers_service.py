# app/services/suppliers_service.py - Service pour les fournisseurs
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.suppliers import Supplier, SupplierProfile, StatutSupplier
from app.schemas.suppliers import SupplierCreate, SupplierUpdate, SupplierProfileCreate
import uuid


class SupplierService:
    """Service pour la gestion des fournisseurs"""
    
    @staticmethod
    def get_all_suppliers(db: Session, skip: int = 0, limit: int = 100) -> List[Supplier]:
        """Récupère tous les fournisseurs"""
        return db.query(Supplier).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_supplier(db: Session, supplier_id: int) -> Optional[Supplier]:
        """Récupère un fournisseur par son ID"""
        return db.query(Supplier).filter(Supplier.id == supplier_id).first()
    
    @staticmethod
    def get_supplier_by_code(db: Session, code_fournisseur: str) -> Optional[Supplier]:
        """Récupère un fournisseur par son code"""
        return db.query(Supplier).filter(Supplier.code_fournisseur == code_fournisseur).first()
    
    @staticmethod
    def get_supplier_by_niu(db: Session, niu: str) -> Optional[Supplier]:
        """Récupère un fournisseur par son NIU"""
        return db.query(Supplier).filter(Supplier.niu == niu).first()
    
    @staticmethod
    def get_suppliers_by_statut(db: Session, statut: str) -> List[Supplier]:
        """Récupère les fournisseurs par statut"""
        return db.query(Supplier).filter(Supplier.statut == stat).all()
    
    @staticmethod
    def get_suppliers_by_categorie(db: Session, categorie: str) -> List[Supplier]:
        """Récupère les fournisseurs par catégorie"""
        return db.query(Supplier).filter(Supplier.categorie == categorie).all()
    
    @staticmethod
    def create_supplier(db: Session, supplier: SupplierCreate, user: str) -> Supplier:
        """Crée un nouveau fournisseur"""
        # Générer un code fournisseur unique
        code_fournisseur = f"F-{uuid.uuid4().hex[:8].upper()}"
        
        db_supplier = Supplier(
            code_fournisseur=code_fournisseur,
            raison_sociale=supplier.raison_sociale,
            acronyme=supplier.acronyme,
            type_entite=supplier.type_entite,
            niu=supplier.niu,
            rccm=supplier.rccm,
            id_fiscal=supplier.id_fiscal,
            adresse=supplier.adresse,
            boite_postale=supplier.boite_postale,
            ville=supplier.ville,
            region=supplier.region,
            pays=supplier.pays,
            telephone=supplier.telephone,
            email=supplier.email,
            conditions_paiement=supplier.conditions_paiement,
            devise=supplier.devise,
            limite_credit_xaf=supplier.limite_credit_xaf,
            compte_bancaire=supplier.compte_bancaire,
            nom_banque=supplier.nom_banque,
            categorie=supplier.categorie,
            statut=StatutSupplier.EN_VALIDATION,
            est_actif=True,
            cree_par=user
        )
        
        db.add(db_supplier)
        db.commit()
        db.refresh(db_supplier)
        return db_supplier
    
    @staticmethod
    def update_supplier(db: Session, supplier_id: int, supplier: SupplierUpdate) -> Optional[Supplier]:
        """Met à jour un fournisseur"""
        db_supplier = SupplierService.get_supplier(db, supplier_id)
        if not db_supplier:
            return None
        
        update_data = supplier.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_supplier, field, value)
        
        db.commit()
        db.refresh(db_supplier)
        return db_supplier
    
    @staticmethod
    def delete_supplier(db: Session, supplier_id: int) -> bool:
        """Supprime un fournisseur"""
        db_supplier = SupplierService.get_supplier(db, supplier_id)
        if not db_supplier:
            return False
        
        db.delete(db_supplier)
        db.commit()
        return True
    
    @staticmethod
    def create_supplier_profile(db: Session, supplier_id: int, profile: SupplierProfileCreate, user: str) -> SupplierProfile:
        """Crée un profil fournisseur"""
        db_profile = SupplierProfile(
            supplier_id=supplier_id,
            categorie_fournisseur=profile.categorie_fournisseur,
            delai_moyen_livraison=profile.delai_moyen_livraison,
            qualite_service=profile.qualite_service,
            notes=profile.notes,
            date_evaluation=profile.date_evaluation,
            cree_par=user
        )
        
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile
