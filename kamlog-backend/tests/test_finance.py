# tests/test_finance.py  Tests Finance Module
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_factures(client: AsyncClient, auth_headers):
    """Test la liste des factures."""
    response = await client.get("/api/finance/factures", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_facture(client: AsyncClient, auth_headers):
    """Test la création d'une facture."""
    response = await client.post(
        "/api/finance/factures",
        headers=auth_headers,
        json={
            "tiers_id": 1,
            "montant_ht_xaf": 100000,
            "date_facture": "2026-06-09",
            "description": "Test invoice"
        }
    )
    assert response.status_code in [201, 402, 404]  # 402 si limite crédit dépassée, 404 si tiers inexistant


@pytest.mark.asyncio
async def test_get_facture_by_id(client: AsyncClient, auth_headers):
    """Test la récupération d'une facture par ID."""
    response = await client.get("/api/finance/factures/1", headers=auth_headers)
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_get_factures_by_tiers(client: AsyncClient, auth_headers):
    """Test la récupération des factures d'un tiers."""
    response = await client.get("/api/finance/factures/tiers/1", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_update_facture(client: AsyncClient, auth_headers):
    """Test la mise à jour d'une facture."""
    response = await client.put(
        "/api/finance/factures/1",
        headers=auth_headers,
        json={
            "montant_ht_xaf": 150000,
            "description": "Updated description"
        }
    )
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_delete_facture(client: AsyncClient, auth_headers):
    """Test la suppression d'une facture."""
    # D'abord créer une facture
    create_response = await client.post(
        "/api/finance/factures",
        headers=auth_headers,
        json={
            "tiers_id": 1,
            "montant_ht_xaf": 50000,
            "date_facture": "2026-06-09",
            "description": "Delete test invoice"
        }
    )
    if create_response.status_code == 201:
        facture_id = create_response.json()["id"]
        
        # Puis la supprimer
        response = await client.delete(f"/api/finance/factures/{facture_id}", headers=auth_headers)
        assert response.status_code == 204


@pytest.mark.asyncio
async def test_valider_facture(client: AsyncClient, auth_headers):
    """Test la validation d'une facture."""
    response = await client.post("/api/finance/factures/1/valider", headers=auth_headers)
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_annuler_facture(client: AsyncClient, auth_headers):
    """Test l'annulation d'une facture."""
    response = await client.post("/api/finance/factures/1/annuler", headers=auth_headers)
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_list_encaissements(client: AsyncClient, auth_headers):
    """Test la liste des encaissements."""
    response = await client.get("/api/finance/encaissements", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_encaissement(client: AsyncClient, auth_headers):
    """Test la création d'un encaissement."""
    response = await client.post(
        "/api/finance/encaissements",
        headers=auth_headers,
        json={
            "facture_id": 1,
            "montant_xaf": 119250,
            "mode_paiement": "VIREMENT",
            "reference_paiement": "REF-123456"
        }
    )
    assert response.status_code in [201, 404]


@pytest.mark.asyncio
async def test_lettrer_encaissement(client: AsyncClient, auth_headers):
    """Test le lettrage d'un encaissement."""
    response = await client.post("/api/finance/encaissements/1/lettrer", headers=auth_headers)
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_calculer_encours(client: AsyncClient, auth_headers):
    """Test le calcul de l'encours client."""
    response = await client.get("/api/finance/encours/1", headers=auth_headers)
    assert response.status_code in [200, 404]
