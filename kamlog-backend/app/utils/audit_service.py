from pydantic import BaseModel, ConfigDict
from typing import Optional, Any, Dict
from datetime import datetime

class AuditLogBase(BaseModel):
    request_method: str
    request_path: str
    request_query_params: Optional[Dict[str, Any]] = None
    request_body_summary: Optional[str] = None
    response_status_code: int
    duration_ms: int
    ip_address: Optional[str] = None
    tcode: Optional[str] = None
    module: Optional[str] = None
    user_id: Optional[str] = None
    agency_id: Optional[int] = None

class AuditLogCreate(AuditLogBase):
    model_config = ConfigDict(from_attributes=True)

class AuditLogResponse(AuditLogBase):
    id: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)
