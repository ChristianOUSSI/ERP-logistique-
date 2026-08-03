# app/schemas/port_operations.py - Pydantic Schemas for Port Handling & Vessel Unloading
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

# --- Vessel Call & Hold Schemas ---
class VesselHoldBase(BaseModel):
    hold_number: int
    hold_name: Optional[str] = None
    capacity_tonnes: float
    stowed_tonnage: float
    remaining_tonnage: float
    cargo_type: Optional[str] = "BULK RICE"

class VesselHoldCreate(VesselHoldBase):
    pass

class VesselHoldResponse(VesselHoldBase):
    id: int
    vessel_call_id: int
    cycles_completed: int = 0
    average_cycle_time: Optional[float] = None
    is_active: bool = True
    completion_percentage: float = 0.0

    class Config:
        from_attributes = True

class VesselCallCreate(BaseModel):
    imo_number: str = Field(..., example="IMO9876543")
    vessel_name: str = Field(..., example="M/V PACIFIC RICE")
    call_sign: Optional[str] = "C5AB8"
    flag_state: Optional[str] = "Panama"
    voyage_number: Optional[str] = "VY-2026-088"
    shipping_agent: Optional[str] = "Consignataire SMAP"
    port_of_call: str = "Douala (PAD)"
    berth_assigned: Optional[str] = "QUAI-15"
    eta: Optional[datetime] = None
    etd: Optional[datetime] = None
    cargo_description: Optional[str] = "Bulk White Rice 5% Broken"
    cargo_type: str = "BULK"
    total_tonnage: float = Field(..., example=25000.0)
    stowage_plan: Optional[Any] = None

