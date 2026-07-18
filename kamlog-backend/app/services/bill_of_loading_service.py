from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from datetime import datetime

from app.models.bill_of_loading import BillOfLoading, ContainerDetail, GoodsDetail
from app.schemas.bill_of_loading import BillOfLoadingCreate, BillOfLoadingUpdate


def create_bol(db: Session, bol_in: BillOfLoadingCreate) -> BillOfLoading:
    db_bol = BillOfLoading(**bol_in.dict())
    db.add(db_bol)
    db.flush()
    db.refresh(db_bol)
    return db_bol


def get_bol(db: Session, bol_id: int) -> Optional[BillOfLoading]:
    return db.query(BillOfLoading).options(
        selectinload(BillOfLoading.container_details),
        selectinload(BillOfLoading.goods_details)
    ).filter(BillOfLoading.id == bol_id).first()


def get_bol_by_number(db: Session, bol_number: str) -> Optional[BillOfLoading]:
    return db.query(BillOfLoading).options(
        selectinload(BillOfLoading.container_details),
        selectinload(BillOfLoading.goods_details)
    ).filter(BillOfLoading.bol_number == bol_number).first()


def list_bols(db: Session, skip: int = 0, limit: int = 100) -> List[BillOfLoading]:
    return db.query(BillOfLoading).options(
        selectinload(BillOfLoading.container_details),
        selectinload(BillOfLoading.goods_details)
    ).offset(skip).limit(limit).all()


def update_bol(db: Session, bol_id: int, bol_in: BillOfLoadingUpdate) -> Optional[BillOfLoading]:
    db_bol = get_bol(db, bol_id)
    if not db_bol:
        return None
    for field, value in bol_in.dict(exclude_unset=True).items():
        setattr(db_bol, field, value)
    db.add(db_bol)
    db.flush()
    db.refresh(db_bol)
    return db_bol


def delete_bol(db: Session, bol_id: int) -> bool:
    db_bol = get_bol(db, bol_id)
    if not db_bol:
        return False
    db.delete(db_bol)
    db.flush()
    return True


def add_container(
    db: Session,
    bol_id: int,
    container_number: str,
    seal_number: Optional[str] = None,
    size_type: Optional[str] = None,
    weight_kg: Optional[float] = None,
    volume_m3: Optional[float] = None,
) -> ContainerDetail:
    container = ContainerDetail(
        bol_id=bol_id,
        container_number=container_number,
        seal_number=seal_number,
        size_type=size_type,
        weight_kg=weight_kg,
        volume_m3=volume_m3,
    )
    db.add(container)
    db.flush()
    db.refresh(container)
    return container


def add_goods(
    db: Session,
    bol_id: int,
    product_name: str,
    total_quantity: float,
    unit: str,
    item_code: Optional[str] = None,
    weight_kg: Optional[float] = None,
    production_date: Optional[datetime] = None,
    expiration_date: Optional[datetime] = None,
    lot_number: Optional[str] = None,
) -> GoodsDetail:
    goods = GoodsDetail(
        bol_id=bol_id,
        product_name=product_name,
        total_quantity=total_quantity,
        unit=unit,
        item_code=item_code,
        weight_kg=weight_kg,
        production_date=production_date,
        expiration_date=expiration_date,
        lot_number=lot_number,
    )
    db.add(goods)
    db.flush()
    db.refresh(goods)
    return goods
