# app/routers/transactions.py - Router pour les transactions et opérations
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.magasin import Transaction, OperationTrace, Incoterm, TypeConteneur
from app.schemas.magasin import (
    TransactionCreate, TransactionUpdate, Transaction as TransactionSchema,
    OperationTraceCreate, OperationTrace as OperationTraceSchema,
    OperationCancelRequest,
    IncotermCreate, IncotermUpdate, Incoterm as IncotermSchema,
    TypeConteneurCreate, TypeConteneurUpdate, TypeConteneur as TypeConteneurSchema
)
from app.utils.code_generator import cancel_operation_by_ot
from app.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


# ============ TRANSACTIONS ============

@router.get("/transactions", response_model=List[TransactionSchema])
def get_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère toutes les transactions"""
    transactions = db.query(Transaction).offset(skip).limit(limit).all()
    return transactions


@router.get("/transactions/{code_transaction}", response_model=TransactionSchema)
def get_transaction(code_transaction: str, db: Session = Depends(get_db)):
    """Récupère une transaction par son code"""
    transaction = db.query(Transaction).filter(Transaction.code_transaction == code_transaction).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    return transaction


@router.post("/transactions", response_model=TransactionSchema, status_code=status.HTTP_201_CREATED)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    """Crée une nouvelle transaction"""
    existing = db.query(Transaction).filter(Transaction.code_transaction == transaction.code_transaction).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ce code de transaction existe déjà")
    
    db_transaction = Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    logger.info(f"Transaction {transaction.code_transaction} créée")
    return db_transaction


@router.put("/transactions/{code_transaction}", response_model=TransactionSchema)
def update_transaction(
    code_transaction: str,
    transaction: TransactionUpdate,
    db: Session = Depends(get_db)
):
    """Met à jour une transaction"""
    db_transaction = db.query(Transaction).filter(Transaction.code_transaction == code_transaction).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    
    update_data = transaction.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_transaction, key, value)
    
    db.commit()
    db.refresh(db_transaction)
    
    logger.info(f"Transaction {code_transaction} mise à jour")
    return db_transaction


@router.delete("/transactions/{code_transaction}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(code_transaction: str, db: Session = Depends(get_db)):
    """Supprime une transaction"""
    db_transaction = db.query(Transaction).filter(Transaction.code_transaction == code_transaction).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    
    db.delete(db_transaction)
    db.commit()
    
    logger.info(f"Transaction {code_transaction} supprimée")


# ============ OPERATIONS TRACE ============

@router.get("/operations", response_model=List[OperationTraceSchema])
def get_operations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère toutes les opérations"""
    operations = db.query(OperationTrace).offset(skip).limit(limit).all()
    return operations


@router.get("/operations/{numero_ot}", response_model=OperationTraceSchema)
def get_operation(numero_ot: str, db: Session = Depends(get_db)):
    """Récupère une opération par son numéro d'OT"""
    operation = db.query(OperationTrace).filter(OperationTrace.numero_ot == numero_ot).first()
    if not operation:
        raise HTTPException(status_code=404, detail="Opération non trouvée")
    return operation


@router.post("/operations", response_model=OperationTraceSchema, status_code=status.HTTP_201_CREATED)
def create_operation(operation: OperationTraceCreate, db: Session = Depends(get_db)):
    """Crée une nouvelle opération trace"""
    existing = db.query(OperationTrace).filter(OperationTrace.numero_ot == operation.numero_ot).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ce numéro d'OT existe déjà")
    
    db_operation = OperationTrace(**operation.dict())
    db.add(db_operation)
    db.commit()
    db.refresh(db_operation)
    
    logger.info(f"Opération {operation.numero_ot} créée")
    return db_operation


@router.post("/operations/cancel", status_code=status.HTTP_200_OK)
def cancel_operation(request: OperationCancelRequest, db: Session = Depends(get_db)):
    """Annule une opération par son numéro d'OT"""
    success = cancel_operation_by_ot(db, request.numero_ot, request.annule_par)
    
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Opération non trouvée ou déjà annulée"
        )
    
    logger.info(f"Opération {request.numero_ot} annulée par {request.annule_par}")
    return {"message": "Opération annulée avec succès", "numero_ot": request.numero_ot}


# ============ INCOTERMS ============

