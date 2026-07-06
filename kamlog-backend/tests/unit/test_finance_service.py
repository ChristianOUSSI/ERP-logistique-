# tests/test_finance_service.py
import pytest
from unittest.mock import MagicMock, patch
from decimal import Decimal
from datetime import datetime

from app.services.finance_service import (
    AvoirService, FactureService, EncaissementService, GrilleTarifaireService,
    EncoursService, BankReconciliationService, calculer_tva
)
from app.models.finance import Avoir, Facture, Encaissement, GrilleTarifaire, StatutFacture
from app.models.tiers import Tiers
from app.schemas.finance import AvoirCreate, FactureCreate, EncaissementCreate, GrilleTarifaireCreate, GrilleTarifaireUpdate
from app.exceptions import NotFoundException, ConflictException, BusinessLogicException
from app.config import settings

# --- Fixtures ---
TVA_RATE = Decimal(str(settings.TVA_RATE))

@pytest.fixture
def avoir_service():
    """Fixture pour instancier AvoirService."""
    return AvoirService()


@pytest.fixture
def facture_service():
    """Fixture pour instancier FactureService."""
    return FactureService()


@pytest.fixture
def encaissement_service():
    """Fixture pour instancier EncaissementService."""
    return EncaissementService()


@pytest.fixture
def grille_tarifaire_service():
    """Fixture pour instancier GrilleTarifaireService."""
    return GrilleTarifaireService()


@pytest.fixture
def encours_service():
    """Fixture pour instancier EncoursService."""
    return EncoursService()


@pytest.fixture
def bank_reconciliation_service():
    """Fixture pour instancier BankReconciliationService."""
    return BankReconciliationService()

@pytest.fixture
def mock_db_session():
    """Fixture pour simuler une session de base de données."""
    return MagicMock()


# --- Tests pour AvoirService ---
def test_get_all_avoirs(avoir_service, mock_db_session):
    """
    Vérifie que get_all_avoirs appelle correctement la méthode get_all du repository.
    """
    # GIVEN: Le repository est mocké pour retourner une liste d'avoirs
    mock_avoirs = [Avoir(id=1), Avoir(id=2)]
    avoir_service.repo.get_all = MagicMock(return_value=mock_avoirs)

    # WHEN: On appelle le service pour récupérer tous les avoirs
    result = avoir_service.get_all_avoirs(mock_db_session, skip=0, limit=100)

    # THEN: La méthode du repository est appelée avec les bons arguments et le résultat est correct
    avoir_service.repo.get_all.assert_called_once_with(mock_db_session, 0, 100)
    assert result == mock_avoirs


def test_get_avoir_found(avoir_service, mock_db_session):
    """
    Vérifie la récupération d'un avoir existant.
    """
    # GIVEN: Le repository retourne un avoir
    mock_avoir = Avoir(id=1, numero_avoir="AV-001")
    avoir_service.repo.get_by_id = MagicMock(return_value=mock_avoir)

    # WHEN: On récupère l'avoir par son ID
    result = avoir_service.get_avoir(mock_db_session, 1)

    # THEN: L'avoir est retourné
    avoir_service.repo.get_by_id.assert_called_once_with(mock_db_session, 1)
    assert result == mock_avoir


def test_get_avoir_not_found(avoir_service, mock_db_session):
    """
    Vérifie que NotFoundException est levée si l'avoir n'existe pas.
    """
    # GIVEN: Le repository ne retourne aucun avoir
    avoir_service.repo.get_by_id = MagicMock(return_value=None)

    # WHEN/THEN: On essaie de récupérer un avoir inexistant et on s'attend à une exception
    with pytest.raises(NotFoundException, match="Avoir introuvable."):
        avoir_service.get_avoir(mock_db_session, 99)
    avoir_service.repo.get_by_id.assert_called_once_with(mock_db_session, 99)


def test_create_avoir_success(avoir_service, mock_db_session):
    """
    Vérifie la création réussie d'un avoir.
    """
    # GIVEN: Le numéro d'avoir n'existe pas et les données de création sont valides
    avoir_data = AvoirCreate(numero_avoir="AV-002", tiers_id=1, montant_xaf=Decimal("1000"), motif="Remboursement")
    avoir_service.repo.get_by_numero = MagicMock(return_value=None)
    avoir_service.repo.create = MagicMock(return_value=Avoir(id=2, **avoir_data.model_dump()))

    # WHEN: On crée l'avoir
    result = avoir_service.create_avoir(mock_db_session, avoir_data, "test_user")

    # THEN: Les méthodes du repository sont appelées et le résultat est correct
    avoir_service.repo.get_by_numero.assert_called_once_with(mock_db_session, "AV-002")
    avoir_service.repo.create.assert_called_once()
    assert result.numero_avoir == "AV-002"
    assert result.cree_par == "test_user"


