"""
Acconage router - manages port operations and stevedoring
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.schemas.acconage import NavireCreate, NavireResponse, EscaleCreate, EscaleUpdate, EscaleResponse, OperationAcconageCreate, OperationAcconageResponse
from app.models.acconage import Navire, Escale, OperationAcconage

router = APIRouter()


@router.get("/navires", response_model=List[NavireResponse])
async def get_all_navires(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all ships"""
    navires = db.query(Navire).offset(skip).limit(limit).all()
    return navires


@router.post("/navires", response_model=NavireResponse, status_code=status.HTTP_201_CREATED)
async def create_navire(navire_data: NavireCreate, db: Session = Depends(get_db)):
    """Create a new ship"""
    db_navire = Navire(**navire_data.model_dump())
    db.add(db_navire)
    db.commit()
    db.refresh(db_navire)
    return db_navire


@router.get("/escales", response_model=List[EscaleResponse])
async def get_all_escales(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all port calls"""
    escales = db.query(Escale).offset(skip).limit(limit).all()
    return escales


@router.post("/escales", response_model=EscaleResponse, status_code=status.HTTP_201_CREATED)
async def create_escale(escale_data: EscaleCreate, db: Session = Depends(get_db)):
    """Create a new port call"""
    import random
    import string
    
    numero_escale = f"ESC-{datetime.now().strftime('%Y%m%d')}-{''.join(random.choices(string.ascii_uppercase + string.digits, k=6))}"
    
    db_escale = Escale(numero_escale=numero_escale, **escale_data.model_dump())
    db.add(db_escale)
    db.commit()
    db.refresh(db_escale)
    return db_escale


@router.post("/operations", response_model=OperationAcconageResponse, status_code=status.HTTP_201_CREATED)
async def create_operation_acconage(operation_data: OperationAcconageCreate, db: Session = Depends(get_db)):
    """Create a new stevedoring operation"""
    import random
    import string
    
    reference = f"OPA-{datetime.now().strftime('%Y%m%d')}-{''.join(random.choices(string.ascii_uppercase + string.digits, k=6))}"
    
    db_operation = OperationAcconage(reference=reference, **operation_data.model_dump())
    db.add(db_operation)
    db.commit()
    db.refresh(db_operation)
    return db_operation