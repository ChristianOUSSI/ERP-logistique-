from datetime import timezone
# app/database.py  Database Engine & Session KAMLOG
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker, with_loader_criteria
from app.config import settings


from sqlalchemy import MetaData

naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}


class Base(DeclarativeBase):
    """Base déclarative SQLAlchemy 2.0."""
    metadata = MetaData(naming_convention=naming_convention)


# Engine PostgreSQL avec connection pooling optimisé
engine = create_engine(
    settings.DATABASE_URL.replace("+asyncpg", "").replace("+aiosqlite", ""),
    echo=settings.DEBUG,
    future=True,
    pool_size=20,  # Nombre de connexions permanentes dans le pool
    max_overflow=10,  # Nombre maximum de connexions au-delà du pool_size
    pool_pre_ping=True,  # Vérifier les connexions avant utilisation
    pool_recycle=3600,  # Recycler les connexions après 1 heure
)

# Session factory
SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    expire_on_commit=False,
)


def get_db():
    """Dependency injection pour les sessions de base de données."""
    with SessionLocal() as session:
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()


from sqlalchemy import event
import datetime

@event.listens_for(engine, "connect")
def register_sqlite_now(dbapi_connection, connection_record):
    if hasattr(dbapi_connection, "create_function"):
        try:
            dbapi_connection.create_function("now", 0, lambda: datetime.datetime.now(timezone.utc).isoformat())
        except Exception:
            pass

@event.listens_for(Session, "do_orm_execute")
def _add_filtering_criteria(execute_state):
    from app.models.base import BaseModel
    from app.models.user import User
    
    if (
        execute_state.is_select
        and not execute_state.is_column_load
        and not execute_state.is_relationship_load
    ):
        if not execute_state.execution_options.get("include_deleted", False):
            execute_state.statement = execute_state.statement.options(
                with_loader_criteria(
                    BaseModel,
                    lambda cls: cls.is_deleted.is_(False),
                    include_aliases=True,
                )
            )
        
        if not execute_state.execution_options.get("include_inactive", False):
            execute_state.statement = execute_state.statement.options(
                with_loader_criteria(
                    User,
                    lambda cls: cls.is_active.is_(True),
                    include_aliases=True,
                )
            )