def test_create_avoir_conflict(avoir_service, mock_db_session):
    """
    Vérifie que ConflictException est levée si le numéro d'avoir existe déjà.
    """
    # GIVEN: Le numéro d'avoir existe déjà
    avoir_data = AvoirCreate(numero_avoir="AV-001", tiers_id=1, montant_xaf=Decimal("1000"), motif="Remboursement")
    avoir_service.repo.get_by_numero = MagicMock(return_value=Avoir(id=1))

    # WHEN/THEN: On essaie de créer l'avoir et on s'attend à une exception
    with pytest.raises(ConflictException, match="Un avoir avec ce numéro existe déjà."):
        avoir_service.create_avoir(mock_db_session, avoir_data, "test_user")
    avoir_service.repo.get_by_numero.assert_called_once_with(mock_db_session, "AV-001")


def test_mark_avoir_as_used_success(avoir_service, mock_db_session):
    """
    Vérifie que l'on peut marquer un avoir non utilisé comme utilisé.
    """
    # GIVEN: Un avoir non utilisé est retourné par le repository
    mock_avoir = Avoir(id=1, est_utilise=False)
    avoir_service.repo.get_by_id = MagicMock(return_value=mock_avoir)

    # WHEN: On marque l'avoir comme utilisé
    result = avoir_service.mark_avoir_as_used(mock_db_session, 1)

    # THEN: Le statut de l'avoir est mis à jour et les méthodes de la DB sont appelées
    assert result.est_utilise is True
    mock_db_session.commit.assert_called_once()
    mock_db_session.refresh.assert_called_once_with(mock_avoir)


def test_mark_avoir_as_used_already_used(avoir_service, mock_db_session):
    """
    Vérifie qu'une exception est levée si l'on tente de marquer un avoir déjà utilisé.
    """
    # GIVEN: Un avoir déjà utilisé est retourné
    mock_avoir = Avoir(id=1, est_utilise=True)
    avoir_service.repo.get_by_id = MagicMock(return_value=mock_avoir)

    # WHEN/THEN: On essaie de marquer l'avoir et on s'attend à une exception
    with pytest.raises(BusinessLogicException, match="Cet avoir est déjà utilisé."):
        avoir_service.mark_avoir_as_used(mock_db_session, 1)
    mock_db_session.commit.assert_not_called()


def test_get_total_unutilized_avoir_amount(avoir_service, mock_db_session):
    """
    Vérifie le calcul du montant total des avoirs non utilisés pour un tiers.
    """
    # GIVEN: Le repository retourne un montant total
    total_amount = Decimal("5500.50")
    avoir_service.repo.get_total_unutilized_amount = MagicMock(return_value=total_amount)

    # WHEN: On appelle le service pour obtenir le total
    result = avoir_service.get_total_unutilized_avoir_amount(mock_db_session, tiers_id=1)

    # THEN: La méthode du repository est appelée et le résultat est correct
    avoir_service.repo.get_total_unutilized_amount.assert_called_once_with(mock_db_session, 1)
    assert result == total_amount


# --- Tests pour FactureService ---

@patch('app.services.finance_service.invalidate_cache_pattern')
def test_create_facture(mock_invalidate, facture_service, mock_db_session):
    """Vérifie la création d'une facture et le calcul de la TVA."""
    # GIVEN
    facture_data = FactureCreate(
        numero_facture="FAC-001",
        tiers_id=1,
        montant_ht_xaf=Decimal("10000"),
        tva_xaf=Decimal("0"), # Sera recalculé
        montant_ttc_xaf=Decimal("0"), # Sera recalculé
        date_emission=datetime.now(),
        date_echeance=datetime.now()
    )
    
    # WHEN
    created_facture = facture_service.create_facture(mock_db_session, facture_data, "test_user")

    # THEN
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()
    mock_db_session.refresh.assert_called_once()
    mock_invalidate.assert_called_once_with("finance:factures:*")

    # Vérifier le calcul de la TVA et du TTC
    assert created_facture.montant_ht_xaf == Decimal("10000")
    assert created_facture.montant_ttc_xaf == Decimal("10000") * (1 + TVA_RATE)
    assert created_facture.cree_par == "test_user"

