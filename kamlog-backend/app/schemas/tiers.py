# app/schemas/tiers.py  Schémas Tiers (Refonte SAP-Style)
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from decimal import Decimal
from datetime import datetime
from typing import Optional
from app.models.tiers import StatutTiers


class TiersBase(BaseModel):
    code_tiers: Optional[str] = Field(None, max_length=20, pattern=r"^[A-Z0-9]+$", example="TIER001")
    raison_sociale: str = Field(..., min_length=2, max_length=150, example="Société Générale du Cameroun")
    sigle_ou_enseigne: Optional[str] = Field(None, max_length=50, example="SGC")
    niu: str = Field(..., max_length=50, pattern=r"^[A-Za-z0-9\-\s]+$", example="CM-OUEST-123-456")
    rccm: Optional[str] = Field(None, max_length=50, example="RC/DLA/2020/B/1234")
    registre_commerce: Optional[str] = Field(None, max_length=50, example="RC/DLA/2020/B/1234")
    regime_fiscal: str = Field(default="Réel - Grandes Entreprises", max_length=100, example="Réel - Grandes Entreprises")
    email: Optional[EmailStr] = Field(None, example="contact@sgc.cm")
    telephone: Optional[str] = Field(None, max_length=25, pattern=r"^\+?[0-9\s\-\(\)]+$", example="+237 6xx xxx xxx")
    adresse_physique: Optional[str] = Field(None, example="Bonabéri, Zone Industrielle")
    adresse: Optional[str] = Field(None, example="BP 12345 Douala")
    ville: str = Field(default="Douala", max_length=50, example="Douala")
    pays: str = Field(default="Cameroun", max_length=50, example="Cameroun")
    conditions_facturation: Optional[dict] = Field(default_factory=dict, example={"mode": "facture", "journalière": False})


class TiersCreate(TiersBase):
    # Services à la carte
    autorise_acconage: bool = Field(default=False, example=True)
    autorise_transit: bool = Field(default=False, example=True)
    autorise_parc_stockage: bool = Field(default=False, example=False)
    autorise_manutention: bool = Field(default=False, example=True)
    autorise_transport: bool = Field(default=False, example=True)
    autorise_magasinage: bool = Field(default=False, example=True)
    # Paramètres financiers
    compte_collectif_syscohada: str = Field(default="411100", max_length=15, example="411100")
    compte_syscohada: Optional[str] = Field(None, max_length=20, example="411100001")
    limite_credit_maximum: Decimal = Field(default=0, ge=0, example=5000000)
    limite_credit_xaf: Decimal = Field(default=0, ge=0, example=5000000)
    delai_paiement_jours: int = Field(default=30, ge=0, example=30)


class TiersUpdate(BaseModel):
    raison_sociale: Optional[str] = Field(None, max_length=150, example="Société Générale du Cameroun SA")
    sigle_ou_enseigne: Optional[str] = Field(None, max_length=50, example="SGC")
    registre_commerce: Optional[str] = Field(None, max_length=50, example="RC/DLA/2020/B/1234")
    registre_commerce: Optional[str] = Field(None, max_length=50, example="RC/DLA/2020/B/1234")
    regime_fiscal: Optional[str] = Field(None, max_length=100, example="Réel - Grandes Entreprises")
    email: Optional[str] = Field(None, example="nouveau.contact@sgc.cm")
    telephone: Optional[str] = Field(None, max_length=25, example="+237 6xx xxx xxx")
    adresse_physique: Optional[str] = Field(None, example="Nouvelle adresse, Bonabéri")
    adresse: Optional[str] = Field(None, example="BP 67890 Douala")
    ville: Optional[str] = Field(None, max_length=50, example="Douala")
    # Services à la carte
    autorise_acconage: Optional[bool] = Field(None, example=True)
    autorise_transit: Optional[bool] = Field(None, example=False)
    autorise_parc_stockage: Optional[bool] = Field(None, example=True)
    autorise_manutention: Optional[bool] = Field(None, example=True)
    autorise_transport: Optional[bool] = Field(None, example=True)
    autorise_magasinage: Optional[bool] = Field(None, example=False)
    # Financier
    compte_collectif_syscohada: Optional[str] = Field(None, max_length=15, example="411100")
    compte_syscohada: Optional[str] = Field(None, max_length=20, example="411100002")
    limite_credit_maximum: Optional[Decimal] = Field(None, ge=0, example=7500000)
    limite_credit_xaf: Optional[Decimal] = Field(None, ge=0, example=7500000)
    delai_paiement_jours: Optional[int] = Field(None, ge=0, example=45)
    conditions_facturation: Optional[dict] = Field(None, example={"mode": "prélèvement automatique", "journalière": True})
    statut: Optional[StatutTiers] = Field(None, example=StatutTiers.ACTIF)


class TiersResponse(TiersBase):
    id: int = Field(..., example=1)
    code_tiers: str = Field(..., example="TIER001")
    statut: StatutTiers = Field(..., example=StatutTiers.ACTIF)
    # Services
    autorise_acconage: bool = Field(..., example=True)
    autorise_transit: bool = Field(..., example=True)
    autorise_parc_stockage: bool = Field(..., example=False)
    autorise_manutention: bool = Field(..., example=True)
    autorise_transport: bool = Field(..., example=True)
    autorise_magasinage: bool = Field(..., example=True)
    # Finance
    compte_collectif_syscohada: str = Field(..., example="411100")
    compte_syscohada: Optional[str] = Field(None, example="411100001")
    limite_credit_maximum: Decimal = Field(..., example=5000000)
    limite_credit_xaf: Decimal = Field(..., example=5000000)
    delai_paiement_jours: int = Field(..., example=30)
    # Timestamps
    created_at: datetime = Field(..., example="2026-07-15T10:30:00Z")
    updated_at: datetime = Field(..., example="2026-07-15T14:45:00Z")
    model_config = ConfigDict(from_attributes=True)
