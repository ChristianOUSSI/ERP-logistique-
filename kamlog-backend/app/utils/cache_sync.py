# app/utils/cache_sync.py - Wrapper synchrone pour le cache Redis async
import asyncio
from typing import Optional, Any
from app.utils.cache import cache_service as async_cache_service


class SyncCacheService:
    """Service de cache synchrone qui wraps le service async."""
    
    def __init__(self):
        self.async_service = async_cache_service
    
    def get(self, key: str) -> Optional[Any]:
        """Récupère une valeur du cache de façon synchrone."""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # Si on est déjà dans un event loop, créer une nouvelle tâche
                return asyncio.create_task(self.async_service.get(key))
            else:
                return loop.run_until_complete(self.async_service.get(key))
        except RuntimeError:
            # Pas d'event loop, en créer un
            return asyncio.run(self.async_service.get(key))
    
    def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """Définit une valeur dans le cache de façon synchrone."""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                return asyncio.create_task(self.async_service.set(key, value, expire))
            else:
                return loop.run_until_complete(self.async_service.set(key, value, expire))
        except RuntimeError:
            return asyncio.run(self.async_service.set(key, value, expire))
    
    def delete(self, key: str) -> bool:
        """Supprime une valeur du cache de façon synchrone."""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                return asyncio.create_task(self.async_service.delete(key))
            else:
                return loop.run_until_complete(self.async_service.delete(key))
        except RuntimeError:
            return asyncio.run(self.async_service.delete(key))


def invalidate_cache_pattern_sync(pattern: str) -> int:
    """Invalide toutes les clés correspondant au pattern de façon synchrone."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return asyncio.create_task(async_cache_service.delete_pattern(pattern))
        else:
            return loop.run_until_complete(async_cache_service.delete_pattern(pattern))
    except RuntimeError:
        return asyncio.run(async_cache_service.delete_pattern(pattern))


# Instance globale du service de cache synchrone
cache_service_sync = SyncCacheService()