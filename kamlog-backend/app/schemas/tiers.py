# app/schemas/tiers.py  Schémas Tiers (Refonte SAP-Style)
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from decimal import Decimal
from datetime import datetime
from typing import Optional
from app.models.tiers import StatutTiers


class TiersBase(BaseModel):
    code_tiers: str = Field(..., max_length=20)
    raison_sociale: str = Field(..., max_length=150)
    sigle_ou_enseigne: Optional[str] = Field(None, max_length=50)
    niu: str = Field(..., max_length=50)
    rccm: Optional[str] = Field(None, max_length=50)
    registre_commerce: Optional[str] = Field(None, max_length=50)
    regime_fiscal: str = Field(default="Réel - Grandes Entreprises", max_length=100)
    email: Optional[str] = None
    telephone: Optional[str] = Field(None, max_length=25)
    adresse_physique: Optional[str] = None
    adresse: Optional[str] = None
    ville: str = Field(default="Douala", max_length=50)
    pays: str = Field(default="Cameroun", max_length=50)


class TiersCreate(TiersBase):
    # Services à la carte
    autorise_acconage: bool = False
    autorise_transit: bool = False
    autorise_parc_stockage: bool = False
    autorise_manutention: bool = False
    autorise_transport: bool = False
    autorise_magasinage: bool = False
    # Paramètres financiers
    compte_collectif_syscohada: str = Field(default="411100", max_length=15)
    compte_syscohada: Optional[str] = Field(None, max_length=20)
    limite_credit_maximum: Decimal = Field(default=0, ge=0)
    limite_credit_xaf: Decimal = Field(default=0, ge=0)
    delai_paiement_jours: int = Field(default=30, ge=0)


class TiersUpdate(BaseModel):
    raison_sociale: Optional[str] = Field(None, max_length=150)
    sigle_ou_enseigne: Optional[str] = Field(None, max_length=50)
    registre_commerce: Optional[str] = Field(None, max_length=50)
    regime_fiscal: Optional[str] = Field(None, max_length=100)
    email: Optional[str] = None
    telephone: Optional[str] = Field(None, max_length=25)
    adresse_physique: Optional[str] = None
    adresse: Optional[str] = None
    ville: Optional[str] = Field(None, max_length=50)
    # Services à la carte
    autorise_acconage: Optional[bool] = None
    autorise_transit: Optional[bool] = None
    autorise_parc_stockage: Optional[bool] = None
    autorise_manutention: Optional[bool] = None
    autorise_transport: Optional[bool] = None
    autorise_magasinage: Optional[bool] = None
    # Financier
    compte_collectif_syscohada: Optional[str] = Field(None, max_length=15)
    compte_syscohada: Optional[str] = Field(None, max_length=20)
    limite_credit_maximum: Optional[Decimal] = Field(None, ge=0)
    limite_credit_xaf: Optional[Decimal] = Field(None, ge=0)
    delai_paiement_jours: Optional[int] = Field(None, ge=0)
    statut: Optional[StatutTiers] = None


class TiersResponse(TiersBase):
    id: int
    statut: StatutTiers
    # Services
    autorise_acconage: bool
    autorise_transit: bool
    autorise_parc_stockage: bool
    autorise_manutention: bool
    autorise_transport: bool
    autorise_magasinage: bool
    # Finance
    compte_collectif_syscohada: str
    compte_syscohada: Optional[str] = None
    limite_credit_maximum: Decimal
    limite_credit_xaf: Decimal
    delai_paiement_jours: int
    # Timestamps
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
