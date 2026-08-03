# app/models/port_operations.py - Sub-Modules Port Operations & Stevedoring (PAD Context)
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.models.base import Base

class ShiftTypeEnum(str, enum.Enum):
    DAY = "DAY"
    NIGHT = "NIGHT"
    OVERTIME = "OVERTIME"

class GatePassStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"

class DrayageStatusEnum(str, enum.Enum):
    QUEUED = "QUEUED"
    LOADING = "LOADING"
    EN_ROUTE = "EN_ROUTE"
    SCALED = "SCALED"
    DELIVERED = "DELIVERED"
    DELAYED = "DELAYED"

class PortGatePass(Base):
    __tablename__ = "port_gate_passes"

    id = Column(Integer, primary_primary=False, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False, index=True)
    pass_number = Column(String(50), nullable=False, unique=True, index=True)
    vessel_call_id = Column(Integer, ForeignKey("vessel_calls.id"), nullable=True)
    
    applicant_name = Column(String(100), nullable=False)
    entity_name = Column(String(100), nullable=False)  # e.g., SMAP, Transporter, Agent
    purpose = Column(String(200), nullable=False)
    
    vehicle_plate = Column(String(30), nullable=True)
    driver_name = Column(String(100), nullable=True)
    driver_id_number = Column(String(50), nullable=True)
    
    dps_authorization_ref = Column(String(100), nullable=True)
    status = Column(SQLEnum(GatePassStatusEnum), default=GatePassStatusEnum.PENDING)
    
    valid_from = Column(DateTime, default=datetime.utcnow)
    valid_until = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization")
    vessel_call = relationship("VesselCall")

class PortHusbandryChecklist(Base):
    __tablename__ = "port_husbandry_checklists"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False, index=True)
    vessel_call_id = Column(Integer, ForeignKey("vessel_calls.id"), nullable=False, index=True)
    
    checklist_ref = Column(String(50), nullable=False, unique=True)
    shipping_agent_name = Column(String(100), nullable=False)
    
    # RDR Tugging & Piloting Status
    rdr_tugging_requested = Column(Boolean, default=False)
    rdr_tugging_approved = Column(Boolean, default=False)
    rdr_tugboat_assigned = Column(String(100), nullable=True)
    piloting_board_time = Column(DateTime, nullable=True)
    
    # PAD Berth Application
    pad_berth_applied = Column(Boolean, default=False)
    pad_berth_assigned = Column(String(50), nullable=True)
    berth_approval_ref = Column(String(100), nullable=True)
    
    # Cargo & Provisioning Checklist
    cargo_release_note_issued = Column(Boolean, default=False)
    bunkering_requested = Column(Boolean, default=False)
    fresh_water_tons = Column(Float, default=0.0)
    garbage_disposal_approved = Column(Boolean, default=False)
    
    remarks = Column(Text, nullable=True)
    status = Column(String(30), default="IN_PROGRESS")  # IN_PROGRESS, COMPLETED, APPROVED
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization")
    vessel_call = relationship("VesselCall")

class QuayTallyLog(Base):
    __tablename__ = "quay_tally_logs"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False, index=True)
    vessel_call_id = Column(Integer, ForeignKey("vessel_calls.id"), nullable=False, index=True)
    vessel_hold_id = Column(Integer, ForeignKey("vessel_holds.id"), nullable=True)
    
    tally_sheet_number = Column(String(50), nullable=False, unique=True, index=True)
    tallier_name = Column(String(100), nullable=False)
    shift_type = Column(SQLEnum(ShiftTypeEnum), default=ShiftTypeEnum.DAY)
    
    vehicle_plate = Column(String(30), nullable=False)
    driver_name = Column(String(100), nullable=True)
    
    cargo_type = Column(String(50), nullable=False)  # Rice, Wheat, Cement, etc.
    estimated_bags_or_mt = Column(Float, nullable=False)
    packaging_type = Column(String(50), default="BULK")  # BULK, SACKS_50KG, BIG_BAGS
    
    hopper_id = Column(String(50), nullable=True)
    crane_id = Column(String(50), nullable=True)
    
    loading_start = Column(DateTime, default=datetime.utcnow)
    loading_complete = Column(DateTime, nullable=True)
    
    status = Column(String(30), default="DISPATCHED_TO_SCALE")  # DRAFT, DISPATCHED_TO_SCALE, SCALED, CONFIRMED
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization")
    vessel_call = relationship("VesselCall")
    vessel_hold = relationship("VesselHold")

class StatementOfFactsData(Base):
    __tablename__ = "statement_of_facts_data"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False, index=True)
    vessel_call_id = Column(Integer, ForeignKey("vessel_calls.id"), nullable=False, unique=True, index=True)
    
    sof_reference = Column(String(50), nullable=False, unique=True)
    master_name = Column(String(100), nullable=True)
    stevedore_supervisor = Column(String(100), nullable=True)
    agent_representative = Column(String(100), nullable=True)
    
    nor_tendered = Column(DateTime, nullable=True)  # Notice of Readiness Tendered
    nor_accepted = Column(DateTime, nullable=True)  # Notice of Readiness Accepted
    laytime_commenced = Column(DateTime, nullable=True)
    laytime_completed = Column(DateTime, nullable=True)
    
    timeline_events = Column(JSON, nullable=True)  # List of chronological events: [{time, hold, description, weather}]
    total_demurrage_hours = Column(Float, default=0.0)
    total_despatch_hours = Column(Float, default=0.0)
    laytime_allowed_hours = Column(Float, default=0.0)
    laytime_used_hours = Column(Float, default=0.0)
    
    generated_pdf_url = Column(String(255), nullable=True)
    status = Column(String(30), default="DRAFT")  # DRAFT, FINALIZED, SIGNED
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization")
    vessel_call = relationship("VesselCall")
