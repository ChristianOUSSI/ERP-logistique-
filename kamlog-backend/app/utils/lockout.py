import redis
from datetime import timedelta
from app.config import settings

# Initialize Redis client for lockout
try:
    lockout_redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
except Exception:
    lockout_redis = None

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION = timedelta(minutes=15)

def check_account_lockout(username: str) -> bool:
    """Returns True if the account is currently locked."""
    if not lockout_redis:
        return False
    key = f"lockout:{username}"
    attempts = lockout_redis.get(key)
    if attempts and int(attempts) >= MAX_FAILED_ATTEMPTS:
        return True
    return False

def record_failed_attempt(username: str):
    """Records a failed attempt and increments the counter."""
    if not lockout_redis:
        return
    key = f"lockout:{username}"
    attempts = lockout_redis.get(key)
    if attempts is None:
        lockout_redis.setex(key, LOCKOUT_DURATION, 1)
    else:
        lockout_redis.incr(key)

def clear_failed_attempts(username: str):
    """Clears failed attempts upon successful login."""
    if not lockout_redis:
        return
    key = f"lockout:{username}"
    lockout_redis.delete(key)
