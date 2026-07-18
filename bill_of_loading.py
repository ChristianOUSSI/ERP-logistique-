from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class BillOfLoading(Base):
    __tablename__ = "bill_of_loading"

    id = Column(Integer, primary_key=True, index=True)
    bol_number = Column(String(50), unique=True, index=True, nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    vessel_name = Column(String(100), nullable=True)
    voyage_number = Column(String(50), nullable=True)
    port_of_loading = Column(String(100), nullable=True)
    port_of_discharge = Column(String(100), nullable=True)
    # status: draft, posted, cancelled
    status = Column(String(20), default="draft")
    total_quantity = Column(Numeric(15, 3), default=0)
    notes = Column(Text, nullable=True)

    # Relationships
    container_details = relationship("ContainerDetail", back_populates="bol", cascade="all, delete-orphan")
    goods_details = relationship("GoodsDetail", back_populates="bol", cascade="all, delete-orphan")
    receptions = relationship("Reception", back_populates="bol", cascade="all, delete-orphan")


class ContainerDetail(Base):
    __tablename__ = "container_detail"

    id = Column(Integer, primary_key=True, index=True)
    bol_id = Column(Integer, ForeignKey("bill_of_loading.id"), nullable=False)
    container_number = Column(String(50), nullable=False)
    seal_number = Column(String(50), nullable=True)
    size_type = String(20)  # e.g., 20FT, 40FT, 40HC
    weight_kg = Numeric(12, 3)
    volume_m3 = Numeric(12, 3)

    bol = relationship("BillOfLoading", back_populates="container_details")


class GoodsDetail(Base):
    __tablename__ = "goods_detail"

    id = Column(Integer, primary_key=True, index=True)
    bol_id = Column(Integer, ForeignKey("bill_of_loading.id"), nullable=False)
    # For bulk, sacks, liquids, etc.
    item_code = Column(String(50), nullable=True)  # reference to master data article
    product_name = String(200)
    total_quantity = Column(Numeric(15, 3))
    unit = String(20)  # kg, tonnes, liters, pieces, etc.
    weight_kg = Column(Numeric(12, 3))
    production_date = Column(DateTime(timezone=True), nullable=True)
    expiration_date = Column(DateTime(timezone=True), nullable=True)
    lot_number = Column(String(50), nullable=True)

    bol = relationship("BillOfLoading", back_populates="goods_details")
