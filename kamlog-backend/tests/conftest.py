import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from app.database import Base, get_db
from app.models import *
from httpx import AsyncClient
from app.main import app

# Configurer SQLAlchemy pour les tests avec une base en mémoire
TEST_DATABASE_URL = "sqlite:///:memory:"

from sqlalchemy.pool import StaticPool
test_engine = create_engine(
    TEST_DATABASE_URL, 
    echo=False, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestSessionLocal = sessionmaker(test_engine, class_=Session, expire_on_commit=False)

@pytest.fixture(scope="function")
def db_session():
    """Fixture pour une session de base de donnees de test."""
    with test_engine.begin() as conn:
        Base.metadata.drop_all(conn)
        Base.metadata.create_all(conn)
    
    with TestSessionLocal() as session:
        yield session
        session.rollback()

@pytest.fixture(scope="function")
async def client(db_session: Session):
    """Fixture pour un client HTTP de test."""
    def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    # Disable rate limiting for tests
    if hasattr(app.state, "limiter"):
        app.state.limiter.enabled = False
    
    from httpx import ASGITransport
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
async def auth_headers(client: AsyncClient, db_session: Session):
    """Fixture pour les headers d'authentification."""
    # Créer le rôle admin dans la base s'il n'existe pas
    role_db = db_session.query(RoleModel).filter_by(code="admin").first()
    if not role_db:
        role_db = RoleModel(code="admin", name="Admin", description="Administrateur système", is_active=True)
        db_session.add(role_db)
        db_session.commit()

    # Creer un utilisateur de test
    await client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "testpass123",
            "full_name": "Test User",
            "roles": ["admin"],
            "agency_id": "1",
        }
    )
    
    # Se connecter pour obtenir le token
    response = await client.post(
        "/api/auth/login",
        json={
            "username": "testuser",
            "password": "testpass123",
        }
    )
    
    if response.status_code != 200:
        raise Exception(f"Login failed during setup: {response.status_code} - {response.text}")
        
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
