# app/routers/master_data.py - Routes API pour les données de référence
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.schemas.magasin import (
    Article, ArticleCreate, ArticleUpdate,
    Incoterm, IncotermCreate, IncotermUpdate,
    TypeConteneur, TypeConteneurCreate, TypeConteneurUpdate
)
from app.services.magasin_service import ArticleService, IncotermService, TypeConteneurService
from app.models.magasin import UniteMesure, CategorieArticle
from app.routers.suppliers import router as suppliers_router


limiter = Limiter(key_func=get_remote_address)
router = APIRouter(tags=["Master Data"])

# Include suppliers router
router.include_router(suppliers_router, prefix="/suppliers")


# ============ ARTICLES ============
@router.get("/articles", response_model=List[Article])
def get_articles(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère tous les articles actifs"""
    if search:
        return ArticleService.search_articles(db, search)
    return ArticleService.get_all_articles(db, skip, limit)


@router.get("/articles/{article_id}", response_model=Article)
def get_article(article_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Récupère un article par son ID"""
    article = ArticleService.get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return article


@router.get("/articles/code/{code_article}", response_model=Article)
def get_article_by_code(code_article: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Récupère un article par son code"""
    article = ArticleService.get_article_by_code(db, code_article)
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return article


@router.post("/articles", response_model=Article)

@check_permission("article:create")
def create_article(
    article: ArticleCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un nouvel article avec génération automatique du code si non fourni"""
    return ArticleService.create_article(db, article)


@router.put("/articles/{article_id}", response_model=Article)

@check_permission("article:update")
def update_article(
    article_id: int, 
    article: ArticleUpdate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Met à jour un article"""
    updated_article = ArticleService.update_article(db, article_id, article)
    if not updated_article:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return updated_article


@router.delete("/articles/{article_id}")

@check_permission("article:delete")
def delete_article(
    article_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Supprime (désactive) un article"""
    success = ArticleService.delete_article(db, article_id)
    if not success:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return {"message": "Article désactivé avec succès"}


# ============ INCOTERMS ============
@router.get("/incoterms", response_model=List[Incoterm])
def get_incoterms(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère tous les Incoterms"""
    return IncotermService.get_all(db, skip, limit)


@router.get("/incoterms/{incoterm_id}", response_model=Incoterm)
def get_incoterm(incoterm_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Récupère un Incoterm par son ID"""
    incoterm = IncotermService.get_by_id(db, incoterm_id)
    if not incoterm:
        raise HTTPException(status_code=404, detail="Incoterm non trouvé")
    return incoterm


@router.post("/incoterms", response_model=Incoterm)

@check_permission("article:create")
def create_incoterm(
    incoterm: IncotermCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un nouvel Incoterm"""
    return IncotermService.create(db, incoterm)


@router.put("/incoterms/{incoterm_id}", response_model=Incoterm)

@check_permission("article:update")
def update_incoterm(
    incoterm_id: int,
    incoterm: IncotermUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Met à jour un Incoterm"""
    updated = IncotermService.update(db, incoterm_id, incoterm)
    if not updated:
        raise HTTPException(status_code=404, detail="Incoterm non trouvé")
    return updated


@router.delete("/incoterms/{incoterm_id}")

@check_permission("article:delete")
def delete_incoterm(
    incoterm_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Supprime un Incoterm"""
    success = IncotermService.delete(db, incoterm_id)
    if not success:
        raise HTTPException(status_code=404, detail="Incoterm non trouvé")
    return {"message": "Incoterm supprimé avec succès"}


# ============ CONTAINER TYPES ============
@router.get("/container-types", response_model=List[TypeConteneur])
def get_container_types(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère tous les types de conteneurs"""
    return TypeConteneurService.get_all(db, skip, limit)


@router.get("/container-types/{type_id}", response_model=TypeConteneur)
def get_container_type(type_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Récupère un type de conteneur par son ID"""
    type_cont = TypeConteneurService.get_by_id(db, type_id)
    if not type_cont:
        raise HTTPException(status_code=404, detail="Type de conteneur non trouvé")
    return type_cont


@router.post("/container-types", response_model=TypeConteneur)

@check_permission("article:create")
def create_container_type(
    type_cont: TypeConteneurCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un nouveau type de conteneur"""
    return TypeConteneurService.create(db, type_cont)


@router.put("/container-types/{type_id}", response_model=TypeConteneur)

@check_permission("article:update")
def update_container_type(
    type_id: int,
    type_cont: TypeConteneurUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Met à jour un type de conteneur"""
    updated = TypeConteneurService.update(db, type_id, type_cont)
    if not updated:
        raise HTTPException(status_code=404, detail="Type de conteneur non trouvé")
    return updated


@router.delete("/container-types/{type_id}")

@check_permission("article:delete")
def delete_container_type(
    type_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Supprime un type de conteneur"""
    success = TypeConteneurService.delete(db, type_id)
    if not success:
        raise HTTPException(status_code=404, detail="Type de conteneur non trouvé")
    return {"message": "Type de conteneur supprimé avec succès"}


# ============ STATIC REFERENCE ENUMS ============
@router.get("/units", response_model=List[str])
def get_measurement_units(current_user = Depends(get_current_user)):
    """Récupère la liste des unités de mesure définies dans l'Enum"""
    return [unit.value for unit in UniteMesure]


@router.get("/article-categories", response_model=List[str])
def get_article_categories(current_user = Depends(get_current_user)):
    """Récupère la liste des catégories d'articles définies dans l'Enum"""
    return [cat.value for cat in CategorieArticle]
