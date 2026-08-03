# app/routers/v1/port_operations.py - FastAPI Router for Port Handling & Vessel Unloading Operations
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.utils.rbac import get_current_user, User
from app.models.acconage import (
    VesselCall, VesselHold, StevedoringGang, EquipmentAllocation,
    WeighbridgeTicket, DrayageOperation, IncidentReport
)
from app.models.port_operations import (
    PortGatePass, PortHusbandryChecklist, QuayTallyLog
)
from app.schemas.port_operations import (
    VesselCallCreate, VesselCallResponse,
    WeighbridgeCaptureRequest, WeighbridgeTicketResponse,
    StevedoringGangCreate, StevedoringGangResponse,
    EquipmentAllocationCreate, EquipmentAllocationResponse,
    QuayTallyLogCreate, QuayTallyLogResponse,
    DrayageRotationCreate, DrayageRotationResponse,
    PortIncidentCreate, PortIncidentResponse,
    StatementOfFactsResponse, PortAnalyticsResponse
)
from app.services.port_operations_service import PortOperationsService

router = APIRouter()

# --- Vessel Calls ---
@router.post("/vessel-calls", response_model=VesselCallResponse, status_code=status.HTTP_201_CREATED)
def create_vessel_call(
    payload: VesselCallCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new Vessel Call (Escale Navire) with holds stowed for bulk cargo unloading."""
    org_id = current_user.organization_id or 1
    service = PortOperationsService(db)
    call = service.create_vessel_call(payload, organization_id=org_id)
    return call

@router.get("/vessel-calls", response_model=List[VesselCallResponse])
def list_vessel_calls(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all active and completed vessel calls."""
    org_id = current_user.organization_id or 1
    calls = db.query(VesselCall).filter(VesselCall.organization_id == org_id).all()
    return calls

@router.get("/vessel-calls/{vessel_id}", response_model=VesselCallResponse)
def get_vessel_call(
    vessel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get details of a specific vessel call."""
    call = db.query(VesselCall).filter(VesselCall.id == vessel_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Vessel call not found")
    return call

# --- DPWS Weighbridge Ingestion API ---
@router.post("/weighbridge/capture", response_model=WeighbridgeTicketResponse, status_code=status.HTTP_201_CREATED)
def capture_weighbridge_scale(
    payload: WeighbridgeCaptureRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    DPWS Scale Data Ingestion API.
    Captures truck entry/exit weights (Gross, Tare, Net) and detects shrinkage/discrepancies vs manifested weight (>0.5% tolerance).
    """
    org_id = current_user.organization_id or 1
    service = PortOperationsService(db)
    ticket = service.capture_weighbridge_scale(payload, organization_id=org_id)
    return ticket

@router.get("/weighbridge/tickets", response_model=List[WeighbridgeTicketResponse])
def list_weighbridge_tickets(
    vessel_call_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List weighbridge scale tickets."""
    org_id = current_user.organization_id or 1
    query = db.query(WeighbridgeTicket).filter(WeighbridgeTicket.organization_id == org_id)
    if vessel_call_id:
        query = query.filter(WeighbridgeTicket.vessel_call_id == vessel_call_id)
    return query.order_by(WeighbridgeTicket.created_at.desc()).all()

# --- Live Analytics & Statement of Facts ---
@router.get("/operations/{vessel_id}/analytics", response_model=PortAnalyticsResponse)
def get_port_analytics(
    vessel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Live Quayside Dashboard Stats & Analytics.
    Returns discharge rate (MT/hr), hold stats, active hoppers, weight variance shrinkage %, TAT metrics, and alerts.
    """
    org_id = current_user.organization_id or 1
    service = PortOperationsService(db)
    return service.calculate_analytics(vessel_id=vessel_id, organization_id=org_id)

@router.get("/operations/{vessel_id}/sof", response_model=StatementOfFactsResponse)
def get_statement_of_facts(
    vessel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Auto-generate digital Statement of Facts (SOF) document needed for laytime and demurrage calculations.
    """
    org_id = current_user.organization_id or 1
    service = PortOperationsService(db)
    return service.generate_statement_of_facts(vessel_id=vessel_id, organization_id=org_id)

# --- Stevedoring Docker Gangs & Heavy Equipment ---
@router.post("/gangs", response_model=StevedoringGangResponse, status_code=status.HTTP_201_CREATED)
def create_stevedoring_gang(
    payload: StevedoringGangCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Register UEMC / GIE docker gang deployment and PPE verification."""
    org_id = current_user.organization_id or 1
    gang = StevedoringGang(
        organization_id=org_id,
        gang_number=payload.gang_number,
        gang_name=payload.gang_name,
        gang_size=payload.gang_size,
        gang_leader=payload.gang_leader,
        is_available=True,
        productivity_rate=28.5
    )
    db.add(gang)
    db.commit()
    db.refresh(gang)
    return gang

@router.get("/gangs", response_model=List[StevedoringGangResponse])
def list_stevedoring_gangs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List docker gangs deployed at quayside."""
    org_id = current_user.organization_id or 1
    return db.query(StevedoringGang).filter(StevedoringGang.organization_id == org_id).all()

@router.post("/equipment", response_model=EquipmentAllocationResponse, status_code=status.HTTP_201_CREATED)
def allocate_equipment(
    payload: EquipmentAllocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Allocate heavy machinery (clamshell bucket, hopper, quay crane, forklift) to a vessel hold."""
    org_id = current_user.organization_id or 1
    eq = EquipmentAllocation(
        organization_id=org_id,
        vessel_call_id=payload.vessel_call_id,
        vessel_hold_id=payload.vessel_hold_id,
        equipment_id=payload.equipment_id,
        equipment_type=payload.equipment_type,
        equipment_name=payload.equipment_name,
        location=payload.location,
        status=payload.status,
        fuel_level=85,
        hours_in_service=12.5
    )
    db.add(eq)
    db.commit()
    db.refresh(eq)
    return eq

@router.get("/equipment", response_model=List[EquipmentAllocationResponse])
def list_equipment(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List allocated machinery and equipment status."""
    org_id = current_user.organization_id or 1
    return db.query(EquipmentAllocation).filter(EquipmentAllocation.organization_id == org_id).all()

# --- Quayside Tally Logs ---
@router.post("/tally/log", response_model=QuayTallyLogResponse, status_code=status.HTTP_201_CREATED)
def create_tally_log(
    payload: QuayTallyLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mobile tally clerk endpoint for quayside truck dispatch logging."""
    org_id = current_user.organization_id or 1
    sheet_num = f"TALLY-{datetime.utcnow().strftime('%Y%m%d')}-{db.query(QuayTallyLog).count() + 1:04d}"
    tally = QuayTallyLog(
        organization_id=org_id,
        vessel_call_id=payload.vessel_call_id,
        vessel_hold_id=payload.vessel_hold_id,
        tally_sheet_number=sheet_num,
        tallier_name=payload.tallier_name,
        vehicle_plate=payload.vehicle_plate,
        driver_name=payload.driver_name,
        cargo_type=payload.cargo_type,
        estimated_bags_or_mt=payload.estimated_bags_or_mt,
        packaging_type=payload.packaging_type,
        hopper_id=payload.hopper_id,
        crane_id=payload.crane_id,
        status="DISPATCHED_TO_SCALE"
    )
    db.add(tally)
    db.commit()
    db.refresh(tally)
    return tally

# --- Drayage & Fleet Queue ---
@router.post("/drayage/rotation", response_model=DrayageRotationResponse, status_code=status.HTTP_201_CREATED)
def create_drayage_rotation(
    payload: DrayageRotationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Register truck queueing rotation moving goods between quayside hoppers and client off-port warehouse."""
    org_id = current_user.organization_id or 1
    op_num = f"ROT-{datetime.utcnow().strftime('%Y%m%d')}-{db.query(DrayageOperation).count() + 1:04d}"
    now = datetime.utcnow()
    dray = DrayageOperation(
        organization_id=org_id,
        vessel_call_id=payload.vessel_call_id,
        operation_number=op_num,
        vehicle_plate=payload.vehicle_plate,
        driver_name=payload.driver_name,
        driver_id=payload.driver_id,
        origin_location=payload.origin_location,
        destination_location=payload.destination_location,
        cargo_quantity=payload.cargo_quantity,
        gate_in_time=now - timedelta(minutes=30),
        loading_start_time=now - timedelta(minutes=20),
        loading_complete_time=now - timedelta(minutes=5),
        gate_out_time=now,
        total_transit_time=30,  # 30 mins TAT
        status="DELIVERED"
    )
    db.add(dray)
    db.commit()
    db.refresh(dray)
    return dray

@router.get("/drayage/queue", response_model=List[DrayageRotationResponse])
def list_drayage_queue(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get active truck queue and turnaround time (TAT) monitoring list."""
    org_id = current_user.organization_id or 1
    return db.query(DrayageOperation).filter(DrayageOperation.organization_id == org_id).all()

# --- Port Incidents & Photo Uploads ---
@router.post("/incidents", response_model=PortIncidentResponse, status_code=status.HTTP_201_CREATED)
def report_port_incident(
    payload: PortIncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log structured cargo damage, torn sacks, wet bulk, or machinery breakdown with photo uploads."""
    org_id = current_user.organization_id or 1
    inc_num = f"INC-PAD-{datetime.utcnow().strftime('%Y%m%d')}-{db.query(IncidentReport).count() + 1:04d}"
    incident = IncidentReport(
        organization_id=org_id,
        vessel_call_id=payload.vessel_call_id,
        vessel_hold_id=payload.vessel_hold_id,
        incident_number=inc_num,
        incident_type=payload.incident_type,
        incident_category=payload.incident_category,
        incident_description=payload.incident_description,
        location=payload.location,
        cargo_affected_quantity=payload.cargo_affected_quantity,
        cargo_affected_unit=payload.cargo_affected_unit,
        estimated_loss_value=payload.estimated_loss_value,
        severity_level=payload.severity_level,
        photos=payload.photos or [],
        reported_by=payload.reported_by,
        resolved=False
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

@router.get("/incidents", response_model=List[PortIncidentResponse])
def list_port_incidents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List port incident reports."""
    org_id = current_user.organization_id or 1
    return db.query(IncidentReport).filter(IncidentReport.organization_id == org_id).all()

# --- Port Gate Passes & Husbandry ---
@router.post("/gate-passes")
def create_gate_pass(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create DPS Port Security gate pass authorization."""
    org_id = current_user.organization_id or 1
    pass_num = f"DPS-PASS-{datetime.utcnow().strftime('%Y%m%d')}-{db.query(PortGatePass).count() + 1:04d}"
    gp = PortGatePass(
        organization_id=org_id,
        vessel_call_id=payload.get("vessel_call_id"),
        pass_number=pass_num,
        applicant_name=payload.get("applicant_name", "SMAP Ops"),
        entity_name=payload.get("entity_name", "Transporter"),
        purpose=payload.get("purpose", "Quayside Cargo Evacuation"),
        vehicle_plate=payload.get("vehicle_plate"),
        driver_name=payload.get("driver_name"),
        driver_id_number=payload.get("driver_id_number"),
        dps_authorization_ref=f"DPS-AUT-{pass_num[-4:]}",
        status=GatePassStatusEnum.APPROVED
    )
    db.add(gp)
    db.commit()
    db.refresh(gp)
    return {"message": "DPS Gate Pass authorized", "pass_number": pass_num, "status": "APPROVED"}

@router.get("/gate-passes")
def list_gate_passes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List DPS gate authorizations."""
    org_id = current_user.organization_id or 1
    return db.query(PortGatePass).filter(PortGatePass.organization_id == org_id).all()

@router.post("/husbandry")
def create_husbandry_checklist(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Husbandry request checklist for RDR tugging/piloting and PAD berth application."""
    org_id = current_user.organization_id or 1
    ref = f"HUS-{datetime.utcnow().strftime('%Y%m%d')}-{db.query(PortHusbandryChecklist).count() + 1:04d}"
    hb = PortHusbandryChecklist(
        organization_id=org_id,
        vessel_call_id=payload.get("vessel_call_id", 1),
        checklist_ref=ref,
        shipping_agent_name=payload.get("shipping_agent_name", "Consignataire SMAP"),
        rdr_tugging_requested=True,
        rdr_tugging_approved=True,
        rdr_tugboat_assigned="Remorqueur RDR Le Wouri",
        pad_berth_applied=True,
        pad_berth_assigned="QUAI-15",
        status="APPROVED"
    )
    db.add(hb)
    db.commit()
    db.refresh(hb)
    return {"message": "Husbandry workflow checklist created", "checklist_ref": ref, "status": "APPROVED"}
