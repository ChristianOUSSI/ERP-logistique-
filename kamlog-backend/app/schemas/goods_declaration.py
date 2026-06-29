# app/schemas/goods_declaration.py - Schemas pour les déclarations de marchandises
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class StatutGoodsDeclaration(str):
    """Statuts des déclarations de marchandises"""
    BROUILLON = "BROUILLON"
    VALIDEE = "VALIDEE"
    ANNULEE = "ANNULEE"
    EN_TRANSIT = "EN_TRANSIT"
    ARRIVEE = "ARRIVEE"


class LigneGoodsDeclarationBase(BaseModel):
    """Base schema pour les lignes de déclaration"""
    article_id: int
    quantite_declaree: Decimal = Field(..., gt=0)
    unite_mesure: str
    poids_kg: Optional[Decimal] = None
    valeur_unitaire_xaf: Optional[Decimal] = None
    valeur_totale_xaf: Optional[Decimal] = None


class LigneGoodsDeclarationCreate(LigneGoodsDeclarationBase):
    """Schema pour créer une ligne de déclaration"""
    pass


class LigneGoodsDeclarationResponse(LigneGoodsDeclarationBase):
    """Schema pour répondre avec une ligne de déclaration"""
    id: int
    declaration_id: int
    model_config = ConfigDict(from_attributes=True)


class GoodsDeclarationBase(BaseModel):
    """Base schema pour les déclarations de marchandises"""
    code_article: str = Field(..., min_length=1, max_length=20)
    code_transit: str = Field(..., min_length=1, max_length=20)
    description: Optional[str] = None
    quantite: Decimal = Field(..., gt=0)
    unite: str
    poids_kg: Optional[Decimal] = None
    valeur_xaf: Optional[Decimal] = None
    origine: Optional[str] = None
    destination: Optional[str] = None
    numero_conteneur: Optional[str] = None
    observations: Optional[str] = None


class GoodsDeclarationCreate(GoodsDeclarationBase):
    """Schema pour créer une déclaration de marchandises"""
    lignes: Optional[List[LigneGoodsDeclarationCreate]] = []


class GoodsDeclarationUpdate(BaseModel):
    """Schema pour mettre à jour une déclaration de marchandises"""
    code_article: Optional[str] = None
    code_transit: Optional[str] = None
    description: Optional[str] = None
    quantite: Optional[Decimal] = None
    unite: Optional[str] = None
    poids_kg: Optional[Decimal] = None
    valeur_xaf: Optional[Decimal] = None
    origine: Optional[str] = None
    destination: Optional[str] = None
    numero_conteneur: Optional[str] = None
    observations: Optional[str] = None
    statut: Optional[str] = None


class GoodsDeclarationResponse(GoodsDeclarationBase):
    """Schema pour répondre avec une déclaration de marchandises"""
    id: int
    numero_declaration: str
    statut: str
    cree_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    lignes: List[LigneGoodsDeclarationResponse] = []
    model_config = ConfigDict(from_attributes=True)
