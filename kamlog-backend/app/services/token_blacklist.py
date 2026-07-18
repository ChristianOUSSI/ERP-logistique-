import json
from typing import Optional
from app.config import settings

# Attempt to use Redis for token blacklisting, fallback to in-memory set
try:
    import redis
    # Use sync redis since we are in sync routes mostly
    redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()
    USE_REDIS = True
except Exception:
    USE_REDIS = False
    _memory_blacklist = set()

def blacklist_token(token: str, expires_in: int = 3600):
    if USE_REDIS:
        try:
            redis_client.setex(f"bl_{token}", expires_in, "revoked")
        except:
            pass
    else:
        _memory_blacklist.add(token)

def is_token_blacklisted(token: str) -> bool:
    if USE_REDIS:
        try:
            return redis_client.exists(f"bl_{token}") > 0
        except:
            return False
    return token in _memory_blacklist
