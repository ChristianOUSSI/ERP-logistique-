# app/database.py  Database Engine & Session KAMLOG
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings


class Base(DeclarativeBase):
    """Base déclarative SQLAlchemy 2.0."""
    pass


# Engine async PostgreSQL avec connection pooling optimisé
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_size=20,  # Nombre de connexions permanentes dans le pool
    max_overflow=10,  # Nombre maximum de connexions au-delà du pool_size
    pool_pre_ping=True,  # Vérifier les connexions avant utilisation
    pool_recycle=3600,  # Recycler les connexions après 1 heure
)

# Session factory async
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    """Dependency injection pour les sessions de base de données."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
