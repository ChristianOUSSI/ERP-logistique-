"""
Magasin router - manages warehouse and inventory
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.schemas.magasin import StockCreate, StockUpdate, StockResponse, MouvementStockCreate, MouvementStockResponse, EntrepotCreate, EntrepotResponse
from app.models.magasin import Stock, MouvementStock, Entrepot

router = APIRouter()


@router.get("/stocks", response_model=List[StockResponse])
async def get_all_stocks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all stock items"""
    stocks = db.query(Stock).offset(skip).limit(limit).all()
    return stocks


@router.post("/stocks", response_model=StockResponse, status_code=status.HTTP_201_CREATED)
async def create_stock(stock_data: StockCreate, db: Session = Depends(get_db)):
    """Create a new stock item"""
    if db.query(Stock).filter(Stock.code_article == stock_data.code_article).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Article code already exists")
    
    db_stock = Stock(**stock_data.model_dump())
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock


@router.post("/mouvements", response_model=MouvementStockResponse, status_code=status.HTTP_201_CREATED)
async def create_mouvement_stock(mouvement_data: MouvementStockCreate, db: Session = Depends(get_db)):
    """Create a stock movement"""
    import random
    import string
    
    reference = f"MOV-{datetime.now().strftime('%Y%m%d')}-{''.join(random.choices(string.ascii_uppercase + string.digits, k=6))}"
    
    db_mouvement = MouvementStock(reference=reference, **mouvement_data.model_dump())
    db.add(db_mouvement)
    db.commit()
    db.refresh(db_mouvement)
    return db_mouvement


@router.get("/entrepots", response_model=List[EntrepotResponse])
async def get_all_entrepots(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all warehouses"""
    entrepots = db.query(Entrepot).offset(skip).limit(limit).all()
    return entrepots


@router.post("/entrepots", response_model=EntrepotResponse, status_code=status.HTTP_201_CREATED)
async def create_entrepot(entrepot_data: EntrepotCreate, db: Session = Depends(get_db)):
    """Create a new warehouse"""
    if db.query(Entrepot).filter(Entrepot.code == entrepot_data.code).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Warehouse code already exists")
    
    db_entrepot = Entrepot(**entrepot_data.model_dump())
    db.add(db_entrepot)
    db.commit()
    db.refresh(db_entrepot)
    return db_entrepot