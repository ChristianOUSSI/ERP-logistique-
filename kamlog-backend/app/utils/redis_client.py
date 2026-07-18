import redis
from app.config import settings

try:
    redis_client = redis.Redis.from_url(
        settings.REDIS_URL,
        password=settings.REDIS_PASSWORD or None,
        decode_responses=True
    )
except Exception:
    redis_client = None

def blacklist_token(jti: str, expire_seconds: int):
    """Ajoute un jti à la blacklist dans Redis avec une durée de vie."""
    if redis_client:
        try:
            redis_client.setex(f"blacklist:{jti}", expire_seconds, "true")
        except Exception:
            pass

def is_token_blacklisted(jti: str) -> bool:
    """Vérifie si un token est dans la blacklist."""
    if redis_client:
        try:
            return redis_client.exists(f"blacklist:{jti}") > 0
        except Exception:
            return False
    return False
