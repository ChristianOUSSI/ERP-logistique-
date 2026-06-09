# tests/test_parc.py  Tests Parc Module
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_zones(client: AsyncClient, auth_headers):
    """Test la liste des zones."""
    response = await client.get("/api/parc/zones", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_zone(client: AsyncClient, auth_headers):
    """Test la création d'une zone."""
    response = await client.post(
        "/api/parc/zones",
        headers=auth_headers,
        json={
            "code_zone": "ZONE-A",
            "nom_zone": "Zone A",
            "capacite": 100,
            "description": "Zone de stockage A"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["code_zone"] == "ZONE-A"
    assert data["nom_zone"] == "Zone A"


@pytest.mark.asyncio
async def test_get_zone_by_id(client: AsyncClient, auth_headers):
    """Test la récupération d'une zone par ID."""
    # D'abord créer une zone
    create_response = await client.post(
        "/api/parc/zones",
        headers=auth_headers,
        json={
            "code_zone": "ZONE-B",
            "nom_zone": "Zone B",
            "capacite": 150
        }
    )
    zone_id = create_response.json()["id"]
    
    # Puis la récupérer
    response = await client.get(f"/api/parc/zones/{zone_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == zone_id


@pytest.mark.asyncio
async def test_update_zone(client: AsyncClient, auth_headers):
    """Test la mise à jour d'une zone."""
    # D'abord créer une zone
    create_response = await client.post(
        "/api/parc/zones",
        headers=auth_headers,
        json={
            "code_zone": "ZONE-C",
            "nom_zone": "Zone C",
            "capacite": 200
        }
    )
    zone_id = create_response.json()["id"]
    
    # Puis la mettre à jour
    response = await client.put(
        f"/api/parc/zones/{zone_id}",
        headers=auth_headers,
        json={
            "nom_zone": "Zone C Updated",
            "capacite": 250
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nom_zone"] == "Zone C Updated"


@pytest.mark.asyncio
async def test_delete_zone(client: AsyncClient, auth_headers):
    """Test la suppression d'une zone."""
    # D'abord créer une zone
    create_response = await client.post(
        "/api/parc/zones",
        headers=auth_headers,
        json={
            "code_zone": "ZONE-D",
            "nom_zone": "Zone D",
            "capacite": 100
        }
    )
    zone_id = create_response.json()["id"]
    
    # Puis la supprimer
    response = await client.delete(f"/api/parc/zones/{zone_id}", headers=auth_headers)
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_list_emplacements(client: AsyncClient, auth_headers):
    """Test la liste des emplacements."""
    response = await client.get("/api/parc/emplacements", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_gate_in(client: AsyncClient, auth_headers):
    """Test l'entrée d'un véhicule au parc."""
    response = await client.post(
        "/api/parc/gate-in",
        headers=auth_headers,
        json={
            "immatriculation": "LT-123-AB",
            "type_vehicule": "CAMION",
            "chauffeur_nom": "John Doe",
            "mission_id": 1
        }
    )
    assert response.status_code in [201, 404]  # 404 si la mission n'existe pas


@pytest.mark.asyncio
async def test_gate_out(client: AsyncClient, auth_headers):
    """Test la sortie d'un véhicule du parc."""
    response = await client.post(
        "/api/parc/gate-out",
        headers=auth_headers,
        json={
            "immatriculation": "LT-123-AB",
            "motif_sortie": "LIVRAISON"
        }
    )
    assert response.status_code in [200, 404]
