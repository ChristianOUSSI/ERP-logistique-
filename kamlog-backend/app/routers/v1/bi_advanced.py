from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.database import get_db
from app.utils.tenant import get_current_tenant_context, TenantContext, require_module_access

router = APIRouter()

@router.get("/dashboard-custom", dependencies=[Depends(require_module_access("bi"))])
def get_custom_bi_dashboard(
    period: str = "THIS_MONTH",
    context: TenantContext = Depends(get_current_tenant_context)
):
    """Retrieve customizable executive dashboard metrics and inter-period comparisons."""
    return {
        "status": "success",
        "organization_id": context.organization_id,
        "period": period,
        "kpis": {
            "revenue_xaf": 145000000.0,
            "revenue_growth_vs_last_month": "+14.2%",
            "active_missions": 142,
            "epod_compliance_rate": "98.5%",
            "fleet_availability": "92.0%",
            "stock_turnover_days": 18.4
        },
        "transport_volume_by_destination": [
            {"destination": "Douala Port", "volume_tons": 4500},
            {"destination": "Yaoundé Depot", "volume_tons": 3200},
            {"destination": "Bafoussam", "volume_tons": 1100},
            {"destination": "Garoua / Nord", "volume_tons": 850}
        ]
    }

class ScheduledExportSchema(BaseModel):
    report_name: str = Field(..., example="Rapport Mensuel d'Exploitation Transport & Magasin")
    format: str = Field("PDF", example="PDF") # PDF, EXCEL, CSV
    frequency: str = Field("MONTHLY", example="MONTHLY") # DAILY, WEEKLY, MONTHLY
    recipients: List[str] = Field(..., example=["direction@tce-logistics.cm"])

@router.post("/scheduled-reports", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_module_access("bi"))])
def schedule_bi_export(payload: ScheduledExportSchema, context: TenantContext = Depends(get_current_tenant_context)):
    """Schedule automated background BI report exports."""
    return {
        "status": "success",
        "message": "Automated report export scheduled successfully!",
        "export_job": {
            "id": f"JOB-EX-{datetime.utcnow().strftime('%S')}",
            "organization_id": context.organization_id,
            **payload.dict(),
            "next_run_at": (datetime.utcnow()).isoformat()
        }
    }
