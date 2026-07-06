# tests/unit/test_dossier_service.py
import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime

from app.services.dossier_service import DossierService
from app.models.dossier import DossierOperationnel
from app.models.tiers import Tiers
from app.schemas.dossier import DossierCreate, DossierUpdate
from app.exceptions import ForbiddenException, NotFoundException


@pytest.fixture
def mock_db_session():
    """Fixture pour simuler une session de base de données."""
    return MagicMock()


@patch('app.services.dossier_service.TiersService.get_tiers')
@patch('app.services.dossier_service.invalidate_cache_pattern')
def test_create_dossier_success(mock_invalidate, mock_get_tiers, mock_db_session):
    """Vérifie la création réussie d'un dossier avec habilitation client."""
    # GIVEN: Le client existe et est autorisé pour le transit
    mock_client = Tiers(id=1, raison_sociale="Client Test", autorise_transit=True)
    mock_get_tiers.return_value = mock_client
    
    # Simuler qu'aucun dossier existant n'a ce numéro
    mock_db_session.query.return_value.filter.return_value.first.return_value = None
    mock_db_session.query.return_value.filter.return_value.count.return_value = 0

    dossier_data = DossierCreate(
        tiers_id=1,
        type_service_concerne="K-TRANSIT",
        description="Test Transit"
    )

    # WHEN
    result = DossierService.create_dossier(mock_db_session, dossier_data, "test_user")

    # THEN
    assert result.tiers_id == 1
    assert result.type_service_concerne == "K-TRANSIT"
    assert result.statut_general == "OUVERT"
    assert result.createur_identifiant == "test_user"
    assert result.numero_dossier.startswith(f"KAM-{datetime.now().year}-TR-")
    
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()
    mock_invalidate.assert_called_once_with("dossiers:*")


@patch('app.services.dossier_service.TiersService.get_tiers')
def test_create_dossier_unauthorized(mock_get_tiers, mock_db_session):
    """Vérifie que la création échoue si le client n'est pas habilité."""
    # GIVEN: Le client n'est pas autorisé pour le transit
    mock_client = Tiers(id=1, raison_sociale="Client Test", autorise_transit=False)
    mock_get_tiers.return_value = mock_client

    dossier_data = DossierCreate(
        tiers_id=1,
        type_service_concerne="K-TRANSIT",
        description="Test Transit"
    )

    # WHEN / THEN
    with pytest.raises(ForbiddenException, match="n'est pas habilité"):
        DossierService.create_dossier(mock_db_session, dossier_data, "test_user")


@patch('app.services.dossier_service.TiersService.get_tiers', return_value=None)
def test_create_dossier_client_not_found(mock_get_tiers, mock_db_session):
    """Vérifie que la création échoue si le client n'existe pas."""
    # GIVEN: Le client n'existe pas
    dossier_data = DossierCreate(
        tiers_id=999,
        type_service_concerne="K-TRANSIT",
        description="Test Transit"
    )

    # WHEN / THEN
    with pytest.raises(NotFoundException, match="introuvable"):
        DossierService.create_dossier(mock_db_session, dossier_data, "test_user")


@patch('app.services.dossier_service.DossierService.get_dossier')
@patch('app.services.dossier_service.invalidate_cache_pattern')
def test_update_dossier(mock_invalidate, mock_get_dossier, mock_db_session):
    """Vérifie la mise à jour d'un dossier."""
    # GIVEN
    mock_dossier = DossierOperationnel(id=1, statut="OUVERT", statut_general="OUVERT")
    mock_get_dossier.return_value = mock_dossier

    update_data = DossierUpdate(statut_general="EN_COURS")

    # WHEN
    result = DossierService.update_dossier(mock_db_session, 1, update_data)

    # THEN
    assert result.statut_general == "EN_COURS"
    assert result.statut == "EN_COURS"
    mock_db_session.commit.assert_called_once()
    mock_invalidate.assert_called_once_with("dossiers:*")
