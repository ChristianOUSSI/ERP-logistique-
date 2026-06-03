# app/schemas/finance.py — Schémas Finance
from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
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


class EncaissementResponse(EncaissementBase):
    id: int
    facture_id: int | None
    lettree: bool
    created_at: datetime

    class Config:
        from_attributes = True


class GrilleTarifaireBase(BaseModel):
    code_tarif: str = Field(..., max_length=20)
    tiers_id: int | None
    service: str = Field(..., max_length=50)
    type_marchandise: str = Field(..., max_length=50)
    tarif_unitaire_xaf: Decimal = Field(..., ge=0)
    unite: str = Field(..., max_length=20)
    date_debut_validite: datetime
    date_fin_validite: datetime


class GrilleTarifaireCreate(GrilleTarifaireBase):
    pass


class GrilleTarifaireResponse(GrilleTarifaireBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class EncoursResponse(BaseModel):
    tiers_id: int
    encours_xaf: Decimal
    limite_credit_xaf: Decimal
    taux_occupation: float | None
    alerte: bool
    bloque: bool
