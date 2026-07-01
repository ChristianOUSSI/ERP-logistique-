# app/utils/cache.py - Utilitaires de cache Redis
import json
from typing import Optional, Any, Callable
from functools import wraps
import redis
from app.config import settings

class CacheService:
    """Service pour la gestion du cache Redis (sync) avec fallback local."""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self._local_cache = {}
        self._redis_tested = False
    
    def get_client(self) -> Optional[redis.Redis]:
        if not self._redis_tested:
            self._redis_tested = True
            try:
                client = redis.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True,
                    socket_connect_timeout=1
                )
                client.ping()
                self.redis_client = client
            except Exception:
                self.redis_client = None
        return self.redis_client
    
    def get(self, key: str) -> Optional[Any]:
        client = self.get_client()
        if client is None:
            val = self._local_cache.get(key)
            if val and isinstance(val, str):
                try:
                    return json.loads(val)
                except json.JSONDecodeError:
                    return val
            return val
            
        try:
            value = client.get(key)
            if value:
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
        except Exception:
            pass
        return None
    
    def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        client = self.get_client()
        if client is None:
            self._local_cache[key] = value
            return True
            
        try:
            from fastapi.encoders import jsonable_encoder
            if isinstance(value, (dict, list)):
                value_to_store = json.dumps(jsonable_encoder(value))
            else:
                value_to_store = value
            client.set(key, value_to_store, ex=expire)
        except Exception:
            pass
        return True
    
    def delete(self, key: str) -> bool:
        client = self.get_client()
        if client is None:
            self._local_cache.pop(key, None)
            return True
            
        try:
            client.delete(key)
        except Exception:
            pass
        return True
    
    def delete_pattern(self, pattern: str) -> int:
        client = self.get_client()
        if client is None:
            import re
            regex = re.compile(pattern.replace('*', '.*'))
            keys_to_delete = [k for k in self._local_cache.keys() if regex.match(k)]
            for k in keys_to_delete:
                del self._local_cache[k]
            return len(keys_to_delete)
            
        try:
            keys = client.keys(pattern)
            if keys:
                client.delete(*keys)
            return len(keys)
        except Exception:
            return 0
    
    def exists(self, key: str) -> bool:
        client = self.get_client()
        if client is None:
            return key in self._local_cache
            
        try:
            return client.exists(key) > 0
        except Exception:
            return False

cache_service = CacheService()


def cache_result(key_prefix: str, expire: int = 3600):
    """
    Décorateur pour mettre en cache les résultats de fonction (async).
    
    Args:
        key_prefix: Préfixe pour la clé de cache
        expire: Temps d'expiration en secondes
        
    Example:
        @cache_result("article", expire=1800)
        async def get_article(article_id: int):
            # ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Générer la clé de cache
            cache_key = f"{key_prefix}:{str(args)}:{str(kwargs)}"
            
            # Essayer de récupérer du cache
            cached = await cache_service.get(cache_key)
            if cached is not None:
                return cached
            
            # Exécuter la fonction
            result = await func(*args, **kwargs)
            
            # Mettre en cache le résultat
            await cache_service.set(cache_key, result, expire)
            
            return result
        return wrapper
    return decorator


def invalidate_cache_pattern(pattern: str) -> int:
    """
    Invalide toutes les clés correspondant au pattern.
    
    Args:
        pattern: Pattern de clés (ex: "article:*")
    Returns:
        Nombre de clés supprimées
    """
    return cache_service.delete_pattern(pattern)
