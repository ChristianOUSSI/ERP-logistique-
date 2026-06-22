import json
import hashlib
from datetime import datetime, timedelta
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import redis.asyncio as redis
from sqlalchemy.orm import Session
from app.config import settings
from app.database import SessionLocal
from app.models.idempotency import IdempotencyKey
from app.utils.logger import get_logger

logger = get_logger(__name__)

class IdempotencyMiddleware(BaseHTTPMiddleware):
    """
    Middleware d'idempotence avec persistance DB + Redis (WORLD-PRO).
    Assure que les requêtes de modification avec un header X-Idempotency-Key
    ne sont traitées qu'une seule fois.
    """
    def __init__(self, app, redis_url: str):
        super().__init__(app)
        self.redis_url = redis_url
        self.redis_client = None
        self.ttl = 86400  # 24 heures de validité

    async def get_redis_client(self):
        """Récupère ou initialise le client Redis."""
        if self.redis_client is None:
            self.redis_client = await redis.from_url(self.redis_url)
        return self.redis_client

    async def dispatch(self, request: Request, call_next):
        if request.method not in ["POST", "PUT", "PATCH"]:
            return await call_next(request)

        idempotency_key = request.headers.get("X-Idempotency-Key")
        if not idempotency_key:
            return await call_next(request)

        # Créer une clé unique basée sur l'utilisateur et la clé fournie
        user = getattr(request.state, "user", None)
        user_id = str(user.id) if user else "anonymous"
        redis_key = f"idempotency:{user_id}:{idempotency_key}"

        # Vérifier si la clé existe déjà
        cached_response = await self.redis.get(redis_key)
        if cached_response:
            data = json.loads(cached_response)
            return Response(
                content=data["body"],
                status_code=data["status_code"],
                media_type="application/json",
                headers={"X-Cache-Hit": "Idempotency"}
            )

        # Verrouillage temporaire pour éviter les conditions de course (Race Condition)
        lock = await self.redis.setnx(f"lock:{redis_key}", "1")
        if not lock:
            return Response(content='{"detail": "Processing in progress"}', status_code=409)
        
        await self.redis.expire(f"lock:{redis_key}", 10) # Lock de 10s max

        response = await call_next(request)

        # On ne cache que les succès (2xx)
        if 200 <= response.status_code < 300:
            response_body = b""
            async for chunk in response.body_iterator:
                response_body += chunk
            
            payload = json.dumps({"body": response_body.decode(), "status_code": response.status_code})
            await self.redis.setex(redis_key, self.ttl, payload)
            await self.redis.delete(f"lock:{redis_key}")
            return Response(content=response_body, status_code=response.status_code, media_type="application/json")

        await self.redis.delete(f"lock:{redis_key}")
        return response