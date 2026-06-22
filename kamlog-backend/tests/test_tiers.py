# tests/test_tiers.py  Tests Tiers Module
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_tiers(client: AsyncClient, auth_headers):
    """Test la liste des tiers."""
    response = await client.get("/api/tiers/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_tiers(client: AsyncClient, auth_headers):
    """Test la création d'un tiers."""
    response = await client.post(
        "/api/tiers/",
        headers=auth_headers,
        json={
            "code_tiers": "CLI001",
            "niu": "123456789012",
            "raison_sociale": "Test Company",
            "type_tiers": "CLIENT",
            "adresse": "123 Test St",
            "telephone": "+237 123 456 789",
            "email": "test@example.com",
            "limite_credit": 1000000
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["code_tiers"] == "CLI001"
    assert data["raison_sociale"] == "Test Company"


@pytest.mark.asyncio
async def test_get_tiers_by_id(client: AsyncClient, auth_headers):
    """Test la récupération d'un tiers par ID."""
    # D'abord créer un tiers
    create_response = await client.post(
        "/api/tiers/",
        headers=auth_headers,
        json={
            "code_tiers": "CLI002",
            "niu": "123456789013",
            "raison_sociale": "Get Test Company",
            "type_tiers": "CLIENT",
            "limite_credit": 500000
        }
    )
    tiers_id = create_response.json()["id"]
    
    # Puis le récupérer
    response = await client.get(f"/api/tiers/{tiers_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == tiers_id
    assert data["code_tiers"] == "CLI002"


@pytest.mark.asyncio
async def test_get_tiers_by_code(client: AsyncClient, auth_headers):
    """Test la récupération d'un tiers par code."""
    response = await client.get("/api/tiers/code/CLI001", headers=auth_headers)
    assert response.status_code in [200, 404]  # 404 si le tiers n'existe pas encore


@pytest.mark.asyncio
async def test_update_tiers(client: AsyncClient, auth_headers):
    """Test la mise à jour d'un tiers."""
    # D'abord créer un tiers
    create_response = await client.post(
        "/api/tiers/",
        headers=auth_headers,
        json={
            "code_tiers": "CLI003",
            "niu": "123456789014",
            "raison_sociale": "Update Test Company",
            "type_tiers": "CLIENT",
            "limite_credit": 500000
        }
    )
    tiers_id = create_response.json()["id"]
    
    # Puis le mettre à jour
    response = await client.put(
        f"/api/tiers/{tiers_id}",
        headers=auth_headers,
        json={
            "raison_sociale": "Updated Company Name",
            "telephone": "+237 987 654 321"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["raison_sociale"] == "Updated Company Name"


@pytest.mark.asyncio
async def test_delete_tiers(client: AsyncClient, auth_headers):
    """Test la suppression d'un tiers."""
    # D'abord créer un tiers
    create_response = await client.post(
        "/api/tiers/",
        headers=auth_headers,
        json={
            "code_tiers": "CLI004",
            "niu": "123456789015",
            "raison_sociale": "Delete Test Company",
            "type_tiers": "CLIENT",
            "limite_credit": 500000
        }
    )
    tiers_id = create_response.json()["id"]
    
    # Puis le supprimer
    response = await client.delete(f"/api/tiers/{tiers_id}", headers=auth_headers)
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_activer_tiers(client: AsyncClient, auth_headers):
    """Test l'activation d'un tiers."""
    # D'abord créer un tiers
    create_response = await client.post(
        "/api/tiers/",
        headers=auth_headers,
        json={
            "code_tiers": "CLI005",
            "niu": "123456789016",
            "raison_sociale": "Activate Test Company",
            "type_tiers": "CLIENT",
            "limite_credit": 500000
        }
    )
    tiers_id = create_response.json()["id"]
    
    # Puis l'activer
    response = await client.post(f"/api/tiers/{tiers_id}/activer", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["statut"] == "ACTIF"


@pytest.mark.asyncio
async def test_search_tiers(client: AsyncClient, auth_headers):
    """Test la recherche de tiers."""
    response = await client.get("/api/tiers/recherche/Test", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
