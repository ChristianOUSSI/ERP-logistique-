from pydantic import BaseModel
from typing import Optional, Any, Dict

class AuditLogCreate(BaseModel):
    user_id: Optional[str] = None
    agency_id: Optional[int] = None
    request_method: str
    request_path: str
    request_query_params: Optional[Dict[str, Any]] = None
    request_body_summary: Optional[str] = None
    response_status_code: int
    duration_ms: int
    ip_address: Optional[str] = None
    tcode: Optional[str] = None
    module: Optional[str] = None
