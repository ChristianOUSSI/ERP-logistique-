# tests/test_parc_service.py
import pytest
from unittest.mock import MagicMock, patch, ANY
from datetime import datetime

from app.services.parc_service import (
    ZoneParcService, EmplacementParcService, StockPhysiqueParcService,
    MouvementParcService, GateService
)
from app.models.parc import (
    ZoneParc, EmplacementParc, StockPhysiqueParc, MouvementParc,
    StatutEmplacement
)
from app.schemas.parc import (
    ZoneParcCreate, EmplacementParcCreate, GateInRequest, GateOutRequest
)


@pytest.fixture
def mock_db_session():
    """Fixture pour simuler une session de base de données."""
    return MagicMock()


# --- Tests pour ZoneParcService ---

@patch('app.services.parc_service.invalidate_cache_pattern')
def test_create_zone(mock_invalidate, mock_db_session):
    """Vérifie la création d'une zone et l'invalidation du cache."""
    # GIVEN
    zone_data = ZoneParcCreate(code_zone="ZONE-TEST", nom_zone="Zone de Test", type_zone="STOCKAGE", capacite_evp=100)

    # WHEN
    ZoneParcService.create_zone(mock_db_session, zone_data, "test_user")

    # THEN
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()
    mock_invalidate.assert_called_once_with("parc:zones:*")


# --- Tests pour EmplacementParcService ---

@patch('app.services.parc_service.cache_service')
def test_get_emplacements_libres(mock_cache, mock_db_session):
    """Vérifie que seuls les emplacements avec le statut LIBRE sont retournés."""
    # GIVEN
    mock_cache.get.return_value = None
    mock_db_session.query.return_value.filter.return_value.all.return_value = [EmplacementParc(statut=StatutEmplacement.LIBRE)]

    # WHEN
    result = EmplacementParcService.get_emplacements_libres(mock_db_session)

    # THEN
    mock_db_session.query.return_value.filter.assert_called_once()
    assert len(result) > 0
    assert all(emp.statut == StatutEmplacement.LIBRE for emp in result)
    mock_cache.set.assert_called_once()


# --- Tests pour GateService ---

@patch('app.services.parc_service.AuditService.log_action')
@patch('app.services.parc_service.invalidate_cache_pattern')
@patch('app.services.parc_service.StockPhysiqueParcService.get_stock_by_conteneur', return_value=None)
@patch('app.services.parc_service.EmplacementParcService.get_emplacement')
def test_process_gate_in_success(mock_get_emplacement, mock_get_stock, mock_invalidate, mock_audit, mock_db_session):
    """Vérifie le succès d'un Gate In."""
    # GIVEN: Un emplacement libre et un conteneur non existant dans le parc
    mock_emplacement = EmplacementParc(id=1, code_emplacement="A-01-01", statut=StatutEmplacement.LIBRE)
    mock_get_emplacement.return_value = mock_emplacement
    gate_in_data = GateInRequest(numero_conteneur="MSCU1234567", type_conteneur="20DRY", etat="BON", emplacement_id=1)

    # WHEN
    result = GateService.process_gate_in(mock_db_session, gate_in_data, operateur_id=1)

    # THEN
    # 1. Le stock est créé
    mock_db_session.add.call_count > 0
    # 2. L'emplacement est marqué comme OCCUPE
    assert mock_emplacement.statut == StatutEmplacement.OCCUPE
    # 3. Un mouvement est créé
    # 4. Le cache est invalidé
    mock_invalidate.assert_called_once_with("parc:*")
    # 5. L'audit est appelé
    mock_audit.assert_called_once()
    # 6. Le message de succès est retourné
    assert result["message"] == "Gate In réussi"


@patch('app.services.parc_service.EmplacementParcService.get_emplacement')
def test_process_gate_in_fail_emplacement_occupe(mock_get_emplacement, mock_db_session):
    """Vérifie l'échec d'un Gate In si l'emplacement est occupé."""
    # GIVEN: Un emplacement occupé
    mock_emplacement = EmplacementParc(id=1, statut=StatutEmplacement.OCCUPE)
    mock_get_emplacement.return_value = mock_emplacement
    gate_in_data = GateInRequest(numero_conteneur="MSCU1234567", type_conteneur="20DRY", etat="BON", emplacement_id=1)

    # WHEN / THEN
    with pytest.raises(ValueError, match="Emplacement non libre"):
        GateService.process_gate_in(mock_db_session, gate_in_data, operateur_id=1)


@patch('app.services.parc_service.StockPhysiqueParcService.get_stock_by_conteneur')
@patch('app.services.parc_service.EmplacementParcService.get_emplacement')
def test_process_gate_in_fail_conteneur_deja_present(mock_get_emplacement, mock_get_stock, mock_db_session):
    """Vérifie l'échec d'un Gate In si le conteneur est déjà dans le parc."""
    # GIVEN: Un emplacement libre mais le conteneur existe déjà
    mock_get_emplacement.return_value = EmplacementParc(id=1, statut=StatutEmplacement.LIBRE)
    mock_get_stock.return_value = StockPhysiqueParc(id=99)
    gate_in_data = GateInRequest(numero_conteneur="MSCU1234567", type_conteneur="20DRY", etat="BON", emplacement_id=1)

    # WHEN / THEN
    with pytest.raises(ValueError, match="Conteneur déjà présent"):
        GateService.process_gate_in(mock_db_session, gate_in_data, operateur_id=1)


@patch('app.services.parc_service.AuditService.log_action')
@patch('app.services.parc_service.invalidate_cache_pattern')
@patch('app.services.parc_service.EmplacementParcService.get_emplacement')
@patch('app.services.parc_service.StockPhysiqueParcService.get_stock_by_conteneur')
def test_process_gate_out_success(mock_get_stock, mock_get_emplacement, mock_invalidate, mock_audit, mock_db_session):
    """Vérifie le succès d'un Gate Out."""
    # GIVEN: Un conteneur existant dans le parc
    mock_stock = StockPhysiqueParc(id=1, numero_conteneur="MSCU1234567", emplacement_id=1, date_gate_out=None)
    mock_emplacement = EmplacementParc(id=1, statut=StatutEmplacement.OCCUPE)
    mock_get_stock.return_value = mock_stock
    mock_get_emplacement.return_value = mock_emplacement
    gate_out_data = GateOutRequest(numero_conteneur="MSCU1234567")

    # WHEN
    result = GateService.process_gate_out(mock_db_session, gate_out_data, operateur_id=1)

    # THEN
    # 1. La date de sortie du stock est mise à jour
    assert mock_stock.date_gate_out is not None
    # 2. L'emplacement est libéré
    assert mock_emplacement.statut == StatutEmplacement.LIBRE
    # 3. Le cache est invalidé
    mock_invalidate.assert_called_once_with("parc:*")
    # 4. L'audit est appelé
    mock_audit.assert_called_once()
    # 5. Le message de succès est retourné
    assert result["message"] == "Gate Out réussi"


@patch('app.services.parc_service.StockPhysiqueParcService.get_stock_by_conteneur', return_value=None)
def test_process_gate_out_fail_conteneur_non_trouve(mock_get_stock, mock_db_session):
    """Vérifie l'échec d'un Gate Out si le conteneur n'est pas dans le parc."""
    # GIVEN: Le conteneur n'est pas trouvé
    gate_out_data = GateOutRequest(numero_conteneur="XXXX0000000")

    # WHEN / THEN
    with pytest.raises(ValueError, match="Conteneur non trouvé"):
        GateService.process_gate_out(mock_db_session, gate_out_data, operateur_id=1)