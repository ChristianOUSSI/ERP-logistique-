# app/utils/logger.py - Configuration des logs structurés avec loguru
from loguru import logger
import sys
from app.config import settings
from app.utils.tracing import get_request_id


def setup_logger():
    """Configure loguru pour des logs structurés JSON en production avec ID de corrélation."""

    # Supprimer le handler par défaut
    logger.remove()

    # Ensure UTF-8 encoding for stdout to avoid UnicodeEncodeError
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    # Format de log en développement
    dev_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<cyan>{extra[request_id]}</cyan> | "
        "<level>{message}</level>"
    )

    # Format de log en production (JSON)
    prod_format = (
        '{{"time": "{time:YYYY-MM-DD HH:mm:ss.SSS}", '
        '"level": "{level.name}", '
        '"name": "{name}", '
        '"function": "{function}", '
        '"line": {line}, '
        '"request_id": "{extra[request_id]}", '
        '"message": "{message}"}}'
    )

    def request_id_formatter(record):
        """Formatter personnalisé pour injecter l'ID de requête dans les logs."""
        # Obtenir l'ID de requête depuis l'état du contexte actuel
        # Pour loguru, nous utilisons le binding extra
        request_id = record["extra"].get("request_id", "no-request-id")
        record["extra"]["request_id"] = request_id
        return record

    if settings.DEBUG:
        # Logs en console pour le développement
        logger.add(
            sys.stdout,
            format=dev_format,
            level="DEBUG",
            colorize=True,
            filter=request_id_formatter
        )
    else:
        # Logs JSON en production
        logger.add(
            sys.stdout,
            format=prod_format,
            level="INFO",
            serialize=True,
            filter=request_id_formatter
        )

    # Logs vers un fichier (rotation automatique)
    import os
    if os.environ.get("LOG_TO_FILE", "false").lower() == "true":
        try:
            logger.add(
                "logs/app_{time:YYYY-MM-DD}.log",
                rotation="00:00",  # Nouveau fichier chaque jour à minuit
                retention="30 days",  # Garder 30 jours de logs
                compression="zip",  # Comprimer les anciens logs
                level="INFO",
                format=prod_format if not settings.DEBUG else dev_format,
                filter=request_id_formatter
            )

            # Logs d'erreurs séparés
            logger.add(
                "logs/error_{time:YYYY-MM-DD}.log",
                rotation="00:00",
                retention="90 days",
                compression="zip",
                level="ERROR",
                format=prod_format if not settings.DEBUG else dev_format,
                filter=request_id_formatter
            )
        except Exception as e:
            logger.warning(f"Could not setup file logging: {e}")

    return logger


def get_logger(name: str):
    """
    Récupère un logger avec un nom spécifique.

    Args:
        name: Nom du logger (ex: le nom du module)

    Returns:
        Logger configuré
    """
    return logger.bind(name=name)


# Fonction helper pour créer un logger avec contexte de requête
def get_request_logger(name: str, request_id: str = None):
    """
    Crée un logger lié à un ID de requête spécifique.

    Args:
        name: Nom du logger
        request_id: ID de requête (optionnel, sera récupéré depuis le contexte si disponible)

    Returns:
        Logger avec contexte de requête lié
    """
    if request_id is None:
        # Dans un vrai contexte de requête, ceci viendrait du middleware
        # Pour maintenant, nous retournons un logger de base
        return logger.bind(name=name)
    return logger.bind(name=name, request_id=request_id)


# Initialiser le logger au démarrage
setup_logger()
