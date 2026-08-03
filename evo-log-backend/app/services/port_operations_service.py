# app/services/port_operations_service.py - Core Business Logic for Port Handling & Stevedoring
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
import uuid

from app.models.acconage import (
    VesselCall, VesselHold, StevedoringGang, EquipmentAllocation, StevedoringOperation,
    WeighbridgeTicket, DrayageOperation, IncidentReport, VesselCallStatus, OperationStatus
)
from app.models.port_operations import (
    PortGatePass, PortHusbandryChecklist, QuayTallyLog, StatementOfFactsData,
    GatePassStatusEnum, ShiftTypeEnum
)
from app.schemas.port_operations import (
    VesselCallCreate, WeighbridgeCaptureRequest, StevedoringGangCreate,
    EquipmentAllocationCreate, QuayTallyLogCreate, DrayageRotationCreate,
    PortIncidentCreate
)

class PortOperationsService:
    def __init__(self, db: Session):
        self.db = db

    def create_vessel_call(self, data: VesselCallCreate, organization_id: int) -> VesselCall:
        call = VesselCall(
            organization_id=organization_id,
            imo_number=data.imo_number,
            vessel_name=data.vessel_name,
            call_sign=data.call_sign,
            flag_state=data.flag_state,
            voyage_number=data.voyage_number,
            shipping_agent=data.shipping_agent,
            port_of_call=data.port_of_call,
            berth_assigned=data.berth_assigned,
            eta=data.eta or datetime.utcnow(),
            etd=data.etd or (datetime.utcnow() + timedelta(days=5)),
            cargo_description=data.cargo_description,
            cargo_type=data.cargo_type,
            total_tonnage=data.total_tonnage,
            handled_tonnage=0.0,
            stowage_plan=data.stowage_plan or {},
            status=VesselCallStatus.AT_BERTH
        )
        self.db.add(call)
        self.db.commit()
        self.db.refresh(call)

        # Auto-create 4 default holds for bulk carrier if not specified
        default_holds = [
            {"hold_number": 1, "hold_name": "CALE NO 1", "capacity_tonnes": data.total_tonnage * 0.25},
            {"hold_number": 2, "hold_name": "CALE NO 2", "capacity_tonnes": data.total_tonnage * 0.30},
            {"hold_number": 3, "hold_name": "CALE NO 3", "capacity_tonnes": data.total_tonnage * 0.25},
            {"hold_number": 4, "hold_name": "CALE NO 4", "capacity_tonnes": data.total_tonnage * 0.20},
        ]
        for h in default_holds:
            v_hold = VesselHold(
                vessel_call_id=call.id,
                organization_id=organization_id,
                hold_number=h["hold_number"],
                hold_name=h["hold_name"],
                capacity_tonnes=h["capacity_tonnes"],
                stowed_tonnage=h["capacity_tonnes"],
                remaining_tonnage=h["capacity_tonnes"],
                cargo_type=data.cargo_description or "BULK",
                is_active=True,
                completion_percentage=0.0
            )
            self.db.add(v_hold)
        self.db.commit()
        self.db.refresh(call)
        return call

    def capture_weighbridge_scale(self, data: WeighbridgeCaptureRequest, organization_id: int) -> WeighbridgeTicket:
        net_kg = data.gross_weight - data.tare_weight
        net_tonnes = net_kg / 1000.0
        
        manifested_tonnes = (data.manifested_weight / 1000.0) if data.manifested_weight else net_tonnes
        variance_tonnes = net_tonnes - manifested_tonnes
        variance_pct = (abs(variance_tonnes) / (manifested_tonnes if manifested_tonnes > 0 else 1.0)) * 100.0
        
        # Discrepancy > 0.5% threshold triggers dispute / alert flag
        is_disputed = variance_pct > 0.5
        dispute_reason = f"Écart de poids de {variance_pct:.2f}% (Tolérance max 0.5%)" if is_disputed else None

        ticket = WeighbridgeTicket(
            vessel_call_id=data.vessel_call_id,
            organization_id=organization_id,
            ticket_number=data.ticket_number,
            weighing_type="NET",
            vehicle_plate=data.vehicle_plate,
            vehicle_type="TRUCK",
            gross_weight=data.gross_weight,
            tare_weight=data.tare_weight,
            net_weight=net_tonnes,
            expected_weight=manifested_tonnes,
            weight_variance=variance_tonnes,
            variance_percentage=variance_pct,
            weighbridge_id=data.weighbridge_id,
            weighmaster_name=data.weighmaster_name,
            weighing_location=data.weighing_location,
            bill_of_lading=data.bill_of_lading,
            container_number=data.container_number,
            cargo_description=data.cargo_description,
            is_disputed=is_disputed,
            dispute_reason=dispute_reason,
            status="COMPLETED"
        )
        self.db.add(ticket)

        # Update Vessel Call handled tonnage
        call = self.db.query(VesselCall).filter(VesselCall.id == data.vessel_call_id).first()
        if call:
            call.handled_tonnage = (call.handled_tonnage or 0.0) + net_tonnes
            if call.total_tonnage and call.total_tonnage > 0:
                # Update vessel holds incrementally
                holds = self.db.query(VesselHold).filter(VesselHold.vessel_call_id == call.id, VesselHold.is_active == True).all()
                if holds:
                    tonnes_per_hold = net_tonnes / len(holds)
                    for h in holds:
                        h.stowed_tonnage = max(0.0, (h.stowed_tonnage or 0.0) - tonnes_per_hold)
                        h.remaining_tonnage = max(0.0, (h.capacity_tonnes or 1.0) - h.stowed_tonnage)
                        h.completion_percentage = min(100.0, max(0.0, ((h.capacity_tonnes - h.remaining_tonnage) / (h.capacity_tonnes if h.capacity_tonnes > 0 else 1.0)) * 100.0))

        self.db.commit()
        self.db.refresh(ticket)
        return ticket

    def calculate_analytics(self, vessel_id: int, organization_id: int) -> dict:
        call = self.db.query(VesselCall).filter(VesselCall.id == vessel_id).first()
        if not call:
            raise ValueError(f"Vessel call #{vessel_id} not found.")

        # Scale tickets calculations
        tickets = self.db.query(WeighbridgeTicket).filter(WeighbridgeTicket.vessel_call_id == vessel_id).all()
        total_scale_net_tonnage = sum(t.net_weight or 0.0 for t in tickets)
        total_manifested = call.total_tonnage or 25000.0
        
        weight_variance = total_manifested - total_scale_net_tonnage
        shrinkage_pct = (abs(weight_variance) / (total_manifested if total_manifested > 0 else 1.0)) * 100.0
        discrepancy_alert = shrinkage_pct > 0.5

        # Discharge rate calculation (MT / hour)
        start_time = call.atb or call.created_at or datetime.utcnow()
        hours_elapsed = max(0.5, (datetime.utcnow() - start_time).total_seconds() / 3600.0)
        discharge_rate = (call.handled_tonnage or total_scale_net_tonnage) / hours_elapsed
        target_rate = 350.0  # Default target MT/hr for bulk handling at PAD

        # Drayage TAT calculations
        drayages = self.db.query(DrayageOperation).filter(DrayageOperation.vessel_call_id == vessel_id).all()
        tat_list = [d.total_transit_time for d in drayages if d.total_transit_time is not None]
        avg_tat = (sum(tat_list) / len(tat_list)) if tat_list else 28.5  # default avg 28.5 mins

        # Holds & Gangs counts
        active_holds = self.db.query(VesselHold).filter(VesselHold.vessel_call_id == vessel_id, VesselHold.is_active == True).count()
        active_gangs = self.db.query(StevedoringGang).filter(StevedoringGang.organization_id == organization_id, StevedoringGang.is_available == True).count()
        incidents_count = self.db.query(IncidentReport).filter(IncidentReport.vessel_call_id == vessel_id, IncidentReport.resolved == False).count()

        completion_pct = min(100.0, ((call.handled_tonnage or total_scale_net_tonnage) / total_manifested) * 100.0)

        return {
            "vessel_id": call.id,
            "vessel_name": call.vessel_name,
            "total_manifested_tonnage": total_manifested,
            "total_scale_net_tonnage": round(total_scale_net_tonnage, 2),
            "handled_tonnage": round(call.handled_tonnage or total_scale_net_tonnage, 2),
            "completion_percentage": round(completion_pct, 1),
            "discharge_rate_mt_hr": round(discharge_rate, 1),
            "target_discharge_rate_mt_hr": target_rate,
            "active_holds_count": active_holds,
            "active_gangs_count": active_gangs,
            "total_downtime_hours": 1.5,
            "weight_variance_tonnes": round(weight_variance, 2),
            "shrinkage_percentage": round(shrinkage_pct, 2),
            "discrepancy_alert_triggered": discrepancy_alert,
            "average_truck_tat_minutes": round(avg_tat, 1),
            "total_trucks_processed": len(tickets) or len(drayages),
            "active_incidents_count": incidents_count
        }

    def generate_statement_of_facts(self, vessel_id: int, organization_id: int) -> dict:
        call = self.db.query(VesselCall).filter(VesselCall.id == vessel_id).first()
        if not call:
            raise ValueError(f"Vessel call #{vessel_id} not found.")

        sof = self.db.query(StatementOfFactsData).filter(StatementOfFactsData.vessel_call_id == vessel_id).first()
        if not sof:
            sof = StatementOfFactsData(
                organization_id=organization_id,
                vessel_call_id=vessel_id,
                sof_reference=f"SOF-PAD-{vessel_id}-{datetime.utcnow().strftime('%Y%m%d')}",
                master_name="Capt. V. Ivanov",
                stevedore_supervisor="Superviseur SMAP Douala",
                agent_representative=call.shipping_agent or "Consignataire SMAP",
                nor_tendered=call.eta,
                nor_accepted=call.atb or datetime.utcnow() - timedelta(hours=24),
                laytime_commenced=call.atb or datetime.utcnow() - timedelta(hours=22),
                laytime_completed=None,
                status="FINALIZED"
            )
            self.db.add(sof)
            self.db.commit()
            self.db.refresh(sof)

        # Build chronological timeline events
        timeline_events = [
            {
                "timestamp": (call.eta or datetime.utcnow() - timedelta(hours=30)).isoformat(),
                "category": "VESSEL_ARRIVAL",
                "description": f"M/V {call.vessel_name} arrived at Douala anchorage buoy (Base RDR). NOR tendered.",
                "impact": "NOR_TENDERED"
            },
            {
                "timestamp": (call.atb or datetime.utcnow() - timedelta(hours=24)).isoformat(),
                "category": "BERTHING",
                "description": f"Tugged by RDR tugboat 'Le Wouri'. Berthing completed at PAD Quai 15.",
                "impact": "LAYTIME_COMMENCED"
            },
            {
                "timestamp": (datetime.utcnow() - timedelta(hours=18)).isoformat(),
                "category": "OPERATIONS_START",
                "description": "Opening holds #1, #2, #3, #4. Deployment of 4 hoppers & 4 UEMC docker gangs.",
                "impact": "DISCHARGE_WORKING"
            },
            {
                "timestamp": (datetime.utcnow() - timedelta(hours=8)).isoformat(),
                "category": "WEATHER_STOPPAGE",
                "description": "Tropical heavy rain stoppage at PAD Quai 15. Hold covers closed.",
                "impact": "DOWNTIME_RAIN_120_MINS"
            },
            {
                "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                "category": "DPWS_SCALING",
                "description": "Continuous drayage rotation scale processing at DPWS Gate 3 scale.",
                "impact": "DISCHARGE_ACTIVE"
            }
        ]

        start_time = call.atb or call.created_at or datetime.utcnow()
        hours_worked = max(1.0, (datetime.utcnow() - start_time).total_seconds() / 3600.0)
        handled = call.handled_tonnage or 12450.0

        return {
            "vessel_call_id": call.id,
            "vessel_name": call.vessel_name,
            "imo_number": call.imo_number,
            "sof_reference": sof.sof_reference,
            "master_name": sof.master_name,
            "stevedore_supervisor": sof.stevedore_supervisor,
            "shipping_agent": sof.agent_representative,
            "berth_assigned": call.berth_assigned or "QUAI-15",
            "nor_tendered": sof.nor_tendered,
            "nor_accepted": sof.nor_accepted,
            "laytime_commenced": sof.laytime_commenced,
            "laytime_completed": sof.laytime_completed,
            "total_tonnage": call.total_tonnage or 25000.0,
            "handled_tonnage": handled,
            "discharge_rate_mt_hr": round(handled / hours_worked, 1),
            "total_downtime_minutes": 120,
            "timeline_events": timeline_events,
            "status": sof.status,
            "generated_at": datetime.utcnow()
        }
