# app/repositories/__init__.py - Exports des repositories
from app.repositories.base_repository import BaseRepository
from app.repositories.magasin_repository import MagasinRepository

__all__ = ["BaseRepository", "MagasinRepository"]
