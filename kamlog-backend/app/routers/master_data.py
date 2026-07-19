# app/routers/master_data.py - Routes API pour les données de référence
from app.utils.rbac import require_role
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.utils.rate_limiting import limiter, RATE_LIMITS
from app.utils.cache import cache_result, cache_service
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
@cache_result("articles_list", expire=300)  # Cache for 5 minutes
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
@require_role(["admin", "manager"])

@check_permission("article:create")
def create_article(
    article: ArticleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un nouvel article avec génération automatique du code si non fourni"""
    result = ArticleService.create_article(db, article)
    # Invalidate articles list cache
    cache_service.delete_pattern("articles_list*")
    cache_service.delete_pattern("articles:*")
    return result


@router.put("/articles/{article_id}", response_model=Article)
@require_role(["admin", "manager"])

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
    # Invalidate articles list cache
    cache_service.delete_pattern("articles_list*")
    cache_service.delete_pattern(f"articles:{article_id}*")
    return updated_article


@router.delete("/articles/{article_id}")
@require_role(["admin", "manager"])

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
@cache_result("incoterms_list", expire=300)  # Cache for 5 minutes
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
@require_role(["admin", "manager"])

@check_permission("article:create")
def create_incoterm(
    incoterm: IncotermCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un nouvel Incoterm"""
    result = IncotermService.create(db, incoterm)
    # Invalidate incoterms list cache
    cache_service.delete_pattern("incoterms_list*")
    return result


@router.put("/incoterms/{incoterm_id}", response_model=Incoterm)
@require_role(["admin", "manager"])

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
    # Invalidate incoterms list cache
    cache_service.delete_pattern("incoterms_list*")
    # Invalidate specific incoterm cache
    cache_service.delete_pattern(f"incoterms:{incoterm_id}*")
    return updated


@router.delete("/incoterms/{incoterm_id}")
@require_role(["admin", "manager"])

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
    # Invalidate incoterms list cache
    cache_service.delete_pattern("incoterms_list*")
    # Invalidate specific incoterm cache
    cache_service.delete_pattern(f"incoterms:{incoterm_id}*")
    return {"message": "Incoterm supprimé avec succès"}


# ============ CONTAINER TYPES ============
@router.get("/container-types", response_model=List[TypeConteneur])
@cache_result("container_types_list", expire=300)  # Cache for 5 minutes
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
@require_role(["admin", "manager"])

@check_permission("article:create")
def create_container_type(
    type_cont: TypeConteneurCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un nouveau type de conteneur"""
    result = TypeConteneurService.create(db, type_cont)
    # Invalidate container types list cache
    cache_service.delete_pattern("container_types_list*")
    return result


@router.put("/container-types/{type_id}", response_model=TypeConteneur)
@require_role(["admin", "manager"])

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
    # Invalidate container types list cache
    cache_service.delete_pattern("container_types_list*")
    # Invalidate specific container type cache
    cache_service.delete_pattern(f"container_types:{type_id}*")
    return updated


@router.delete("/container-types/{type_id}")
@require_role(["admin", "manager"])

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
    # Invalidate container types list cache
    cache_service.delete_pattern("container_types_list*")
    # Invalidate specific container type cache
    cache_service.delete_pattern(f"container_types:{type_id}*")
    return {"message": "Type de conteneur supprimé avec succès"}


# ============ BULK OPERATIONS ============
@router.post("/articles/bulk", response_model=List[Article])
@require_role(["admin", "manager"])
@check_permission("article:create")
@limiter.limit(RATE_LIMITS["bulk"])
def create_articles_bulk(
    request: Request,
    articles: List[ArticleCreate],
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée plusieurs articles en une seule opération"""
    created_articles = []
    for article_data in articles:
        article = ArticleService.create_article(db, article_data)
        created_articles.append(article)
    # Invalidate articles list cache after bulk creation
    cache_service.delete_pattern("articles_list*")


@router.post("/incoterms/bulk", response_model=List[Incoterm])
@require_role(["admin", "manager"])
@check_permission("article:create")
@limiter.limit(RATE_LIMITS["bulk"])
def create_incoterms_bulk(request: Request,
    incoterms: List[IncotermCreate],
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée plusieurs Incoterms en une seule opération"""
    created_incoterms = []
    for incoterm_data in incoterms:
        incoterm = IncotermService.create(db, incoterm_data)
        created_incoterms.append(incoterm)
    # Invalidate incoterms list cache after bulk creation
    cache_service.delete_pattern("incoterms_list*")
    return created_incoterms


@router.post("/container-types/bulk", response_model=List[TypeConteneur])
@require_role(["admin", "manager"])
@check_permission("article:create")
@limiter.limit(RATE_LIMITS["bulk"])
def create_container_types_bulk(request: Request,
    container_types: List[TypeConteneurCreate],
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée plusieurs types de conteneurs en une seule opération"""
    created_types = []
    for type_data in container_types:
        type_cont = TypeConteneurService.create(db, type_data)
        created_types.append(type_cont)
    # Invalidate container types list cache after bulk creation
    cache_service.delete_pattern("container_types_list*")
    return created_types


# ============ STATIC REFERENCE ENUMS ============
@router.get("/units", response_model=List[str])
@cache_result("measurement_units", expire=86400)  # Cache for 24 hours (static data)
def get_measurement_units(current_user = Depends(get_current_user)):
    """Récupère la liste des unités de mesure définies dans l'Enum"""
    return [unit.value for unit in UniteMesure]


@router.get("/article-categories", response_model=List[dict])
@cache_result("article_categories", expire=86400)  # Cache for 24 hours (static data)
def get_article_categories(current_user = Depends(get_current_user)):
    """Récupère la liste des catégories d'articles définies dans l'Enum"""
    category_labels = {
        "ALIMENTAIRE": "Alimentaire",
        "PHARMACEUTIQUE": "Produits Pharmaceutiques",
        "MATIERES_PREMIERES": "Matières Premières",
        "PRODUITS_FINIS": "Produits Finis",
        "EMBALLAGES_PALETES": "Emballages et Palettes",
        "EQUIPEMENT": "Équipement",
        "PIECES_DETACHEES": "Pièces Détachées",
        "MOBILIER_BUREAU_INFORMATIQUE": "Mobilier de Bureau / Informatique",
        "PRODUITS_DANGEREUX": "Produits Dangereux (HAZMAT)",
        "PRODUITS_LUXE_VALEUR": "Produits de Luxe / Valeur",
        "VRAC": "Vrac (Bulk)",
        "HORS_GABARIT": "Hors-Gabarit (OOG)",
    }
    return [{"value": cat.value, "label": category_labels[cat.value]} for cat in CategorieArticle]
