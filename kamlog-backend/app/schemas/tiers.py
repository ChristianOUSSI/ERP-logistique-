# app/schemas/tiers.py  Schémas Tiers
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from decimal import Decimal
from datetime import datetime
from app.models.tiers import StatutTiers


class TiersBase(BaseModel):
    code_tiers: str = Field(..., max_length=20)
    raison_sociale: str = Field(..., max_length=200)
    niu: str = Field(..., max_length=20)
    rccm: str | None = Field(None, max_length=50)
    email: EmailStr | None
    telephone: str | None = Field(None, max_length=30)
    adresse: str | None
    ville: str | None = Field(None, max_length=100)
    pays: str = "Cameroun"


class TiersCreate(TiersBase):
    autorise_transport: bool = False
    autorise_transit: bool = False
    autorise_acconage: bool = False
    autorise_magasinage: bool = False
    compte_syscohada: str | None = Field(None, max_length=20)
    limite_credit_xaf: Decimal = Field(default=0, ge=0)


class TiersUpdate(BaseModel):
    raison_sociale: str | None = Field(None, max_length=200)
    email: EmailStr | None
    telephone: str | None = Field(None, max_length=30)
    adresse: str | None
    ville: str | None = Field(None, max_length=100)
    autorise_transport: bool | None
    autorise_transit: bool | None
    autorise_acconage: bool | None
    autorise_magasinage: bool | None
    compte_syscohada: str | None = Field(None, max_length=20)
    limite_credit_xaf: Decimal | None = Field(None, ge=0)
    statut: StatutTiers | None


class TiersResponse(TiersBase):
    id: int
    statut: StatutTiers
    autorise_transport: bool
    autorise_transit: bool
    autorise_acconage: bool
    autorise_magasinage: bool
    compte_syscohada: str | None
    limite_credit_xaf: Decimal
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
