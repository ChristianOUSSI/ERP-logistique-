# app/repositories/suppliers_repository.py - Repository pour les fournisseurs
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.suppliers import Supplier, SupplierProfile, StatutSupplier, CategorieSupplier


class SupplierRepository:
    """Repository pour les fournisseurs"""
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Supplier]:
        """Récupère tous les fournisseurs"""
        return db.query(Supplier).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_id(db: Session, supplier_id: int) -> Optional[Supplier]:
        """Récupère un fournisseur par son ID"""
        return db.query(Supplier).filter(Supplier.id == supplier_id).first()
    
    @staticmethod
    def get_by_code(db: Session, code_fournisseur: str) -> Optional[Supplier]:
        """Récupère un fournisseur par son code"""
        return db.query(Supplier).filter(Supplier.code_fournisseur == code_fournisseur).first()
    
    @staticmethod
    def get_by_niu(db: Session, niu: str) -> Optional[Supplier]:
        """Récupère un fournisseur par son NIU"""
        return db.query(Supplier).filter(Supplier.niu == niu).first()
    
    @staticmethod
    def get_by_statut(db: Session, statut: str) -> List[Supplier]:
        """Récupère les fournisseurs par statut"""
        return db.query(Supplier).filter(Supplier.statut == stat).all()
    
    @staticmethod
    def get_by_categorie(db: Session, categorie: str) -> List[Supplier]:
        """Récupère les fournisseurs par catégorie"""
        return db.query(Supplier).filter(Supplier.categorie == categorie).all()
    
    @staticmethod
    def get_active(db: Session) -> List[Supplier]:
        """Récupère les fournisseurs actifs"""
        return db.query(Supplier).filter(Supplier.est_actif == True).all()
    
    @staticmethod
    def search(db: Session, query: str) -> List[Supplier]:
        """Recherche de fournisseurs par nom, acronyme, ou email"""
        return db.query(Supplier).filter(
            (Supplier.raison_sociale.ilike(f"%{query}%")) |
            (Supplier.acronyme.ilike(f"%{query}%")) |
            (Supplier.email.ilike(f"%{query}%"))
        ).all()
    
    @staticmethod
    def create(db: Session, supplier: Supplier) -> Supplier:
        """Crée un nouveau fournisseur"""
        db.add(supplier)
        db.commit()
        db.refresh(supplier)
        return supplier
    
    @staticmethod
    def update(db: Session, supplier: Supplier) -> Supplier:
        """Met à jour un fournisseur"""
        db.commit()
        db.refresh(supplier)
        return supplier
    
    @staticmethod
    def delete(db: Session, supplier_id: int) -> bool:
        """Supprime un fournisseur"""
        supplier = SupplierRepository.get_by_id(db, supplier_id)
        if not supplier:
            return False
        db.delete(supplier)
        db.commit()
        return True
    
    @staticmethod
    def get_profile(db: Session, supplier_id: int) -> Optional[SupplierProfile]:
        """Récupère le profil d'un fournisseur"""
        return db.query(SupplierProfile).filter(SupplierProfile.supplier_id == supplier_id).first()
    
    @staticmethod
    def create_profile(db: Session, profile: SupplierProfile) -> SupplierProfile:
        """Crée un profil fournisseur"""
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile
    
    @staticmethod
    def update_profile(db: Session, profile: SupplierProfile) -> SupplierProfile:
        """Met à jour un profil fournisseur"""
        db.commit()
        db.refresh(profile)
        return profile
    
    @staticmethod
    def delete_profile(db: Session, supplier_id: int) -> bool:
        """Supprime un profil fournisseur"""
        profile = SupplierRepository.get_profile(db, supplier_id)
        if not profile:
            return False
        db.delete(profile)
        db.commit()
        return True
    
    @staticmethod
    def get_by_credit_limit(db: Session, min_limit: float, max_limit: float) -> List[Supplier]:
        """Récupère les fournisseurs par plage de limite de crédit"""
        return db.query(Supplier).filter(
            Supplier.limite_credit_xaf >= min_limit,
            Supplier.limite_credit_xaf <= max_limit
        ).all()
