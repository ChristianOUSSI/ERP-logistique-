from fastapi import APIRouter, status
from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger("admin_audit")

class AuditTraceCreate(BaseModel):
    user_id: Optional[str] = None
    action: str
    metadata: Dict[str, Any]
    timestamp: datetime

@router.post("/audit/operation-trace", status_code=status.HTTP_201_CREATED)
async def create_operation_trace(trace: AuditTraceCreate):
    """
    Captures T-Code executions and sensitive system actions for compliance.
    In production, this should integrate with a dedicated audit service and DB table.
    """
    # For now, we log the trace and return success to unblock the frontend
    logger.info(f"[AUDIT] User: {trace.user_id} | Action: {trace.action} | T-Code: {trace.metadata.get('tcode')}")
    return {"status": "success", "detail": "Operation trace logged"}