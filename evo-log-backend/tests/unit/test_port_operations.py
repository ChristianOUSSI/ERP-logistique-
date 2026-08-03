# tests/unit/test_port_operations.py - Unit tests for Port Operations & Stevedoring
import pytest
from unittest.mock import MagicMock
from datetime import datetime

from app.services.port_operations_service import PortOperationsService
from app.schemas.port_operations import VesselCallCreate, WeighbridgeCaptureRequest
from app.models.acconage import VesselCall, WeighbridgeTicket, VesselHold, DrayageOperation

@pytest.fixture
def mock_db():
    return MagicMock()

def test_create_vessel_call(mock_db):
    service = PortOperationsService(mock_db)
    payload = VesselCallCreate(
        imo_number="IMO9991112",
        vessel_name="M/V DOUALA GRAIN",
        cargo_description="Bulk Wheat 25,000 MT",
        cargo_type="BULK",
        total_tonnage=25000.0
    )
    call = service.create_vessel_call(payload, organization_id=1)
    
    assert mock_db.add.called
    assert mock_db.commit.called
    assert call.vessel_name == "M/V DOUALA GRAIN"
    assert call.total_tonnage == 25000.0

def test_weighbridge_discrepancy_alert(mock_db):
    service = PortOperationsService(mock_db)
    
    # Mocking vessel call lookup
    mock_call = VesselCall(id=1, vessel_name="M/V DOUALA GRAIN", total_tonnage=25000.0, handled_tonnage=100.0)
    mock_db.query.return_value.filter.return_value.first.return_value = mock_call
    mock_db.query.return_value.filter.return_value.all.return_value = []
    
    # Case 1: Normal weight (Gross 45000kg, Tare 15000kg = Net 30000kg, Manifested 30000kg -> 0% variance)
    payload_normal = WeighbridgeCaptureRequest(
        vessel_call_id=1,
        ticket_number="DPWS-TEST-01",
        vehicle_plate="LT-100-AB",
        gross_weight=45000.0,
        tare_weight=15000.0,
        manifested_weight=30000.0
    )
    ticket1 = service.capture_weighbridge_scale(payload_normal, organization_id=1)
    assert ticket1.net_weight == 30.0 # Tonnes
    assert ticket1.is_disputed == False
    assert ticket1.variance_percentage == 0.0

    # Case 2: Shrinkage / Discrepancy > 0.5% (Net 30.0T vs Manifested 32.0T -> ~6.25% variance)
    payload_disputed = WeighbridgeCaptureRequest(
        vessel_call_id=1,
        ticket_number="DPWS-TEST-02",
        vehicle_plate="LT-200-BC",
        gross_weight=45000.0,
        tare_weight=15000.0,
        manifested_weight=32000.0
    )
    ticket2 = service.capture_weighbridge_scale(payload_disputed, organization_id=1)
    assert ticket2.net_weight == 30.0
    assert ticket2.is_disputed == True
    assert ticket2.variance_percentage > 0.5

def test_generate_statement_of_facts(mock_db):
    service = PortOperationsService(mock_db)
    mock_call = VesselCall(
        id=1,
        vessel_name="M/V PACIFIC RICE",
        imo_number="IMO9876543",
        shipping_agent="SMAP Agent",
        berth_assigned="QUAI-15",
        total_tonnage=25000.0,
        handled_tonnage=12000.0
    )
    mock_db.query.return_value.filter.return_value.first.return_value = mock_call
    
    sof = service.generate_statement_of_facts(vessel_id=1, organization_id=1)
    assert sof["vessel_name"] == "M/V PACIFIC RICE"
    assert "timeline_events" in sof
    assert len(sof["timeline_events"]) > 0
    assert sof["total_tonnage"] == 25000.0
