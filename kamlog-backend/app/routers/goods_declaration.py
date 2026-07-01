# app/routers/goods_declaration.py - Routes API pour les déclarations de marchandises
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.schemas.goods_declaration import (
    GoodsDeclarationResponse, GoodsDeclarationCreate, GoodsDeclarationUpdate,
    LigneGoodsDeclarationResponse, LigneGoodsDeclarationCreate
)
from app.services.goods_declaration_service import GoodsDeclarationService


limiter = Limiter(key_func=get_remote_address)
router = APIRouter(tags=["Goods Declaration"])


# ============ GOODS DECLARATIONS ============
@router.get("/", response_model=List[GoodsDeclarationResponse])
def get_goods_declarations(
    skip: int = 0,
    limit: int = 100,
    statut: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère toutes les déclarations de marchandises"""
    if statut:
        return GoodsDeclarationService.get_goods_declarations_by_statut(db, statut)
    return GoodsDeclarationService.get_all_goods_declarations(db, skip, limit)


@router.get("/{declaration_id}", response_model=GoodsDeclarationResponse)
def get_goods_declaration(declaration_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Récupère une déclaration de marchandises par son ID"""
    declaration = GoodsDeclarationService.get_goods_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration de marchandises non trouvée")
    return declaration


@router.post("/", response_model=GoodsDeclarationResponse)

@check_permission("transport:create")
def create_goods_declaration(
    declaration: GoodsDeclarationCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée une nouvelle déclaration de marchandises"""
    return GoodsDeclarationService.create_goods_declaration(db, declaration, current_user.username)


@router.put("/{declaration_id}", response_model=GoodsDeclarationResponse)

@check_permission("transport:update")
def update_goods_declaration(
    declaration_id: int, 
    declaration: GoodsDeclarationUpdate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Met à jour une déclaration de marchandises"""
    updated_declaration = GoodsDeclarationService.update_goods_declaration(db, declaration_id, declaration)
    if not updated_declaration:
        raise HTTPException(status_code=404, detail="Déclaration de marchandises non trouvée")
    return updated_declaration


@router.delete("/{declaration_id}")

@check_permission("transport:delete")
def delete_goods_declaration(
    declaration_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Supprime une déclaration de marchandises"""
    success = GoodsDeclarationService.delete_goods_declaration(db, declaration_id)
    if not success:
        raise HTTPException(status_code=404, detail="Déclaration de marchandises non trouvée")
    return {"message": "Déclaration supprimée avec succès"}


# ============ LIGNES GOODS DECLARATION ============
@router.post("/{declaration_id}/lignes", response_model=LigneGoodsDeclarationResponse)

@check_permission("transport:create")
def add_ligne_goods_declaration(
    declaration_id: int, 
    ligne: LigneGoodsDeclarationCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Ajoute une ligne à une déclaration de marchandises"""
    # Vérifier que la déclaration existe
    declaration = GoodsDeclarationService.get_goods_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration de marchandises non trouvée")
    
    return GoodsDeclarationService.add_ligne_goods_declaration(db, declaration_id, ligne)
