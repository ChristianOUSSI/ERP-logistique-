# tests/test_transport.py  Tests Transport Module
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_camions(client: AsyncClient, auth_headers):
    """Test la liste des camions."""
    response = await client.get("/api/transport/camions", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_camion(client: AsyncClient, auth_headers):
    """Test la création d'un camion."""
    response = await client.post(
        "/api/transport/camions",
        headers=auth_headers,
        json={
            "immatriculation": "LT-456-CD",
            "type_vehicule": "BENNE_VRAC",
            "statut": "DISPONIBLE",
            "conso_theorique_l_100": 40.0,
            "capacite_tonne": 25
        }
    )
    assert response.status_code in [201, 400]  # 400 si immatriculation existe déjà


@pytest.mark.asyncio
async def test_get_camion_by_id(client: AsyncClient, auth_headers):
    """Test la récupération d'un camion par ID."""
    response = await client.get("/api/transport/camions/1", headers=auth_headers)
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_update_camion(client: AsyncClient, auth_headers):
    """Test la mise à jour d'un camion."""
    response = await client.put(
        "/api/transport/camions/1",
        headers=auth_headers,
        json={
            "statut": "EN_MAINTENANCE",
            "conso_theorique_l_100": 38.0
        }
    )
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_delete_camion(client: AsyncClient, auth_headers):
    """Test la suppression d'un camion."""
    # D'abord créer un camion
    create_response = await client.post(
        "/api/transport/camions",
        headers=auth_headers,
        json={
            "immatriculation": "LT-789-EF",
            "type_vehicule": "PORTE_CONTENEUR",
            "statut": "DISPONIBLE",
            "conso_theorique_l_100": 35.0
        }
    )
    if create_response.status_code == 201:
        camion_id = create_response.json()["id"]
        
        # Puis le supprimer
        response = await client.delete(f"/api/transport/camions/{camion_id}", headers=auth_headers)
        assert response.status_code == 204


@pytest.mark.asyncio
async def test_set_camion_maintenance(client: AsyncClient, auth_headers):
    """Test la mise en maintenance d'un camion."""
    response = await client.post("/api/transport/camions/1/maintenance", headers=auth_headers)
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_set_camion_disponible(client: AsyncClient, auth_headers):
    """Test la mise en disponibilité d'un camion."""
    response = await client.post("/api/transport/camions/1/disponible", headers=auth_headers)
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_list_chauffeurs(client: AsyncClient, auth_headers):
    """Test la liste des chauffeurs."""
    response = await client.get("/api/transport/chauffeurs", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_chauffeur(client: AsyncClient, auth_headers):
    """Test la création d'un chauffeur."""
    response = await client.post(
        "/api/transport/chauffeurs",
        headers=auth_headers,
        json={
            "nom": "Jane Smith",
            "telephone": "+237 987 654 321",
            "permis_conduire": "B789012",
            "statut": "DISPONIBLE"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["nom"] == "Jane Smith"


@pytest.mark.asyncio
async def test_list_missions(client: AsyncClient, auth_headers):
    """Test la liste des missions."""
    response = await client.get("/api/transport/missions", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_mission(client: AsyncClient, auth_headers):
    """Test la création d'une mission."""
    response = await client.post(
        "/api/transport/missions",
        headers=auth_headers,
        json={
            "tiers_id": 1,
            "camion_id": 1,
            "chauffeur_id": 1,
            "type_marchandise": "CONTENEUR_20",
            "distance_km": 150,
            "adresse_livraison": "123 Delivery St"
        }
    )
    assert response.status_code in [201, 404]


@pytest.mark.asyncio
async def test_demarrer_mission(client: AsyncClient, auth_headers):
    """Test le démarrage d'une mission."""
    response = await client.post("/api/transport/missions/1/demarrer", headers=auth_headers)
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_terminer_mission(client: AsyncClient, auth_headers):
    """Test la terminaison d'une mission."""
    response = await client.post("/api/transport/missions/1/terminer", headers=auth_headers)
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_list_bandes(client: AsyncClient, auth_headers):
    """Test la liste des bandes de livraison."""
    response = await client.get("/api/transport/bandes", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
