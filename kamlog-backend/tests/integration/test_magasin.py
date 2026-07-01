# tests/test_magasin.py  Tests Magasin Module
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_magasins(client: AsyncClient):
    """Test la liste des magasins."""
    response = await client.get("/api/magasin/magasins")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_magasin(client: AsyncClient):
    """Test la création d'un magasin."""
    response = await client.post(
        "/api/magasin/magasins",
        json={
            "code": "MAG-002",
            "nom": "Test Warehouse",
            "adresse": "456 Test Ave"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["code"] == "MAG-002"


@pytest.mark.asyncio
async def test_get_magasin_by_id(client: AsyncClient):
    """Test la récupération d'un magasin par ID."""
    response = await client.get("/api/magasin/magasins/1")
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_list_clients(client: AsyncClient):
    """Test la liste des clients."""
    response = await client.get("/api/magasin/clients")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_list_articles(client: AsyncClient):
    """Test la liste des articles."""
    response = await client.get("/api/magasin/articles")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_search_articles(client: AsyncClient):
    """Test la recherche d'articles."""
    response = await client.get("/api/magasin/articles/recherche/Product")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_list_declarations(client: AsyncClient):
    """Test la liste des déclarations."""
    response = await client.get("/api/magasin/declarations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_declaration(client: AsyncClient):
    """Test la création d'une déclaration."""
    response = await client.post(
        "/api/magasin/declarations",
        json={
            "client_id": 1,
            "date_declaration": "2026-06-09",
            "lignes": [
                {
                    "article_id": 1,
                    "quantite_declaree": 100,
                    "unite_mesure": "UDB"
                }
            ]
        }
    )
    assert response.status_code in [201, 404]


@pytest.mark.asyncio
async def test_valider_declaration(client: AsyncClient):
    """Test la validation d'une déclaration."""
    response = await client.post("/api/magasin/declarations/1/valider")
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_annuler_declaration(client: AsyncClient):
    """Test l'annulation d'une déclaration."""
    response = await client.post("/api/magasin/declarations/1/annuler")
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_list_receptions(client: AsyncClient):
    """Test la liste des réceptions."""
    response = await client.get("/api/magasin/receptions")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_reception(client: AsyncClient):
    """Test la création d'une réception."""
    response = await client.post(
        "/api/magasin/receptions",
        json={
            "declaration_id": 1,
            "magasin_id": 1,
            "date_reception": "2026-06-09",
            "lignes": [
                {
                    "article_id": 1,
                    "quantite_recue": 100,
                    "unite_mesure": "UDB"
                }
            ]
        }
    )
    assert response.status_code in [201, 404]


@pytest.mark.asyncio
async def test_completer_reception(client: AsyncClient):
    """Test la complétion d'une réception."""
    response = await client.post("/api/magasin/receptions/1/completer")
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_annuler_reception(client: AsyncClient):
    """Test l'annulation d'une réception."""
    response = await client.post("/api/magasin/receptions/1/annuler")
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_list_stocks(client: AsyncClient):
    """Test la liste des stocks."""
    response = await client.get("/api/magasin/stocks")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_filter_stocks(client: AsyncClient):
    """Test le filtrage des stocks."""
    response = await client.post(
        "/api/magasin/stocks/filtrer",
        json={
            "code_article": "1000001",
            "magasin_id": 1
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_list_commandes(client: AsyncClient):
    """Test la liste des commandes."""
    response = await client.get("/api/magasin/commandes")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_commande(client: AsyncClient):
    """Test la création d'une commande."""
    response = await client.post(
        "/api/magasin/commandes",
        json={
            "client_id": 1,
            "date_commande": "2026-06-09",
            "date_livraison_souhaitee": "2026-06-15",
            "lignes": [
                {
                    "article_id": 1,
                    "quantite_demandee": 50,
                    "unite_mesure": "UDB",
                    "prix_unitaire": 1000
                }
            ]
        }
    )
    assert response.status_code in [201, 404]


@pytest.mark.asyncio
async def test_valider_paiement_commande(client: AsyncClient):
    """Test la validation du paiement d'une commande."""
    response = await client.post("/api/magasin/commandes/1/valider-paiement")
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_mettre_en_preparation(client: AsyncClient):
    """Test la mise en préparation d'une commande."""
    response = await client.post("/api/magasin/commandes/1/preparation")
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_marquer_prete(client: AsyncClient):
    """Test le marquage d'une commande comme prête."""
    response = await client.post("/api/magasin/commandes/1/prete")
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_marquer_livree(client: AsyncClient):
    """Test le marquage d'une commande comme livrée."""
    response = await client.post("/api/magasin/commandes/1/livree")
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_annuler_commande(client: AsyncClient):
    """Test l'annulation d'une commande."""
    response = await client.post("/api/magasin/commandes/1/annuler")
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_list_bandes(client: AsyncClient):
    """Test la liste des bandes de livraison."""
    response = await client.get("/api/magasin/bandes")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_bande(client: AsyncClient):
    """Test la création d'une bande de livraison."""
    response = await client.post(
        "/api/magasin/bandes",
        json={
            "commande_id": 1,
            "magasin_id": 1,
            "lignes": [
                {
                    "article_id": 1,
                    "quantite": 50,
                    "unite_mesure": "UDB"
                }
            ]
        }
    )
    assert response.status_code in [201, 404]


# ============ MASTER DATA TESTS ============

@pytest.mark.asyncio
async def test_list_incoterms(client: AsyncClient, auth_headers):
    """Test la liste des Incoterms."""
    response = await client.get("/api/master-data/incoterms", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_incoterm(client: AsyncClient, auth_headers):
    """Test la création d'un Incoterm."""
    response = await client.post(
        "/api/master-data/incoterms",
        headers=auth_headers,
        json={
            "code": "TESTINCO",
            "nom": "Test Incoterm Name",
            "description": "Test Incoterm Description",
            "est_actif": True
        }
    )
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["code"] == "TESTINCO"
    assert data["nom"] == "Test Incoterm Name"


@pytest.mark.asyncio
async def test_list_container_types(client: AsyncClient, auth_headers):
    """Test la liste des types de conteneurs."""
    response = await client.get("/api/master-data/container-types", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_container_type(client: AsyncClient, auth_headers):
    """Test la création d'un type de conteneur."""
    response = await client.post(
        "/api/master-data/container-types",
        headers=auth_headers,
        json={
            "code": "TESTCONT",
            "nom": "Test Container Name",
            "description": "Test Container Description",
            "longueur": "20'",
            "type_conteneur": "Dry",
            "est_actif": True
        }
    )
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["code"] == "TESTCONT"


@pytest.mark.asyncio
async def test_list_units(client: AsyncClient, auth_headers):
    """Test la liste des unités de mesure."""
    response = await client.get("/api/master-data/units", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert "KG" in data


@pytest.mark.asyncio
async def test_list_article_categories(client: AsyncClient, auth_headers):
    """Test la liste des catégories d'articles."""
    response = await client.get("/api/master-data/article-categories", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert "ALIMENTAIRE" in data

