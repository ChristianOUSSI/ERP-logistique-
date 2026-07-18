# app/utils/performance.py - Utilities for performance monitoring and logging
import time
import functools
from typing import Callable, Any
from loguru import logger
from app.utils.tracing import get_request_id


def log_performance(threshold_ms: float = 1000.0):
    """
    Décorateur pour journaliser les performances des fonctions.

    Args:
        threshold_ms: Seuil en millisecondes au-dessus duquel un avertissement est loggé

    Example:
        @log_performance(threshold_ms=500.0)
        async def my_function():
            # ...
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                elapsed_ms = (time.time() - start_time) * 1000

                # Récupérer l'ID de requête si disponible dans le contexte
                # Cette approche fonctionne mieux dans un contexte de requête réelle
                # Pour les fonctions appelées en dehors d'une requête, l'ID sera "no-request-id"
                logger.debug(
                    f"Function {func.__name__} executed in {elapsed_ms:.2f}ms",
                    function=func.__name__,
                    elapsed_ms=elapsed_ms,
                    threshold_ms=threshold_ms,
                    performance=True
                )

                if elapsed_ms > threshold_ms:
                    logger.warning(
                        f"Slow function detected: {func.__name__} took {elapsed_ms:.2f}ms "
                        f"(threshold: {threshold_ms}ms)",
                        function=func.__name__,
                        elapsed_ms=elapsed_ms,
                        threshold_ms=threshold_ms,
                        performance_alert=True
                    )

                return result
            except Exception as e:
                elapsed_ms = (time.time() - start_time) * 1000
                logger.error(
                    f"Function {func.__name__} failed after {elapsed_ms:.2f}ms: {str(e)}",
                    function=func.__name__,
                    elapsed_ms=elapsed_ms,
                    exception=str(e),
                    performance=True
                )
                raise

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                elapsed_ms = (time.time() - start_time) * 1000

                logger.debug(
                    f"Function {func.__name__} executed in {elapsed_ms:.2f}ms",
                    function=func.__name__,
                    elapsed_ms=elapsed_ms,
                    threshold_ms=threshold_ms,
                    performance=True
                )

                if elapsed_ms > threshold_ms:
                    logger.warning(
                        f"Slow function detected: {func.__name__} took {elapsed_ms:.2f}ms "
                        f"(threshold: {threshold_ms}ms)",
                        function=func.__name__,
                        elapsed_ms=elapsed_ms,
                        threshold_ms=threshold_ms,
                        performance_alert=True
                    )

                return result
            except Exception as e:
                elapsed_ms = (time.time() - start_time) * 1000
                logger.error(
                    f"Function {func.__name__} failed after {elapsed_ms:.2f}ms: {str(e)}",
                    function=func.__name__,
                    elapsed_ms=elapsed_ms,
                    exception=str(e),
                    performance=True
                )
                raise

        # Retourner le wrapper approprié selon le type de fonction
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


# Import asyncio ici pour éviter les imports circulaires
import asyncio


def monitor_db_operation(operation_name: str):
    """
    Décorateur spécialisé pour surveiller les opérations de base de données.

    Args:
        operation_name: Nom de l'opération DB (ex: "SELECT", "INSERT", "UPDATE")

    Example:
        @monitor_db_operation("SELECT")
        def get_user_by_id(user_id: int):
            # ...
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                elapsed_ms = (time.time() - start_time) * 1000

                logger.debug(
                    f"DB operation {operation_name} completed in {elapsed_ms:.2f}ms",
                    db_operation=operation_name,
                    elapsed_ms=elapsed_ms,
                    performance=True
                )

                # Log en tant qu'avertissement si lent (> 100ms pour les opérations DB)
                if elapsed_ms > 100.0:
                    logger.warning(
                        f"Slow DB operation: {operation_name} took {elapsed_ms:.2f}ms",
                        db_operation=operation_name,
                        elapsed_ms=elapsed_ms,
                        performance_alert=True
                    )

                return result
            except Exception as e:
                elapsed_ms = (time.time() - start_time) * 1000
                logger.error(
                    f"DB operation {operation_name} failed after {elapsed_ms:.2f}ms: {str(e)}",
                    db_operation=operation_name,
                    elapsed_ms=elapsed_ms,
                    exception=str(e),
                    performance=True
                )
                raise

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                elapsed_ms = (time.time() - start_time) * 1000

                logger.debug(
                    f"DB operation {operation_name} completed in {elapsed_ms:.2f}ms",
                    db_operation=operation_name,
                    elapsed_ms=elapsed_ms,
                    performance=True
                )

                if elapsed_ms > 100.0:
                    logger.warning(
                        f"Slow DB operation: {operation_name} took {elapsed_ms:.2f}ms",
                        db_operation=operation_name,
                        elapsed_ms=elapsed_ms,
                        performance_alert=True
                    )

                return result
            except Exception as e:
                elapsed_ms = (time.time() - start_time) * 1000
                logger.error(
                    f"DB operation {operation_name} failed after {elapsed_ms:.2f}ms: {str(e)}",
                    db_operation=operation_name,
                    elapsed_ms=elapsed_ms,
                    exception=str(e),
                    performance=True
                )
                raise

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator