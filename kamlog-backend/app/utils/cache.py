# app/utils/cache.py - Utilitaires de cache Redis améliorés
import json
import time
from typing import Optional, Any, Callable, Dict, List
from functools import wraps
import redis
from app.config import settings
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)

class CacheService:
    """Service pour la gestion du cache Redis avec support async et fonctionnalités avancées."""

    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self._local_cache = {}
        self._local_cache_expiry = {}  # Track expiry for local cache
        self._redis_tested = False
        self._executor = ThreadPoolExecutor(max_workers=4)
        self._stats = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'deletes': 0,
            'errors': 0
        }

    def _get_client(self) -> Optional[redis.Redis]:
        """Get Redis sync client (internal use)."""
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
                logger.info("Connexion Redis établie")
            except Exception as e:
                logger.warning(f"Impossible de se connecter à Redis: {e}")
                self.redis_client = None
        return self.redis_client

    async def get_client(self) -> Optional[redis.Redis]:
        """Get Redis client (async compatible)."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self._executor, self._get_client)

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache (sync version)."""
        # Check local cache first with expiry
        if key in self._local_cache:
            if key in self._local_cache_expiry:
                if time.time() < self._local_cache_expiry[key]:
                    self._stats['hits'] += 1
                    return self._local_cache[key]
                else:
                    # Expired, remove it
                    del self._local_cache[key]
                    del self._local_cache_expiry[key]

        client = self._get_client()
        if client is None:
            # Local cache fallback
            val = self._local_cache.get(key)
            if val and isinstance(val, str):
                try:
                    return json.loads(val)
                except json.JSONDecodeError:
                    return val
            self._stats['misses'] += 1
            return val

        try:
            value = client.get(key)
            if value:
                try:
                    result = json.loads(value)
                    self._stats['hits'] += 1
                    return result
                except json.JSONDecodeError:
                    self._stats['hits'] += 1
                    return value
            self._stats['misses'] += 1
            return None
        except Exception as e:
            logger.error(f"Erreur lors de la lecture du cache: {e}")
            self._stats['errors'] += 1
            return None

    async def aget(self, key: str) -> Optional[Any]:
        """Get value from cache (async version)."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self._executor, self.get, key)

    def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """Set value in cache (sync version)."""
        self._stats['sets'] += 1

        # Store in local cache with expiry
        self._local_cache[key] = value
        if expire > 0:
            self._local_cache_expiry[key] = time.time() + expire

        client = self._get_client()
        if client is None:
            return True

        try:
            from fastapi.encoders import jsonable_encoder
            if isinstance(value, (dict, list)):
                value_to_store = json.dumps(jsonable_encoder(value))
            else:
                value_to_store = value
            client.set(key, value_to_store, ex=expire)
            return True
        except Exception as e:
            logger.error(f"Erreur lors de l'écriture dans le cache: {e}")
            self._stats['errors'] += 1
            return False

    async def aset(self, key: str, value: Any, expire: int = 3600) -> bool:
        """Set value in cache (async version)."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self._executor, self.set, key, value, expire)

    def delete(self, key: str) -> bool:
        """Delete value from cache (sync version)."""
        self._stats['deletes'] += 1

        # Remove from local cache
        self._local_cache.pop(key, None)
        self._local_cache_expiry.pop(key, None)

        client = self._get_client()
        if client is None:
            return True

        try:
            client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Erreur lors de la suppression du cache: {e}")
            self._stats['errors'] += 1
            return False

    async def adelete(self, key: str) -> bool:
        """Delete value from cache (async version)."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self._executor, self.delete, key)

    def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching pattern (sync version)."""
        import re
        client = self._get_client()

        # Handle local cache
        regex = re.compile(pattern.replace('*', '.*'))
        keys_to_delete = [k for k in self._local_cache.keys() if regex.match(k)]
        for k in keys_to_delete:
            del self._local_cache[k]
            self._local_cache_expiry.pop(k, None)

        if client is None:
            self._stats['deletes'] += len(keys_to_delete)
            return len(keys_to_delete)

        try:
            keys = client.keys(pattern)
            if keys:
                client.delete(*keys)
            self._stats['deletes'] += len(keys_to_delete) + len(keys)
            return len(keys_to_delete) + len(keys)
        except Exception as e:
            logger.error(f"Erreur lors de la suppression par pattern du cache: {e}")
            self._stats['errors'] += 1
            return len(keys_to_delete)

    async def adelete_pattern(self, pattern: str) -> int:
        """Delete all keys matching pattern (async version)."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self._executor, self.delete_pattern, pattern)

    def exists(self, key: str) -> bool:
        """Check if key exists in cache (sync version)."""
        # Check local cache
        if key in self._local_cache:
            if key in self._local_cache_expiry:
                if time.time() < self._local_cache_expiry[key]:
                    return True
                else:
                    # Expired, remove it
                    del self._local_cache[key]
                    del self._local_cache_expiry[key]
                    return False
            return True

        client = self._get_client()
        if client is None:
            return key in self._local_cache

        try:
            return client.exists(key) > 0
        except Exception:
            return False

    async def aexists(self, key: str) -> bool:
        """Check if key exists in cache (async version)."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self._executor, self.exists, key)

    def get_stats(self) -> Dict[str, int]:
        """Get cache statistics."""
        return self._stats.copy()

    def reset_stats(self):
        """Reset cache statistics."""
        self._stats = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'deletes': 0,
            'errors': 0
        }

    def clear_local_cache(self):
        """Clear local cache only."""
        self._local_cache.clear()
        self._local_cache_expiry.clear()


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
            cached = await cache_service.aget(cache_key)
            if cached is not None:
                return cached

            # Exécuter la fonction
            result = await func(*args, **kwargs)

            # Mettre en cache le résultat
            await cache_service.aset(cache_key, result, expire)

            return result
        return wrapper
    return decorator


def cache_result_sync(key_prefix: str, expire: int = 3600):
    """
    Décorateur pour mettre en cache les résultats de fonction (sync).

    Args:
        key_prefix: Préfixe pour la clé de cache
        expire: Temps d'expiration en secondes
    """
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Générer la clé de cache
            cache_key = f"{key_prefix}:{str(args)}:{str(kwargs)}"

            # Essayer de récupérer du cache
            cached = cache_service.get(cache_key)
            if cached is not None:
                return cached

            # Exécuter la fonction
            result = func(*args, **kwargs)

            # Mettre en cache le résultat
            cache_service.set(cache_key, result, expire)

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


async def ainvalidate_cache_pattern(pattern: str) -> int:
    """
    Invalide toutes les clés correspondant au pattern (async).

    Args:
        pattern: Pattern de clés (ex: "article:*")
    Returns:
        Nombre de clés supprimées
    """
    return await cache_service.adelete_pattern(pattern)


def warm_cache(key: str, value: Any, expire: int = 3600) -> bool:
    """
    Préchauffe le cache avec une valeur.

    Args:
        key: Clé de cache
        value: Valeur à stocker
        expire: Temps d'expiration en secondes
    Returns:
        True si réussi
    """
    return cache_service.set(key, value, expire)


async def awarm_cache(key: str, value: Any, expire: int = 3600) -> bool:
    """
    Préchauffe le cache avec une valeur (async).

    Args:
        key: Clé de cache
        value: Valeur à stocker
        expire: Temps d'expiration en secondes
    Returns:
        True si réussi
    """
    return await cache_service.aset(key, value, expire)
