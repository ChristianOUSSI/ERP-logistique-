# app/utils/rate_limiting.py - Rate limiting utilities
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.config import settings

# Create limiter instance
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000/hour"] if not settings.TESTING else [],
    enabled=not settings.TESTING
)

# Rate limit presets for different endpoint types
RATE_LIMITS = {
    "auth": "5/minute",           # Strict for authentication endpoints
    "login": "3/minute",
    "anonymous": "100/hour",      # For public endpoints
    "user": "1000/hour",          # Regular authenticated users
    "admin": "2000/hour",         # Admin/users with higher privileges
    "bulk": "10/hour",            # Bulk operations (more restrictive)
    "websocket": "5000/hour",     # WebSocket connections
}