@router.get("/incoterms", response_model=List[IncotermSchema])
def get_incoterms(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère tous les incoterms"""
    incoterms = db.query(Incoterm).filter(Incoterm.est_actif == True).offset(skip).limit(limit).all()
    return incoterms


@router.get("/incoterms/{code}", response_model=IncotermSchema)
def get_incoterm(code: str, db: Session = Depends(get_db)):
    """Récupère un incoterm par son code"""
    incoterm = db.query(Incoterm).filter(Incoterm.code == code).first()
    if not incoterm:
        raise HTTPException(status_code=404, detail="Incoterm non trouvé")
    return incoterm


@router.post("/incoterms", response_model=IncotermSchema, status_code=status.HTTP_201_CREATED)
def create_incoterm(incoterm: IncotermCreate, db: Session = Depends(get_db)):
    """Crée un nouvel incoterm"""
    existing = db.query(Incoterm).filter(Incoterm.code == incoterm.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ce code d'incoterm existe déjà")
    
    db_incoterm = Incoterm(**incoterm.dict())
    db.add(db_incoterm)
    db.commit()
    db.refresh(db_incoterm)
    
    logger.info(f"Incoterm {incoterm.code} créé")
    return db_incoterm


@router.put("/incoterms/{code}", response_model=IncotermSchema)
def update_incoterm(
    code: str,
    incoterm: IncotermUpdate,
    db: Session = Depends(get_db)
):
    """Met à jour un incoterm"""
    db_incoterm = db.query(Incoterm).filter(Incoterm.code == code).first()
    if not db_incoterm:
        raise HTTPException(status_code=404, detail="Incoterm non trouvé")
    
    update_data = incoterm.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_incoterm, key, value)
    
    db.commit()
    db.refresh(db_incoterm)
    
    logger.info(f"Incoterm {code} mis à jour")
    return db_incoterm


@router.delete("/incoterms/{code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_incoterm(code: str, db: Session = Depends(get_db)):
    """Supprime un incoterm"""
    db_incoterm = db.query(Incoterm).filter(Incoterm.code == code).first()
    if not db_incoterm:
        raise HTTPException(status_code=404, detail="Incoterm non trouvé")
    
    db.delete(db_incoterm)
    db.commit()
    
    logger.info(f"Incoterm {code} supprimé")


# ============ TYPES CONTENEUR ============

@router.get("/types-conteneur", response_model=List[TypeConteneurSchema])
def get_types_conteneur(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère tous les types de conteneur"""
    types = db.query(TypeConteneur).filter(TypeConteneur.est_actif == True).offset(skip).limit(limit).all()
    return types


@router.get("/types-conteneur/{code}", response_model=TypeConteneurSchema)
def get_type_conteneur(code: str, db: Session = Depends(get_db)):
    """Récupère un type de conteneur par son code"""
    type_conteneur = db.query(TypeConteneur).filter(TypeConteneur.code == code).first()
    if not type_conteneur:
        raise HTTPException(status_code=404, detail="Type de conteneur non trouvé")
    return type_conteneur


@router.post("/types-conteneur", response_model=TypeConteneurSchema, status_code=status.HTTP_201_CREATED)
def create_type_conteneur(type_conteneur: TypeConteneurCreate, db: Session = Depends(get_db)):
    """Crée un nouveau type de conteneur"""
    existing = db.query(TypeConteneur).filter(TypeConteneur.code == type_conteneur.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ce code de type de conteneur existe déjà")
    
    db_type = TypeConteneur(**type_conteneur.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    
    logger.info(f"Type conteneur {type_conteneur.code} créé")
    return db_type


@router.put("/types-conteneur/{code}", response_model=TypeConteneurSchema)
def update_type_conteneur(
    code: str,
    type_conteneur: TypeConteneurUpdate,
    db: Session = Depends(get_db)
):
    """Met à jour un type de conteneur"""
    db_type = db.query(TypeConteneur).filter(TypeConteneur.code == code).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Type de conteneur non trouvé")
    
    update_data = type_conteneur.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_type, key, value)
    
    db.commit()
    db.refresh(db_type)
    
    logger.info(f"Type conteneur {code} mis à jour")
    return db_type


@router.delete("/types-conteneur/{code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_type_conteneur(code: str, db: Session = Depends(get_db)):
    """Supprime un type de conteneur"""
    db_type = db.query(TypeConteneur).filter(TypeConteneur.code == code).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Type de conteneur non trouvé")
    
    db.delete(db_type)
    db.commit()
    
    logger.info(f"Type conteneur {code} supprimé")
