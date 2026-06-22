# tests/test_transport_service.py
import pytest
from unittest.mock import MagicMock, patch, ANY
from decimal import Decimal
from datetime import datetime

from app.services.transport_service import (
    CamionFlotteService, ChauffeurProfilService, MissionTransportService,
    calculer_ecart_carburant, SEUIL_ECART_CARBURANT
)
from app.models.transport import (
    CamionFlotte, ChauffeurProfil, MissionTransport,
    StatutCamion, StatutMission, TypeVehicule
)
from app.schemas.transport import CamionFlotteCreate, ChauffeurProfilCreate, MissionCreate


@pytest.fixture
def mock_db_session():
    """Fixture pour simuler une session de base de données."""
    return MagicMock()


# --- Tests pour CamionFlotteService ---

@patch('app.services.transport_service.cache_service')
def test_get_all_camions(mock_cache, mock_db_session):
    """Vérifie la récupération de tous les camions avec mise en cache."""
    # GIVEN: Le cache est vide, la DB retourne une liste de camions
    mock_cache.get.return_value = None
    mock_db_session.query.return_value.offset.return_value.limit.return_value.all.return_value = [CamionFlotte(id=1)]

    # WHEN
    CamionFlotteService.get_all_camions(mock_db_session)

    # THEN
    mock_cache.get.assert_called_once()
    mock_db_session.query.assert_called_once()
    mock_cache.set.assert_called_once()


@patch('app.services.transport_service.invalidate_cache_pattern')
def test_create_camion(mock_invalidate, mock_db_session):
    """Vérifie la création d'un camion et l'invalidation du cache."""
    # GIVEN
    camion_data = CamionFlotteCreate(
        immatriculation="LT-123-AB",
        type_vehicule=TypeVehicule.PORTE_CONTENEUR,
        marque="MAN",
        modele="TGX",
        charge_utile_kg=Decimal("25000"),
        volume_reservoir_litres=Decimal("400"),
        conso_theorique_l_100=Decimal("35")
    )

    # WHEN
    CamionFlotteService.create_camion(mock_db_session, camion_data, "test_user")

    # THEN
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()
    mock_invalidate.assert_called_once_with("transport:camions:*")


# --- Tests pour ChauffeurProfilService ---

def test_get_chauffeurs_disponibles(mock_db_session):
    """Vérifie que seuls les chauffeurs sans mission active sont retournés."""
    # GIVEN: Un mock de la sous-requête qui retourne les ID des chauffeurs occupés
    mock_subquery = MagicMock()
    mock_db_session.query.return_value.filter.return_value.subquery.return_value = mock_subquery

    # WHEN
    ChauffeurProfilService.get_chauffeurs_disponibles(mock_db_session)

    # THEN
    # Vérifie que la requête principale filtre bien les chauffeurs dont l'ID n'est pas dans la sous-requête
    mock_db_session.query.return_value.filter.return_value.all.assert_called_once()
    call_args = mock_db_session.query.return_value.filter.call_args
    assert "notin_" in str(call_args)


# --- Tests pour MissionTransportService ---

@patch('app.services.transport_service.MissionTransportService.valider_creation_mission', return_value=None)
@patch('app.services.transport_service.CamionFlotteService.get_camion')
@patch('app.services.transport_service.invalidate_cache_pattern')
def test_create_mission_success(mock_invalidate, mock_get_camion, mock_valider, mock_db_session):
    """Vérifie la création réussie d'une mission."""
    # GIVEN
    mission_data = MissionCreate(
        reference="MISS-001", tiers_id=1, camion_id=1, chauffeur_id=1,
        origine="Port", destination="Client", distance_km=Decimal("100"),
        type_marchandise="CONTENEUR_20"
    )
    mock_get_camion.return_value = CamionFlotte(id=1, statut=StatutCamion.DISPONIBLE)

    # WHEN
    MissionTransportService.create_mission(mock_db_session, mission_data, "test_user")

    # THEN
    mock_valider.assert_called_once_with(mock_db_session, mission_data)
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()
    assert mock_invalidate.call_count >= 3 # missions, camions, chauffeurs