class VesselCallResponse(BaseModel):
    id: int
    organization_id: int
    imo_number: str
    vessel_name: str
    call_sign: Optional[str]
    flag_state: Optional[str]
    voyage_number: Optional[str]
    shipping_agent: Optional[str]
    port_of_call: str
    berth_assigned: Optional[str]
    eta: Optional[datetime]
    ata: Optional[datetime]
    etb: Optional[datetime]
    atb: Optional[datetime]
    etd: Optional[datetime]
    atd: Optional[datetime]
    cargo_description: Optional[str]
    cargo_type: Optional[str]
    status: str
    total_tonnage: float
    handled_tonnage: float
    completion_percentage: float = 0.0
    vessel_holds: List[VesselHoldResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# --- DPWS Weighbridge Capture Schemas ---
class WeighbridgeCaptureRequest(BaseModel):
    vessel_call_id: int
    ticket_number: str = Field(..., example="DPWS-2026-88901")
    vehicle_plate: str = Field(..., example="LT-8490-AB")
    driver_name: Optional[str] = "Kamga Jean"
    gross_weight: float = Field(..., example=45000.0)  # Gross (kg)
    tare_weight: float = Field(..., example=15000.0)   # Tare (kg)
    manifested_weight: Optional[float] = Field(None, example=30000.0) # Manifested net weight (kg)
    weighbridge_id: str = "DPWS-SCALE-02"
    weighmaster_name: Optional[str] = "Agent DPWS Douala"
    weighing_location: Optional[str] = "Gate 3 Scale"
    bill_of_lading: Optional[str] = "BL-SMAP-9901"
    container_number: Optional[str] = None
    cargo_description: Optional[str] = "RICE BULK IN TRUCK"

class WeighbridgeTicketResponse(BaseModel):
    id: int
    vessel_call_id: int
    ticket_number: str
    vehicle_plate: str
    gross_weight: float
    tare_weight: float
    net_weight: float
    expected_weight: Optional[float]
    weight_variance: float
    variance_percentage: float
    is_disputed: bool
    dispute_reason: Optional[str]
    weighing_date_time: datetime
    status: str

    class Config:
        from_attributes = True

# --- Stevedoring & Gang Schemas ---
class StevedoringGangCreate(BaseModel):
    gang_number: str = Field(..., example="GANG-UEMC-01")
    gang_name: str = Field(..., example="Equipe Hold 1 - Shift Jour")
    gang_size: int = Field(12, example=12)
    gang_leader: str = Field("Tchagang Pierre", example="Tchagang Pierre")
    shift_type: str = Field("DAY", example="DAY")
    ppe_verified: bool = True
    hourly_labor_rate: float = Field(15000.0, example=15000.0) # XAF / hour

class StevedoringGangResponse(BaseModel):
    id: int
    gang_number: str
    gang_name: Optional[str]
    gang_size: int
    gang_leader: Optional[str]
    is_available: bool
    current_assignment: Optional[str]
    total_hours_worked: float
    productivity_rate: Optional[float]

    class Config:
        from_attributes = True

class EquipmentAllocationCreate(BaseModel):
    vessel_call_id: int
    vessel_hold_id: Optional[int] = None
    equipment_id: str = Field(..., example="HOPPER-PAD-03")
    equipment_type: str = Field(..., example="HOPPER")  # HOPPER, CRANE, FORKLIFT, WEIGHBRIDGE
    equipment_name: str = Field(..., example="Trémie Hydraulique 50T")
    location: str = Field("QUAI-15", example="QUAI-15")
    status: str = Field("IN_USE", example="IN_USE")

class EquipmentAllocationResponse(BaseModel):
    id: int
    equipment_id: str
    equipment_type: str
    equipment_name: Optional[str]
    status: str
    location: Optional[str]
    fuel_level: Optional[int]
    hours_in_service: float

    class Config:
        from_attributes = True

# --- Tally Log Schema ---
class QuayTallyLogCreate(BaseModel):
    vessel_call_id: int
    vessel_hold_id: int
    tallier_name: str = Field(..., example="Pointur Mvogo")
    vehicle_plate: str = Field(..., example="LT-9921-BA")
    driver_name: Optional[str] = "Chauffeur Njoya"
    cargo_type: str = "RICE BULK"
    estimated_bags_or_mt: float = Field(..., example=30.0) # Tonnes or Bags
    packaging_type: str = "BULK"
    hopper_id: Optional[str] = "TRÉMIE-01"
    crane_id: Optional[str] = "GRUE-MOBILES-02"

class QuayTallyLogResponse(BaseModel):
    id: int
    tally_sheet_number: str
    vessel_call_id: int
    vessel_hold_id: Optional[int]
    tallier_name: str
    vehicle_plate: str
    estimated_bags_or_mt: float
    status: str
    loading_start: datetime

    class Config:
        from_attributes = True

# --- Drayage Rotation & Fleet Queue Schemas ---
class DrayageRotationCreate(BaseModel):
    vessel_call_id: int
    vehicle_plate: str = Field(..., example="LT-7712-CC")
    driver_name: str = Field(..., example="Paul Mbida")
    driver_id: Optional[str] = "DRV-PAD-042"
    origin_location: str = Field("QUAI-15 Hopper #2", example="QUAI-15 Hopper #2")
    destination_location: str = Field("Entrepôt SAKAP-MAG3", example="Entrepôt SAKAP-MAG3")
    cargo_quantity: float = Field(32.5, example=32.5)

class DrayageRotationResponse(BaseModel):
    id: int
    operation_number: str
    vessel_call_id: int
    vehicle_plate: str
    driver_name: Optional[str]
    gate_in_time: Optional[datetime]
    loading_start_time: Optional[datetime]
    loading_complete_time: Optional[datetime]
    gate_out_time: Optional[datetime]
    total_transit_time: Optional[int] # Minutes
    status: str

    class Config:
        from_attributes = True

# --- Port Incident Schemas ---
class PortIncidentCreate(BaseModel):
    vessel_call_id: int
    vessel_hold_id: Optional[int] = None
    incident_type: str = Field(..., example="CARGO_DAMAGE") # CARGO_DAMAGE, SHORTAGE, EQUIPMENT_FAILURE, WEATHER_DELAY
    incident_category: Optional[str] = "CARGO"
    incident_description: str = Field(..., example="Sacs de riz humides détectés au fond de la cale #2 suite à l'ouverture du capot de cale.")
    location: str = Field("QUAI-15 / Cale 2", example="QUAI-15 / Cale 2")
    cargo_affected_quantity: Optional[float] = 4.5 # MT
    cargo_affected_unit: Optional[str] = "MT"
    estimated_loss_value: Optional[float] = 1350000.0 # XAF
    severity_level: int = Field(2, example=2) # 1-4
    photos: Optional[List[str]] = []
    reported_by: str = Field("Inspecteur Tally SMAP", example="Inspecteur Tally SMAP")

class PortIncidentResponse(BaseModel):
    id: int
    incident_number: str
    vessel_call_id: int
    incident_type: str
    incident_description: str
    location: Optional[str]
    severity_level: int
    resolved: bool
    reported_by: Optional[str]
    incident_date_time: datetime
    photos: Optional[Any] = []

    class Config:
        from_attributes = True

# --- Statement of Facts (SOF) Schemas ---
class StatementOfFactsResponse(BaseModel):
    vessel_call_id: int
    vessel_name: str
    imo_number: str
    sof_reference: str
    master_name: Optional[str]
    stevedore_supervisor: Optional[str]
    shipping_agent: Optional[str]
    berth_assigned: Optional[str]
    nor_tendered: Optional[datetime]
    nor_accepted: Optional[datetime]
    laytime_commenced: Optional[datetime]
    laytime_completed: Optional[datetime]
    total_tonnage: float
    handled_tonnage: float
    discharge_rate_mt_hr: float
    total_downtime_minutes: int
    timeline_events: List[Any] = []
    status: str
    generated_at: datetime

# --- Analytics Response ---
class PortAnalyticsResponse(BaseModel):
    vessel_id: int
    vessel_name: str
    total_manifested_tonnage: float
    total_scale_net_tonnage: float
    handled_tonnage: float
    completion_percentage: float
    discharge_rate_mt_hr: float
    target_discharge_rate_mt_hr: float
    active_holds_count: int
    active_gangs_count: int
    total_downtime_hours: float
    weight_variance_tonnes: float
    shrinkage_percentage: float
    discrepancy_alert_triggered: bool
    average_truck_tat_minutes: float
    total_trucks_processed: int
    active_incidents_count: int