@patch('app.services.finance_service.FactureService.get_facture')
@patch('app.services.finance_service.invalidate_cache_pattern')
def test_valider_facture(mock_invalidate, mock_get_facture, facture_service, mock_db_session):
    """Vérifie la validation d'une facture."""
    # GIVEN
    mock_facture = Facture(id=1, statut=StatutFacture.BROUILLON)
    mock_get_facture.return_value = mock_facture

    # WHEN
    result = facture_service.valider_facture(mock_db_session, 1, "validator_user")

    # THEN
    mock_get_facture.assert_called_once_with(mock_db_session, 1)
    assert result.statut == StatutFacture.EMISE
    assert result.valide_par == "validator_user"
    assert result.date_validation is not None
    mock_db_session.commit.assert_called_once()
    mock_invalidate.assert_called_once_with("finance:factures:*")


# --- Tests pour EncaissementService ---

@patch('app.services.finance_service.invalidate_cache_pattern')
def test_create_encaissement(mock_invalidate, encaissement_service, mock_db_session):
    """Vérifie la création d'un encaissement."""
    # GIVEN
    encaissement_data = EncaissementCreate(
        reference="ENC-001",
        tiers_id=1,
        montant_xaf=Decimal("5000"),
        mode_paiement="ESPECES",
        date_paiement=datetime.now()
    )

    # WHEN
    encaissement_service.create_encaissement(mock_db_session, encaissement_data, "test_user")

    # THEN
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()
    assert mock_invalidate.call_count == 2
    mock_invalidate.assert_any_call("finance:encaissements:*")
    mock_invalidate.assert_any_call("finance:factures:*")


@patch('app.services.finance_service.EncaissementService.get_encaissement')
@patch('app.services.finance_service.invalidate_cache_pattern')
def test_lettrer_encaissement(mock_invalidate, mock_get_encaissement, encaissement_service, mock_db_session):
    """Vérifie le lettrage d'un encaissement."""
    # GIVEN
    mock_encaissement = Encaissement(id=1, lettree=False)
    mock_get_encaissement.return_value = mock_encaissement

    # WHEN
    result = encaissement_service.lettrer_encaissement(mock_db_session, 1, 10)

    # THEN
    assert result.lettree is True
    assert result.facture_id == 10
    mock_db_session.commit.assert_called_once()
    assert mock_invalidate.call_count == 2


# --- Tests pour EncoursService ---

@patch('app.services.finance_service.cache_service')
def test_calculer_encours_client(mock_cache, encours_service, mock_db_session):
    """Vérifie le calcul de l'encours client."""
    # GIVEN
    mock_cache.get.return_value = None # Pas de cache
    mock_db_session.query.return_value.filter.return_value.scalar.side_effect = [
        Decimal("150000"), # total_factures
        Decimal("25000")   # total_encaissements
    ]
    mock_db_session.query.return_value.filter.return_value.first.return_value = Tiers(limite_credit_xaf=200000)

    # WHEN
    result = encours_service.calculer_encours_client(mock_db_session, 1)

    # THEN
    assert result["encours_xaf"] == Decimal("125000")
    assert result["limite_credit_xaf"] == Decimal("200000")
    assert result["alerte"] is False
    assert result["bloque"] is False
    mock_cache.set.assert_called_once()


@patch('app.services.finance_service.EncoursService.calculer_encours_client')
def test_verifier_limite_credit_ok(mock_calculer_encours, encours_service, mock_db_session):
    """Vérifie que la limite de crédit n'est pas dépassée."""
    # GIVEN
    mock_calculer_encours.return_value = {
        "encours_xaf": Decimal("100000"),
        "limite_credit_xaf": Decimal("200000")
    }

    # WHEN/THEN: Aucune exception ne doit être levée
    try:
        encours_service.verifier_limite_credit(mock_db_session, 1, Decimal("50000"))
    except ValueError:
        pytest.fail("ValueError ne devait pas être levée")


@patch('app.services.finance_service.EncoursService.calculer_encours_client')
def test_verifier_limite_credit_exceeded(mock_calculer_encours, encours_service, mock_db_session):
    """Vérifie que ValueError est levée quand la limite de crédit est dépassée."""
    # GIVEN
    mock_calculer_encours.return_value = {
        "encours_xaf": Decimal("180000"),
        "limite_credit_xaf": Decimal("200000")
    }

    # WHEN/THEN
    with pytest.raises(ValueError, match="Limite crédit dépassée"):
        encours_service.verifier_limite_credit(mock_db_session, 1, Decimal("30000"))


# --- Test pour la fonction utilitaire ---

def test_calculer_tva():
    """Vérifie le calcul de la TVA."""
    # GIVEN
    montant_ht = Decimal("1000")

    # WHEN
    result = calculer_tva(montant_ht)

    # THEN
    assert result["montant_ht_xaf"] == montant_ht
    assert result["tva_xaf"] == (montant_ht * TVA_RATE).quantize(Decimal('1'))
    assert result["montant_ttc_xaf"] == montant_ht + (montant_ht * TVA_RATE).quantize(Decimal('1'))
    assert result["taux_tva"] == float(TVA_RATE * 100)


