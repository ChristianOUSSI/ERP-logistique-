# tests/test_auth.py  Tests Authentification
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    """Test l'enregistrement d'un utilisateur."""
    response = await client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "testpass123",
            "full_name": "Test User",
            "role": "dispatcher",
            "agency_id": "00000000-0000-0000-0000-000000000000"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"


@pytest.mark.asyncio
async def test_login(client: AsyncClient):
    """Test la connexion d'un utilisateur."""
    # D'abord créer un utilisateur
    await client.post(
        "/api/auth/register",
        json={
            "email": "login@example.com",
            "username": "loginuser",
            "password": "loginpass123",
            "full_name": "Login User",
            "role": "dispatcher",
            "agency_id": "00000000-0000-0000-0000-000000000000"
        }
    )
    
    # Puis se connecter
    response = await client.post(
        "/api/auth/login",
        json={
            "username": "loginuser",
            "password": "loginpass123",
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    """Test la connexion avec des identifiants invalides."""
    response = await client.post(
        "/api/auth/login",
        json={
            "username": "nonexistent",
            "password": "wrongpass",
        }
    )
    assert response.status_code == 401
