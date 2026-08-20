"""
Tracing middleware for request correlation and distributed tracing
"""
from fastapi import Request
import uuid
import logging

logger = logging.getLogger(__name__)


class TracingMiddleware:
    """Middleware to add trace IDs to requests for correlation"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, request: Request, call_next):
        # Generate or extract trace ID
        trace_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        
        # Add trace ID to request state
        request.state.trace_id = trace_id
        
        # Add trace ID to response headers
        response = await call_next(request)
        response.headers["X-Request-ID"] = trace_id
        
        # Log with trace ID
        logger.info(f"Request {request.method} {request.url.path} - Trace ID: {trace_id}")
        
        return response