def test_valider_creation_mission_camion_indisponible(mock_db_session):
    """Vérifie qu'une erreur est levée si le camion n'est pas disponible."""
    # GIVEN
    mission_data = MissionCreate(camion_id=1, chauffeur_id=1, type_marchandise="VRAC")
    # Le camion est déjà en route
    mock_camion = CamionFlotte(id=1, immatriculation="LT-123-AB", statut=StatutCamion.EN_ROUTE)
    with patch('app.services.transport_service.CamionFlotteService.get_camion', return_value=mock_camion):
        # WHEN / THEN
        with pytest.raises(ValueError, match="Camion LT-123-AB déjà en mission"):
            MissionTransportService.valider_creation_mission(mock_db_session, mission_data)


def test_valider_creation_mission_chauffeur_indisponible(mock_db_session):
    """Vérifie qu'une erreur est levée si le chauffeur est déjà en mission."""
    # GIVEN
    mission_data = MissionCreate(camion_id=1, chauffeur_id=1, type_marchandise="VRAC")
    mock_camion = CamionFlotte(id=1, statut=StatutCamion.DISPONIBLE)
    # Le chauffeur a déjà une mission active
    mock_db_session.query.return_value.filter.return_value.first.return_value = MissionTransport(id=99)

    with patch('app.services.transport_service.CamionFlotteService.get_camion', return_value=mock_camion):
        # WHEN / THEN
        with pytest.raises(ValueError, match="Chauffeur déjà affecté"):
            MissionTransportService.valider_creation_mission(mock_db_session, mission_data)


@pytest.mark.parametrize("type_vehicule, type_marchandise, should_fail", [
    (TypeVehicule.PORTE_CONTENEUR, "CONTENEUR_20", False),
    (TypeVehicule.PORTE_CONTENEUR, "VRAC", True),
    (TypeVehicule.BENNE_VRAC, "VRAC_SOLIDE", False),
    (TypeVehicule.BENNE_VRAC, "CONTENEUR_40", True),
])
def test_verifier_coherence_type(type_vehicule, type_marchandise, should_fail):
    """Vérifie la règle de cohérence entre type de camion et marchandise."""
    # GIVEN / WHEN / THEN
    if should_fail:
        with pytest.raises(ValueError, match="Incohérence"):
            MissionTransportService._verifier_coherence_type(type_vehicule, type_marchandise)
    else:
        try:
            MissionTransportService._verifier_coherence_type(type_vehicule, type_marchandise)
        except ValueError:
            pytest.fail("ValueError ne devait pas être levée")


@patch('app.services.transport_service.CamionFlotteService.get_camion')
def test_demarrer_mission(mock_get_camion, mock_db_session):
    """Vérifie que démarrer une mission met à jour les statuts."""
    # GIVEN
    mock_mission = MissionTransport(id=1, statut=StatutMission.PLANIFIEE, camion_id=1)
    mock_camion = CamionFlotte(id=1, statut=StatutCamion.DISPONIBLE)
    mock_get_camion.return_value = mock_camion
    with patch('app.services.transport_service.MissionTransportService.get_mission', return_value=mock_mission):
        # WHEN
        result = MissionTransportService.demarrer_mission(mock_db_session, 1)

        # THEN
        assert result.statut == StatutMission.EN_ROUTE
        assert result.date_depart is not None
        assert mock_camion.statut == StatutCamion.EN_ROUTE
        mock_db_session.commit.assert_called_once()


# --- Tests pour la fonction utilitaire ---

@pytest.mark.parametrize("reelle, distance, theorique_100, attendu", [
    (Decimal("40"), Decimal("100"), Decimal("35"), Decimal("0.1428")), # Ecart > 10%
    (Decimal("36"), Decimal("100"), Decimal("35"), Decimal("0.0285")), # Ecart < 10%
    (Decimal("70"), Decimal("200"), Decimal("35"), Decimal("0.0")),    # Ecart nul
])
def test_calculer_ecart_carburant(reelle, distance, theorique_100, attendu):
    """Vérifie le calcul de l'écart de consommation de carburant."""
    # WHEN
    result = calculer_ecart_carburant(reelle, distance, theorique_100)

    # THEN
    assert abs(result - attendu) < Decimal("0.0001")

def test_calculer_ecart_carburant_alerte():
    """Vérifie que l'écart est supérieur au seuil d'alerte."""
    # GIVEN
    ecart = calculer_ecart_carburant(Decimal("45"), Decimal("100"), Decimal("35"))

    # THEN
    assert ecart > SEUIL_ECART_CARBURANT