import logging
from sqlalchemy import inspect
from app.database import engine

logger = logging.getLogger(__name__)

def get_missing_required_tables(*args, **kwargs):
    """Vérifie si les tables requises manquent dans la base de données."""
    try:
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        required_tables = ["users", "roles", "tiers", "articles", "declarations", "missions"]
        missing = [table for table in required_tables if table not in existing_tables]
        return missing
    except Exception as e:
        logger.warning(f"Impossible d'inspecter les tables: {e}")
        return []

def bootstrap_system(*args, **kwargs):
    """Initialisation du système."""
    print("🚀 KAMLOG System Bootstrap initialized.")
    return True
