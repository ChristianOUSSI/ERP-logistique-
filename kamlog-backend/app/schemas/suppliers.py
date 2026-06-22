# app/schemas/suppliers.py - Schemas pour les fournisseurs
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class StatutSupplier(str):
    """Statuts des fournisseurs"""
    ACTIF = "ACTIF"
    BLOQUE = "BLOQUE"
    INACTIF = "INACTIF"
    EN_VALIDATION = "EN_VALIDATION"


class CategorieSupplier(str):
    """Catégories de fournisseurs"""
    TRANSPORT = "TRANSPORT"
    ACQUISITION = "ACQUISITION"
    SERVICE = "SERVICE"
    EQUIPEMENT = "EQUIPEMENT"
    FOURNITURE = "FOURNITURE"


class SupplierProfileBase(BaseModel):
    """Base schema pour le profil fournisseur"""
    categorie_fournisseur: Optional[str] = None
    delai_moyen_livraison: Optional[int] = None
    qualite_service: Optional[str] = None
    notes: Optional[str] = None
    date_evaluation: Optional[datetime] = None


class SupplierProfileCreate(SupplierProfileBase):
    """Schema pour créer un profil fournisseur"""
    supplier_id: int


class SupplierProfileResponse(SupplierProfileBase):
    """Schema pour répondre avec un profil fournisseur"""
    id: int
    supplier_id: int
    cree_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class SupplierBase(BaseModel):
    """Base schema pour les fournisseurs"""
    code_fournisseur: str = Field(..., min_length=1, max_length=20)
    raison_sociale: str = Field(..., min_length=1, max_length=200)
    acronyme: Optional[str] = None
    type_entite: Optional[str] = None
    niu: str = Field(..., min_length=1, max_length=20)
    rccm: Optional[str] = None
    id_fiscal: Optional[str] = None
    adresse: Optional[str] = None
    boite_postale: Optional[str] = None
    ville: Optional[str] = None
    region: Optional[str] = None
    pays: str = Field(default="Cameroun")
    telephone: Optional[str] = None
    email: Optional[str] = None
    conditions_paiement: Optional[str] = None
    devise: str = Field(default="XAF")
    limite_credit_xaf: Decimal = Field(default=0, ge=0)
    compte_bancaire: Optional[str] = None
    nom_banque: Optional[str] = None
    categorie: Optional[str] = None


class SupplierCreate(SupplierBase):
    """Schema pour créer un fournisseur"""
    pass


class SupplierUpdate(BaseModel):
    """Schema pour mettre à jour un fournisseur"""
    raison_sociale: Optional[str] = None
    acronyme: Optional[str] = None
    type_entite: Optional[str] = None
    rccm: Optional[str] = None
    id_fiscal: Optional[str] = None
    adresse: Optional[str] = None
    boite_postale: Optional[str] = None
    ville: Optional[str] = None
    region: Optional[str] = None
    pays: Optional[str] = None
    telephone: Optional[str] = None
    email: Optional[str] = None
    conditions_paiement: Optional[str] = None
    devise: Optional[str] = None
    limite_credit_xaf: Optional[Decimal] = None
    compte_bancaire: Optional[str] = None
    nom_banque: Optional[str] = None
    categorie: Optional[str] = None
    statut: Optional[str] = None
    est_actif: Optional[bool] = None


class SupplierResponse(SupplierBase):
    """Schema pour répondre avec un fournisseur"""
    id: int
    statut: str
    est_actif: bool
    cree_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    profiles: list[SupplierProfileResponse] = []
    
    class Config:
        from_attributes = True
