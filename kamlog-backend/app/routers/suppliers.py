# app/routers/suppliers.py - Routes API pour les fournisseurs
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.schemas.suppliers import (
    Supplier, SupplierCreate, SupplierUpdate,
    SupplierProfile, SupplierProfileCreate
)
from app.services.suppliers_service import SupplierService


limiter = Limiter(key_func=get_remote_address)
router = APIRouter(tags=["Suppliers"])


# ============ SUPPLIERS ============
@router.get("/", response_model=List[Supplier])
def get_suppliers(
    skip: int = 0,
    limit: int = 100,
    statut: Optional[str] = None,
    categorie: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère tous les fournisseurs"""
    if statut:
        return SupplierService.get_suppliers_by_statut(db, statut)
    if categorie:
        return SupplierService.get_suppliers_by_categorie(db, categorie)
    return SupplierService.get_all_suppliers(db, skip, limit)


@router.get("/{supplier_id}", response_model=Supplier)
def get_supplier(supplier_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Récupère un fournisseur par son ID"""
    supplier = SupplierService.get_supplier(db, supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    return supplier


@router.get("/code/{code_fournisseur}", response_model=Supplier)
def get_supplier_by_code(code_fournisseur: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Récupère un fournisseur par son code"""
    supplier = SupplierService.get_supplier_by_code(db, code_fournisseur)
    if not supplier:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    return supplier


@router.get("/niu/{niu}", response_model=Supplier)
def get_supplier_by_niu(niu: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Récupère un fournisseur par son NIU"""
    supplier = SupplierService.get_supplier_by_niu(db, niu)
    if not supplier:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    return supplier


@router.post("/", response_model=Supplier)
@limiter.limit("10/minute")
@check_permission("master-data:create")
def create_supplier(
    supplier: SupplierCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un nouveau fournisseur"""
    return SupplierService.create_supplier(db, supplier, current_user.username)


@router.put("/{supplier_id}", response_model=Supplier)
@limiter.limit("20/minute")
@check_permission("master-data:update")
def update_supplier(
    supplier_id: int, 
    supplier: SupplierUpdate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Met à jour un fournisseur"""
    updated_supplier = SupplierService.update_supplier(db, supplier_id, supplier)
    if not updated_supplier:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    return updated_supplier


@router.delete("/{supplier_id}")
@limiter.limit("10/minute")
@check_permission("master-data:delete")
def delete_supplier(
    supplier_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Supprime un fournisseur"""
    success = SupplierService.delete_supplier(db, supplier_id)
    if not success:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    return {"message": "Fournisseur supprimé avec succès"}


# ============ SUPPLIER PROFILES ============
@router.post("/{supplier_id}/profiles", response_model=SupplierProfile)
@limiter.limit("10/minute")
@check_permission("master-data:create")
def create_supplier_profile(
    supplier_id: int,
    profile: SupplierProfileCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un profil fournisseur"""
    # Vérifier que le fournisseur existe
    supplier = SupplierService.get_supplier(db, supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    
    return SupplierService.create_supplier_profile(db, supplier_id, profile, current_user.username)
