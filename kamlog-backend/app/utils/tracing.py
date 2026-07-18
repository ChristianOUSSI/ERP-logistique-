# app/utils/tracing.py - Request tracing and correlation ID utilities
import uuid
import time
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from loguru import logger
import logging

class TracingMiddleware(BaseHTTPMiddleware):
    """Middleware pour ajouter des IDs de corrélation et tracer les requêtes."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Générer ou extraire l'ID_124F2114-65DE-47EC-9723-0770E2F4B871
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())

        # Stocker dans l'état de la requête pour un accès ultérieur
        request.state.request_id = request_id

        # Enregistrer le début de la requête avec le logger structuré
        start_time = time.time()

        # Log de début de requête avec contexte
        logger.bind(
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            query_params=str(request.query_params),
            client_host=request.client.host if request.client else None,
            user_agent=request.headers.get("User-Agent")
        ).info("Request started")

        try:
            # Traiter la requête
            response: Response = await call_next(request)

            # Calculer la durée
            process_time = time.time() - start_time
            duration_ms = int(process_time * 1000)

            # Ajouter les en-têtes de réponse
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time-MS"] = str(duration_ms)

            # Log de fin de requête réussie
            logger.bind(
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                duration_ms=duration_ms
            ).info("Request completed")

            return response

        except Exception as exc:
            # Calculer la durée même en cas d'erreur
            process_time = time.time() - start_time
            duration_ms = int(process_time * 1000)

            # Log de l'erreur avec contexte complet
            logger.bind(
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                duration_ms=duration_ms,
                exc_info=True
            ).error(f"Request failed: {exc}")

            # Re-lever l'exception pour qu'elle soit gérée par les handlers d'erreur
            raise

def get_request_id(request: Request) -> str:
    """
    Récupère l'ID de la requête courante.

    Args:
        request: Instance de Request FastAPI

    Returns:
        String représentant l'ID de la requête
    """
    return getattr(request.state, "request_id", "unknown")

def add_request_context_logger(logger_instance, request: Request):
    """
    Ajoute le contexte de requête à une instance de logger.

    Args:
        logger_instance: Instance de logger Loguru
        request: Instance de Request FastAPI

    Returns:
        Logger avec contexte de requête lié
    """
    request_id = get_request_id(request)
    return logger_instance.bind(
        request_id=request_id,
        method=request.method,
        path=request.url.path
    )