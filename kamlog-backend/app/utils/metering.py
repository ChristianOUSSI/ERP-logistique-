import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from app.utils.logger import get_logger
from app.config import settings

logger = get_logger(__name__)

class MeteringMiddleware(BaseHTTPMiddleware):
    """
    Middleware pour la facturation à l'usage et les SLA.
    Enregistre le nombre de requêtes et la bande passante utilisée par client/tenant.
    """
    def __init__(self, app):
        super().__init__(app)
        try:
            import redis
            self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        except Exception as e:
            logger.warning(f"MeteringMiddleware: Impossible de se connecter à Redis: {e}")
            self.redis_client = None

    async def dispatch(self, request: Request, call_next):
        # 1. Avant la requête
        start_time = time.time()
        
        # Trouver l'identité du client (ex: via une API Key ou un header Tenant-ID)
        # Pour le MVP, on utilise l'IP ou un header X-Tenant-ID
        tenant_id = request.headers.get("X-Tenant-ID", "default")
        
        # 2. Exécuter la requête
        response = await call_next(request)
        
        # 3. Après la requête
        process_time = time.time() - start_time
        
        # Calcul approximatif de la bande passante (bytes sortants)
        # Content-Length n'est pas toujours présent, on utilise une valeur par défaut
        content_length = response.headers.get("Content-Length", 0)
        
        if self.redis_client:
            try:
                # Clé journalière pour le metering
                date_str = time.strftime("%Y-%m-%d")
                
                # Incrémenter le nombre de requêtes
                req_key = f"metering:req:{tenant_id}:{date_str}"
                self.redis_client.incr(req_key)
                self.redis_client.expire(req_key, 30 * 86400) # Garder 30 jours
                
                # Incrémenter la bande passante
                bw_key = f"metering:bw:{tenant_id}:{date_str}"
                self.redis_client.incrby(bw_key, int(content_length))
                self.redis_client.expire(bw_key, 30 * 86400)
                
            except Exception as e:
                logger.error(f"MeteringMiddleware erreur Redis: {e}")
                
        return response
