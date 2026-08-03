# scripts/seed_port_operations.py - Seeder for Port Handling & Vessel Unloading (PAD Context)
import os
import sys
from datetime import datetime, timedelta

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import SessionLocal, engine, Base
from app.models.organization import Organization
from app.models.acconage import (
    VesselCall, VesselHold, StevedoringGang, EquipmentAllocation, StevedoringOperation,
    WeighbridgeTicket, DrayageOperation, IncidentReport, VesselCallStatus, EquipmentType
)
from app.models.port_operations import (
    PortGatePass, PortHusbandryChecklist, QuayTallyLog, StatementOfFactsData,
    ShiftTypeEnum, GatePassStatusEnum
)

def seed_port_operations():
    db = SessionLocal()
    try:
        # Create default Organization if not exists
        org = db.query(Organization).first()
        if not org:
            org = Organization(name="SMAP S.A Port Operations", code="SMAP-PAD")
            db.add(org)
            db.commit()
            db.refresh(org)

        # 1. Seed Vessel Calls
        vessel1 = db.query(VesselCall).filter(VesselCall.imo_number == "IMO9876543").first()
        if not vessel1:
            vessel1 = VesselCall(
                organization_id=org.id,
                imo_number="IMO9876543",
                vessel_name="M/V PACIFIC RICE",
                call_sign="C5AB8",
                flag_state="Panama",
                voyage_number="VY-2026-088",
                shipping_agent="Consignataire SMAP Douala",
                port_of_call="Douala (PAD)",
                berth_assigned="QUAI-15",
                eta=datetime.utcnow() - timedelta(days=2),
                ata=datetime.utcnow() - timedelta(days=2, hours=4),
                atb=datetime.utcnow() - timedelta(days=1, hours=18),
                etd=datetime.utcnow() + timedelta(days=3),
                cargo_description="Sacs de Riz Blanc 5% Brisures - Importateur ETG / MID GULF",
                cargo_type="BULK RICE",
                total_tonnage=25000.0,
                handled_tonnage=12850.0,
                status=VesselCallStatus.WORKING
            )
            db.add(vessel1)
            db.commit()
            db.refresh(vessel1)

            # Seed 4 Holds for Vessel 1
            holds_data = [
                ("CALE NO 1", 6250.0, 3100.0, 3150.0),
                ("CALE NO 2", 7500.0, 4200.0, 3300.0),
                ("CALE NO 3", 6250.0, 3150.0, 3100.0),
                ("CALE NO 4", 5000.0, 2400.0, 2600.0),
            ]
            for idx, (hname, cap, stowed, rem) in enumerate(holds_data, 1):
                vh = VesselHold(
                    vessel_call_id=vessel1.id,
                    organization_id=org.id,
                    hold_number=idx,
                    hold_name=hname,
                    capacity_tonnes=cap,
                    stowed_tonnage=stowed,
                    remaining_tonnage=rem,
                    cargo_type="RICE BULK",
                    is_active=True,
                    completion_percentage=((cap - rem) / cap) * 100.0
                )
                db.add(vh)

        # 2. Seed UEMC Docker Gangs
        gang1 = db.query(StevedoringGang).filter(StevedoringGang.gang_number == "GANG-UEMC-01").first()
        if not gang1:
            gangs = [
                ("GANG-UEMC-01", "Équipe UEMC Hold 1 - Shift Jour", 14, "Tchagang Pierre", True, 28.5),
                ("GANG-UEMC-02", "Équipe UEMC Hold 2 - Shift Jour", 12, "Eboa Samuel", True, 32.0),
                ("GANG-UEMC-03", "Équipe UEMC Hold 3 - Shift Nuit", 14, "Nguema Jean-Paul", True, 26.0),
                ("GANG-UEMC-04", "Équipe UEMC Hold 4 - Shift Nuit", 12, "Abessolo Marc", True, 29.5),
            ]
            for gnum, gname, gsize, glead, avail, prod in gangs:
                stg = StevedoringGang(
                    organization_id=org.id,
                    gang_number=gnum,
                    gang_name=gname,
                    gang_size=gsize,
                    gang_leader=glead,
                    is_available=avail,
                    current_assignment=f"M/V PACIFIC RICE - Quai 15",
                    total_hours_worked=48.0,
                    productivity_rate=prod
                )
                db.add(stg)

        # 3. Seed Equipment Allocations (Hoppers, Cranes, Forklifts)
        eq1 = db.query(EquipmentAllocation).filter(EquipmentAllocation.equipment_id == "HOPPER-PAD-01").first()
        if not eq1:
            equipment_items = [
                ("HOPPER-PAD-01", EquipmentType.HOPPER, "Trémie Hydraulique Quai 15-A", "IN_USE", "QUAI-15"),
                ("HOPPER-PAD-02", EquipmentType.HOPPER, "Trémie Hydraulique Quai 15-B", "IN_USE", "QUAI-15"),
                ("CRANE-MOB-01", EquipmentType.MOBILE_CRANE, "Grue Mobile Gottwald 100T", "IN_USE", "QUAI-15"),
                ("FORKLIFT-5T-01", EquipmentType.FORKLIFT, "Chariot Élévateur Caterpillar 5T", "AVAILABLE", "YARD-A"),
            ]
            for eq_id, eq_type, eq_name, status, loc in equipment_items:
                eq = EquipmentAllocation(
                    organization_id=org.id,
                    vessel_call_id=vessel1.id if vessel1 else 1,
                    equipment_id=eq_id,
                    equipment_type=eq_type,
                    equipment_name=eq_name,
                    status=status,
                    location=loc,
                    fuel_level=90,
                    hours_in_service=18.5
                )
                db.add(eq)

        # 4. Seed DPWS Weighbridge Tickets
        t1 = db.query(WeighbridgeTicket).filter(WeighbridgeTicket.ticket_number == "DPWS-2026-8801").first()
        if not t1:
            tickets_data = [
                ("DPWS-2026-8801", "LT-8490-AB", 44800.0, 14800.0, 30000.0, 30000.0, False),
                ("DPWS-2026-8802", "LT-9921-BA", 46200.0, 15100.0, 31100.0, 31000.0, False),
                ("DPWS-2026-8803", "LT-7712-CC", 48500.0, 15000.0, 33500.0, 33000.0, True), # Disputed > 0.5%
            ]
            for tnum, plate, gross, tare, net, exp, disp in tickets_data:
                net_tonnes = net / 1000.0
                exp_tonnes = exp / 1000.0
                var_tonnes = net_tonnes - exp_tonnes
                var_pct = (abs(var_tonnes) / exp_tonnes) * 100.0
                wt = WeighbridgeTicket(
                    vessel_call_id=vessel1.id if vessel1 else 1,
                    organization_id=org.id,
                    ticket_number=tnum,
                    weighing_type="NET",
                    vehicle_plate=plate,
                    vehicle_type="TRUCK",
                    gross_weight=gross,
                    tare_weight=tare,
                    net_weight=net_tonnes,
                    expected_weight=exp_tonnes,
                    weight_variance=var_tonnes,
                    variance_percentage=var_pct,
                    weighbridge_id="DPWS-SCALE-02",
                    weighmaster_name="Inspecteur DPWS Douala",
                    weighing_location="Gate 3 Scale",
                    bill_of_lading="BL-SMAP-9901",
                    cargo_description="RICE BULK IN TRUCK",
                    is_disputed=disp,
                    dispute_reason="Écart de poids > 0.5% tolérance" if disp else None,
                    status="COMPLETED"
                )
                db.add(wt)

        # 5. Seed Drayage Rotations
        d1 = db.query(DrayageOperation).filter(DrayageOperation.operation_number == "ROT-2026-001").first()
        if not d1:
            drayages = [
                ("ROT-2026-001", "LT-8490-AB", "Kamga Jean", "Quai 15 Hopper 1", "Entrepôt SAKAP MAG3", 30.0, 28),
                ("ROT-2026-002", "LT-9921-BA", "Chauffeur Njoya", "Quai 15 Hopper 2", "Usine ETG Bonabéri", 31.1, 35),
            ]
            for opnum, plate, drv, orig, dest, qty, tat in drayages:
                now = datetime.utcnow()
                dray = DrayageOperation(
                    organization_id=org.id,
                    vessel_call_id=vessel1.id if vessel1 else 1,
                    operation_number=opnum,
                    vehicle_plate=plate,
                    driver_name=drv,
                    origin_location=orig,
                    destination_location=dest,
                    cargo_quantity=qty,
                    gate_in_time=now - timedelta(minutes=tat),
                    loading_start_time=now - timedelta(minutes=tat - 5),
                    loading_complete_time=now - timedelta(minutes=10),
                    gate_out_time=now,
                    total_transit_time=tat,
                    status="DELIVERED"
                )
                db.add(dray)

        # 6. Seed Port Incident Logs
        inc1 = db.query(IncidentReport).filter(IncidentReport.incident_number == "INC-PAD-2026-001").first()
        if not inc1:
            inc = IncidentReport(
                organization_id=org.id,
                vessel_call_id=vessel1.id if vessel1 else 1,
                incident_number="INC-PAD-2026-001",
                incident_type="CARGO_DAMAGE",
                incident_category="CARGO",
                incident_description="Sacs de riz mouillés détectés au fond du Hold #2 à cause des fortes pluies tropicales au Quai 15.",
                location="QUAI-15 / Cale 2",
                cargo_affected_quantity=3.5,
                cargo_affected_unit="MT",
                estimated_loss_value=1050000.0,
                severity_level=2,
                photos=["/uploads/incidents/pad_wet_cargo_01.jpg"],
                reported_by="Inspecteur Tally SMAP",
                resolved=False
            )
            db.add(inc)

        db.commit()
        print(" Successfully seeded Port Operations & Stevedoring data for PAD!")
    except Exception as e:
        db.rollback()
        print(f" Error seeding port operations: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_port_operations()
