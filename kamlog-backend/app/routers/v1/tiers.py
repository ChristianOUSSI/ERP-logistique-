# app/routers/v1/tiers.py — Router Tiers, Articles, Déclarations & Missions
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db
from app.models.tiers import Tiers, Article, Declaration, Mission

router = APIRouter()

@router.get("/")
def list_tiers(
    db: Session = Depends(get_db),
    type: Optional[str] = Query(None),
    limit: int = 100
):
    query = select(Tiers)
    if type:
        query = query.where(Tiers.type == type)
    results = db.execute(query.limit(limit)).scalars().all()
    return results

@router.get("/{tiers_id}")
def get_tiers(tiers_id: int, db: Session = Depends(get_db)):
    t = db.execute(select(Tiers).where(Tiers.id == tiers_id)).scalar_one_or_none()
    if not t:
        raise HTTPException(status_code=404, detail="Tiers non trouvé")
    return t

@router.get("/articles/all")
def list_articles(db: Session = Depends(get_db)):
    return db.execute(select(Article)).scalars().all()

@router.get("/declarations/all")
def list_declarations(db: Session = Depends(get_db)):
    return db.execute(select(Declaration)).scalars().all()

@router.get("/missions/all")
def list_missions(db: Session = Depends(get_db)):
    return db.execute(select(Mission)).scalars().all()
