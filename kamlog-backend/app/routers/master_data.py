# app/routers/master_data.py - Routes API pour les données de référence
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.schemas.magasin import Article, ArticleCreate, ArticleUpdate
from app.services.magasin_service import ArticleService
from app.routers.suppliers import router as suppliers_router


limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/master-data", tags=["Master Data"])

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
@limiter.limit("10/minute")
@check_permission("article:create")
def create_article(
    article: ArticleCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crée un nouvel article avec génération automatique du code si non fourni"""
    return ArticleService.create_article(db, article)


@router.put("/articles/{article_id}", response_model=Article)
@limiter.limit("20/minute")
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
@limiter.limit("10/minute")
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