# --- Tests pour BankReconciliationService ---

@patch('app.services.finance_service.EncaissementService.get_encaissements_non_lettrés')
def test_perform_automatic_matching(mock_get_non_lettres, bank_reconciliation_service, mock_db_session):
    """Vérifie l'algorithme de rapprochement bancaire."""
    # GIVEN
    bank_statements = [
        {'date': datetime(2023, 1, 15), 'description': 'PAIEMENT FACTURE 123', 'amount': Decimal("150.00")},
        {'date': datetime(2023, 1, 16), 'description': 'VIREMENT XYZ', 'amount': Decimal("200.00")}
    ]
    unmatched_erp = [
        Encaissement(id=1, date_paiement=datetime(2023, 1, 14), reference='FACTURE 123', montant_xaf=Decimal("150.00")),
        Encaissement(id=2, date_paiement=datetime(2023, 1, 25), reference='AUTRE REF', montant_xaf=Decimal("300.00"))
    ]
    mock_get_non_lettres.return_value = unmatched_erp

    # WHEN
    results = bank_reconciliation_service.perform_automatic_matching(mock_db_session, bank_statements)

    # THEN
    assert len(results) == 2
    
    # Premier relevé doit matcher
    assert results[0]["bank_entry"] == bank_statements[0]
    assert results[0]["erp_match"] is not None
    assert results[0]["erp_match"].id == 1
    assert results[0]["confidence"] > 80 # Score élevé attendu

    # Deuxième relevé ne doit pas matcher
    assert results[1]["bank_entry"] == bank_statements[1]
    assert results[1]["erp_match"] is None
    assert results[1]["confidence"] == 0.0


# --- Tests pour GrilleTarifaireService ---

@patch('app.services.finance_service.invalidate_cache_pattern')
def test_create_grille(mock_invalidate, grille_tarifaire_service, mock_db_session):
    """Vérifie la création d'une grille tarifaire."""
    # GIVEN
    grille_data = GrilleTarifaireCreate(
        code="T-2024",
        nom="Tarif Standard 2024",
        service="TRANSPORT",
        date_debut_validite=datetime.now(),
        date_fin_validite=datetime.now()
    )
    
    # WHEN
    grille_tarifaire_service.create_grille(mock_db_session, grille_data, "test_user")

    # THEN
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()
    mock_db_session.refresh.assert_called_once()
    mock_invalidate.assert_called_once_with("finance:grilles:*")


@patch('app.services.finance_service.GrilleTarifaireService.get_grille')
@patch('app.services.finance_service.invalidate_cache_pattern')
def test_update_grille(mock_invalidate, mock_get_grille, grille_tarifaire_service, mock_db_session):
    """Vérifie la mise à jour d'une grille tarifaire."""
    # GIVEN
    mock_grille = GrilleTarifaire(id=1, nom="Ancien Nom")
    mock_get_grille.return_value = mock_grille
    update_data = GrilleTarifaireUpdate(nom="Nouveau Nom")

    # WHEN
    result = grille_tarifaire_service.update_grille(mock_db_session, 1, update_data)

    # THEN
    assert result.nom == "Nouveau Nom"
    mock_db_session.commit.assert_called_once()
    mock_invalidate.assert_called_once_with("finance:grilles:*")


@patch('app.services.finance_service.GrilleTarifaireService.get_grille')
@patch('app.services.finance_service.invalidate_cache_pattern')
def test_activer_grille(mock_invalidate, mock_get_grille, grille_tarifaire_service, mock_db_session):
    """Vérifie l'activation d'une grille et la désactivation des autres."""
    # GIVEN
    mock_grille_to_activate = GrilleTarifaire(id=1, type_service="TRANSPORT", active=False)
    mock_get_grille.return_value = mock_grille_to_activate
    
    # Mock pour la query de désactivation
    mock_update_query = MagicMock()
    mock_filter_query = MagicMock()
    mock_filter_query.update.return_value = mock_update_query
    mock_db_session.query.return_value.filter.return_value = mock_filter_query

    # WHEN
    result = grille_tarifaire_service.activer_grille(mock_db_session, 1)

    # THEN
    # 1. La grille cible est bien activée
    assert result.active is True
    # 2. La query pour désactiver les autres grilles a été appelée
    mock_db_session.query.assert_called_with(GrilleTarifaire)
    mock_filter_query.update.assert_called_once_with({"active": False})
    # 3. La session a été commitée
    mock_db_session.commit.assert_called_once()
    mock_invalidate.assert_called_once_with("finance:grilles:*")