"""
Idempotency middleware to prevent duplicate operations
"""
from fastapi import Request, HTTPException, status
import redis
import json
import hashlib
from app.core.config import settings


class IdempotencyMiddleware:
    """Middleware to handle idempotent requests"""
    
    def __init__(self, app, redis_url: str):
        self.app = app
        self.redis_client = redis.from_url(redis_url, decode_responses=True)
    
    async def __call__(self, request: Request, call_next):
        # Only apply to POST, PUT, PATCH requests
        if request.method not in ["POST", "PUT", "PATCH"]:
            return await call_next(request)
        
        # Get idempotency key from header
        idempotency_key = request.headers.get("X-Idempotency-Key")
        if not idempotency_key:
            return await call_next(request)
        
        # Create cache key
        cache_key = f"idempotency:{idempotency_key}:{request.url.path}"
        
        # Check if request already processed
        cached_response = self.redis_client.get(cache_key)
        if cached_response:
            return json.loads(cached_response)
        
        # Process request
        response = await call_next(request)
        
        # Cache response for 1 hour
        if response.status_code < 400:
            response_data = {
                "status_code": response.status_code,
                "body": response.body.decode() if hasattr(response, 'body') else "",
                "headers": dict(response.headers)
            }
            self.redis_client.setex(cache_key, 3600, json.dumps(response_data))
        
        return response