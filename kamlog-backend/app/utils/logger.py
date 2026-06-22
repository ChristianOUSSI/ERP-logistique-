# app/utils/logger.py - Configuration des logs structurés avec loguru
from loguru import logger
import sys
from app.config import settings


def setup_logger():
    """Configure loguru pour des logs structurés JSON en production."""
    
    # Supprimer le handler par défaut
    logger.remove()
    
    # Format de log en développement
    dev_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    )
    
    # Format de log en production (JSON)
    prod_format = (
        '{"time": "{time:YYYY-MM-DD HH:mm:ss.SSS}", '
        '"level": "{level.name}", '
        '"name": "{name}", '
        '"function": "{function}", '
        '"line": {line}, '
        '"message": "{message}"}'
    )
    
    if settings.DEBUG:
        # Logs en console pour le développement
        logger.add(
            sys.stdout,
            format=dev_format,
            level="DEBUG",
            colorize=True
        )
    else:
        # Logs JSON en production
        logger.add(
            sys.stdout,
            format=prod_format,
            level="INFO",
            serialize=True
        )
    
    # Logs vers un fichier (rotation automatique)
    logger.add(
        "logs/app_{time:YYYY-MM-DD}.log",
        rotation="00:00",  # Nouveau fichier chaque jour à minuit
        retention="30 days",  # Garder 30 jours de logs
        compression="zip",  # Comprimer les anciens logs
        level="INFO",
        format=prod_format if not settings.DEBUG else dev_format
    )
    
    # Logs d'erreurs séparés
    logger.add(
        "logs/error_{time:YYYY-MM-DD}.log",
        rotation="00:00",
        retention="90 days",
        compression="zip",
        level="ERROR",
        format=prod_format if not settings.DEBUG else dev_format
    )
    
    return logger


# Initialiser le logger au démarrage
setup_logger()


def get_logger(name: str):
    """
    Récupère un logger avec un nom spécifique.
    
    Args:
        name: Nom du logger (ex: le nom du module)
        
    Returns:
        Logger configuré
    """
    return logger.bind(name=name)
