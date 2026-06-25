# app/schemas/finance.py  Schémas Finance
from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from typing import Optional, List
from app.models.finance import StatutFacture



class FactureBase(BaseModel):
    numero_facture: str = Field(..., max_length=30)
    tiers_id: int
    montant_ht_xaf: Decimal = Field(..., ge=0)
    tva_xaf: Decimal = Field(..., ge=0)
    montant_ttc_xaf: Decimal = Field(..., ge=0)
    date_emission: datetime
    date_echeance: datetime | None
    notes: str | None


class FactureCreate(FactureBase):
    dossier_id: int | None = None
    mission_id: int | None = None


class FactureUpdate(BaseModel):
    numero_facture: Optional[str] = Field(None, max_length=30)
    tiers_id: Optional[int] = None
    montant_ht_xaf: Optional[Decimal] = Field(None, ge=0)
    tva_xaf: Optional[Decimal] = Field(None, ge=0)
    montant_ttc_xaf: Optional[Decimal] = Field(None, ge=0)
    date_emission: Optional[datetime] = None
    date_echeance: Optional[datetime] = None
    notes: Optional[str] = None
    dossier_id: Optional[int] = None
    mission_id: Optional[int] = None
    statut: Optional[StatutFacture] = None


class FactureResponse(FactureBase):
    id: int
    statut: StatutFacture
    dossier_id: int | None
    mission_id: int | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EncaissementBase(BaseModel):
    reference: str = Field(..., max_length=30)
    tiers_id: int
    montant_xaf: Decimal = Field(..., ge=0)
    mode_paiement: str = Field(..., max_length=50)
    date_paiement: datetime
    reference_paiement: str | None = Field(None, max_length=100)
    notes: str | None


class EncaissementCreate(EncaissementBase):
    facture_id: int | None = None


class EncaissementUpdate(BaseModel):
    reference: Optional[str] = Field(None, max_length=30)
    tiers_id: Optional[int] = None
    montant_xaf: Optional[Decimal] = Field(None, ge=0)
    mode_paiement: Optional[str] = Field(None, max_length=50)
    date_paiement: Optional[datetime] = None
    reference_paiement: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    facture_id: Optional[int] = None
    lettree: Optional[bool] = None


class EncaissementResponse(EncaissementBase):
    id: int
    facture_id: int | None
    lettree: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LigneTarifaireBase(BaseModel):
    description: str
    unite: str
    prix_unitaire: Decimal = Field(..., gt=0)
    devise: str = "XAF"

class LigneTarifaireCreate(LigneTarifaireBase):
    pass

class LigneTarifaireResponse(LigneTarifaireBase):
    id: int

    class Config:
        from_attributes = True

class GrilleTarifaireBase(BaseModel):
    code: str = Field(..., max_length=50)
    nom: str = Field(..., max_length=200)
    service: Optional[str] = None
    groupe_client: Optional[str] = "Tous"
    date_debut_validite: datetime
    date_fin_validite: datetime
    est_actif: bool = True


class GrilleTarifaireCreate(GrilleTarifaireBase):
    lignes: List[LigneTarifaireCreate] = []


class GrilleTarifaireUpdate(BaseModel):
    code: Optional[str] = Field(None, max_length=50)
    nom: Optional[str] = Field(None, max_length=200)
    service: Optional[str] = None
    groupe_client: Optional[str] = None
    date_debut_validite: Optional[datetime] = None
    date_fin_validite: Optional[datetime] = None
    est_actif: Optional[bool] = None
    lignes: Optional[List[LigneTarifaireCreate]] = None


class GrilleTarifaireResponse(GrilleTarifaireBase):
    id: int
    cree_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    lignes: List[LigneTarifaireResponse] = []

    class Config:
        from_attributes = True


class EncoursResponse(BaseModel):
    tiers_id: int
    encours_xaf: Decimal
    limite_credit_xaf: Decimal
    taux_occupation: float | None
    alerte: bool
    bloque: bool


class BankStatementEntry(BaseModel):
    """Schéma pour une ligne de relevé bancaire importée."""
    date: datetime
    description: str
    amount: Decimal


class ReconciliationMatchResponse(BaseModel):
    """Schéma pour un résultat de rapprochement."""
    bank_entry: BankStatementEntry
    erp_match: Optional[EncaissementResponse] = None
    confidence: float

    class Config:
        from_attributes = True


class AvoirBase(BaseModel):
    """Schéma de base pour un avoir."""
    numero_avoir: str = Field(..., max_length=50)
    facture_origine_id: Optional[int] = None
    tiers_id: int
    montant_xaf: Decimal = Field(..., gt=0)
    motif: str = Field(..., max_length=500)


class AvoirCreate(AvoirBase):
    """Schéma pour la création d'un avoir."""
    pass


class AvoirResponse(AvoirBase):
    """Schéma pour la réponse d'un avoir."""
    id: int
    date_emission: datetime
    est_utilise: bool
    cree_par: Optional[str] = None

    class Config:
        from_attributes = True
