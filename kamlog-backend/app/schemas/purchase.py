# app/schemas/purchase.py - Schémas Pydantic pour le module K-Achats
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.purchase import StatutFicheBesoin, PrioriteFicheBesoin


# --- Ligne Fiche de Besoin ---

class LigneFicheBesoinBase(BaseModel):
    """Base pour une ligne de fiche de besoin"""
    code_article: Optional[str] = Field(None, max_length=50, description="Code article si existant")
    designation: str = Field(..., max_length=255, description="Désignation de l'article/service")
    description: Optional[str] = Field(None, description="Description détaillée")
    quantite_demandee: int = Field(..., gt=0, description="Quantité demandée")
    unite: Optional[str] = Field(None, max_length=20, description="Unité de mesure")
    prix_unitaire_estime: Optional[Decimal] = Field(None, ge=0, description="Prix unitaire estimé")
    specifications: Optional[str] = Field(None, description="Spécifications techniques")
    reference_fabricant: Optional[str] = Field(None, max_length=100, description="Référence fabricant")


class LigneFicheBesoinCreate(LigneFicheBesoinBase):
    """Schéma pour créer une ligne de fiche de besoin"""
    pass


class LigneFicheBesoinResponse(LigneFicheBesoinBase):
    """Schéma de réponse pour une ligne de fiche de besoin"""
    id: int
    fiche_besoin_id: int
    montant_total_estime: Optional[Decimal] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Fiche de Besoin ---

class FicheBesoinBase(BaseModel):
    """Base pour une fiche de besoin"""
    matricule: str = Field(..., max_length=50, description="Numéro unique de la fiche")
    titre: str = Field(..., max_length=255, description="Titre de la demande")
    description: Optional[str] = Field(None, description="Description détaillée")
    priorite: PrioriteFicheBesoin = Field(PrioriteFicheBesoin.NORMALE, description="Priorité")
    montant_estime: Optional[Decimal] = Field(None, ge=0, description="Montant estimé total")
    devise: str = Field("XAF", max_length=3, description="Devise")
    date_besoin: Optional[datetime] = Field(None, description="Date souhaitée de réception")


class FicheBesoinCreate(FicheBesoinBase):
    """Schéma pour créer une fiche de besoin"""
    lignes: List[LigneFicheBesoinCreate] = Field(default_factory=list, description="Lignes de la fiche")


class FicheBesoinUpdate(BaseModel):
    """Schéma pour mettre à jour une fiche de besoin"""
    titre: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    priorite: Optional[PrioriteFicheBesoin] = None
    montant_estime: Optional[Decimal] = Field(None, ge=0)
    devise: Optional[str] = Field(None, max_length=3)
    date_besoin: Optional[datetime] = None
    lignes: Optional[List[LigneFicheBesoinCreate]] = None


class FicheBesoinApproveReject(BaseModel):
    """Schéma pour approuver/rejeter une fiche de besoin"""
    is_approved: bool = Field(..., description="True pour approuver, False pour rejeter")
    notes: Optional[str] = Field(None, description="Notes de l'approbateur/rejet")


class FicheBesoinResponse(FicheBesoinBase):
    """Schéma de réponse pour une fiche de besoin"""
    id: int
    demandeur_id: int
    agence_id: int
    statut: StatutFicheBesoin
    date_soumission: Optional[datetime] = None
    date_approbation: Optional[datetime] = None
    approbateur_id: Optional[int] = None
    notes_approbation: Optional[str] = None
    commande_fournisseur_id: Optional[int] = None
    cree_par: str
    modifie_par: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    lignes: List[LigneFicheBesoinResponse] = []

    class Config:
        from_attributes = True
