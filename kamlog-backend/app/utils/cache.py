# app/utils/cache.py - Utilitaires de cache Redis
import json
from typing import Optional, Any, Callable
from functools import wraps
import redis.asyncio as redis
from app.config import settings


class CacheService:
    """Service pour la gestion du cache Redis (async)."""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
    
    async def get_client(self) -> redis.Redis:
        """Récupère ou initialise le client Redis async."""
        if self.redis_client is None:
            self.redis_client = await redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
        return self.redis_client
    
    async def get(self, key: str) -> Optional[Any]:
        """
        Récupère une valeur du cache.
        
        Args:
            key: Clé du cache
            
        Returns:
            Valeur désérialisée ou None
        """
        client = await self.get_client()
        value = await client.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None
    
    async def set(
        self,
        key: str,
        value: Any,
        expire: int = 3600
    ) -> bool:
        """
        Définit une valeur dans le cache.
        
        Args:
            key: Clé du cache
            value: Valeur à stocker
            expire: Temps d'expiration en secondes (défaut: 1 heure)
            
        Returns:
            True si succès
        """
        client = await self.get_client()
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        await client.set(key, value, ex=expire)
        return True
    
    async def delete(self, key: str) -> bool:
        """
        Supprime une valeur du cache.
        
        Args:
            key: Clé du cache
            
        Returns:
            True si succès
        """
        client = await self.get_client()
        await client.delete(key)
        return True
    
    async def delete_pattern(self, pattern: str) -> int:
        """
        Supprime toutes les clés correspondant au pattern.
        
        Args:
            pattern: Pattern de clés (ex: "article:*")
            
        Returns:
            Nombre de clés supprimées
        """
        client = await self.get_client()
        keys = []
        async for key in client.scan_iter(match=pattern):
            keys.append(key)
        if keys:
            await client.delete(*keys)
        return len(keys)
    
    async def exists(self, key: str) -> bool:
        """
        Vérifie si une clé existe dans le cache.
        
        Args:
            key: Clé du cache
            
        Returns:
            True si la clé existe
        """
        client = await self.get_client()
        return await client.exists(key) > 0


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


async def invalidate_cache_pattern(pattern: str) -> int:
    """
    Invalide toutes les clés correspondant au pattern.
    
    Args:
        pattern: Pattern de clés (ex: "article:*")
        
    Returns:
        Nombre de clés invalidées
    """
    return await cache_service.delete_pattern(pattern)
