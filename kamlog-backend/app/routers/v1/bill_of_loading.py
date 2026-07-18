from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.services.bill_of_loading_service import (
    create_bol,
    get_bol,
    get_bol_by_number,
    list_bols,
    update_bol,
    delete_bol,
    add_container,
    add_goods,
)
from app.schemas.bill_of_loading import (
    BillOfLoadingCreate,
    BillOfLoadingUpdate,
    BillOfLoading as BillOfLoadingSchema,
)
from app.models.bill_of_loading import BillOfLoading as BillOfLoadingModel

router = APIRouter()


@router.post("/", response_model=BillOfLoadingSchema, status_code=status.HTTP_201_CREATED)
def create_bol_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    bol_in: BillOfLoadingCreate,
):
    """Create a new Bill of Loading."""
    bol = create_bol(db=db, bol_in=bol_in)
    return bol


@router.get("/{bol_id}", response_model=BillOfLoadingSchema)
def read_bol(
    *,
    db: Session = Depends(deps.get_db),
    bol_id: int,
):
    """Get a BOL by its internal ID."""
    bol = get_bol(db=db, bol_id=bol_id)
    if not bol:
        raise HTTPException(status_code=404, detail="Bill of Loading not found")
    return bol


@router.get("/", response_model=List[BillOfLoadingSchema])
def read_bols(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """List BOLs with pagination."""
    return list_bols(db=db, skip=skip, limit=limit)


@router.put("/{bol_id}", response_model=BillOfLoadingSchema)
def update_bol_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    bol_id: int,
    bol_in: BillOfLoadingUpdate,
):
    """Update an existing BOL."""
    bol = update_bol(db=db, bol_id=bol_id, bol_in=bol_in)
    if not bol:
        raise HTTPException(status_code=404, detail="Bill of Loading not found")
    return bol


@router.delete("/{bol_id}", response_model=bool)
def delete_bol_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    bol_id: int,
):
    """Delete a BOL."""
    success = delete_bol(db=db, bol_id=bol_id)
    if not success:
        raise HTTPException(status_code=404, detail="Bill of Loading not found")
    return success


@router.post("/{bol_id}/container", response_model=dict)
def add_container_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    bol_id: int,
    container_number: str,
    seal_number: str = None,
    size_type: str = None,
    weight_kg: float = None,
    volume_m3: float = None,
):
    """Attach a container detail to a BOL."""
    container = add_container(
        db=db,
        bol_id=bol_id,
        container_number=container_number,
        seal_number=seal_number,
        size_type=size_type,
        weight_kg=weight_kg,
        volume_m3=volume_m3,
    )
    return {"id": container.id, "message": "Container added"}


@router.post("/{bol_id}/goods", response_model=dict)
def add_goods_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    bol_id: int,
    product_name: str,
    total_quantity: float,
    unit: str,
    item_code: str = None,
    weight_kg: float = None,
    production_date: str = None,
    expiration_date: str = None,
    lot_number: str = None,
):
    """Attach goods detail to a BOL."""
    from datetime import datetime

    prod_date = (
        datetime.fromisoformat(production_date) if production_date else None
    )
    exp_date = (
        datetime.fromisoformat(expiration_date) if expiration_date else None
    )
    goods = add_goods(
        db=db,
        bol_id=bol_id,
        product_name=product_name,
        total_quantity=total_quantity,
        unit=unit,
        item_code=item_code,
        weight_kg=weight_kg,
        production_date=prod_date,
        expiration_date=exp_date,
        lot_number=lot_number,
    )
    return {"id": goods.id, "message": "Goods added"}
