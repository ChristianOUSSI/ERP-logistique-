# tests/test_purchase_service.py
import pytest
from unittest.mock import MagicMock, patch
from decimal import Decimal

from app.services.purchase_service import FicheBesoinService
from app.services.purchase_requisition_workflow_service import PurchaseRequisitionWorkflowService
from app.models.purchase import FicheBesoin, StatutFicheBesoin
from app.models.user import User
from app.schemas.purchase import FicheBesoinCreate, FicheBesoinUpdate
from app.exceptions import ResourceNotFoundError, BusinessRuleViolationError


@pytest.fixture
def mock_db_session():
    """Fixture pour simuler une session de base de données."""
    return MagicMock()


@pytest.fixture
def fiche_besoin_service():
    """Fixture pour instancier FicheBesoinService."""
    service = FicheBesoinService()
    service.repo = MagicMock()
    return service


# --- Tests pour FicheBesoinService ---

def test_create_fiche_besoin_success(fiche_besoin_service, mock_db_session):
    """Vérifie la création réussie d'une fiche de besoin."""
    # GIVEN: Le matricule n'existe pas
    fiche_data = FicheBesoinCreate(matricule="FB-001", designation="Test", quantite=Decimal("10"), unite="U")
    fiche_besoin_service.repo.get_by_matricule.return_value = None
    fiche_besoin_service.repo.create.return_value = FicheBesoin(id=1, **fiche_data.model_dump())

    # WHEN
    result = fiche_besoin_service.create(mock_db_session, fiche_data, demandeur_id=1, cree_par="test_user")

    # THEN
    fiche_besoin_service.repo.get_by_matricule.assert_called_once_with(mock_db_session, "FB-001")
    fiche_besoin_service.repo.create.assert_called_once()
    assert result.matricule == "FB-001"


def test_create_fiche_besoin_conflict(fiche_besoin_service, mock_db_session):
    """Vérifie qu'une erreur est levée si le matricule existe déjà."""
    # GIVEN: Le matricule existe déjà
    fiche_data = FicheBesoinCreate(matricule="FB-001", designation="Test", quantite=Decimal("10"), unite="U")
    fiche_besoin_service.repo.get_by_matricule.return_value = FicheBesoin(id=1)

    # WHEN / THEN
    with pytest.raises(BusinessRuleViolationError, match="matricule existe déjà"):
        fiche_besoin_service.create(mock_db_session, fiche_data, demandeur_id=1, cree_par="test_user")


def test_update_fiche_besoin_brouillon(fiche_besoin_service, mock_db_session):
    """Vérifie qu'une fiche en brouillon peut être modifiée."""
    # GIVEN: Une fiche en statut BROUILLON
    mock_fiche = FicheBesoin(id=1, statut=StatutFicheBesoin.BROUILLON, designation="Ancien")
    fiche_besoin_service.get_by_id = MagicMock(return_value=mock_fiche)
    update_data = FicheBesoinUpdate(designation="Nouveau")

    # WHEN
    fiche_besoin_service.update(mock_db_session, 1, update_data)

    # THEN
    fiche_besoin_service.repo.update.assert_called_once()


def test_update_fiche_besoin_non_brouillon_fail(fiche_besoin_service, mock_db_session):
    """Vérifie qu'une fiche non-brouillon ne peut pas être modifiée."""
    # GIVEN: Une fiche en statut APPROUVEE
    mock_fiche = FicheBesoin(id=1, statut=StatutFicheBesoin.APPROUVEE)
    fiche_besoin_service.get_by_id = MagicMock(return_value=mock_fiche)
    update_data = FicheBesoinUpdate(designation="Nouveau")

    # WHEN / THEN
    with pytest.raises(BusinessRuleViolationError, match="Seules les fiches en brouillon peuvent être modifiées"):
        fiche_besoin_service.update(mock_db_session, 1, update_data)


def test_delete_fiche_besoin_brouillon(fiche_besoin_service, mock_db_session):
    """Vérifie qu'une fiche en brouillon peut être supprimée."""
    # GIVEN: Une fiche en statut BROUILLON
    mock_fiche = FicheBesoin(id=1, statut=StatutFicheBesoin.BROUILLON)
    fiche_besoin_service.get_by_id = MagicMock(return_value=mock_fiche)

    # WHEN
    fiche_besoin_service.delete(mock_db_session, 1)

    # THEN
    fiche_besoin_service.repo.delete.assert_called_once_with(mock_db_session, mock_fiche)


# --- Tests pour PurchaseRequisitionWorkflowService ---

@patch('app.services.purchase_requisition_workflow_service.NotificationService.create_notification')
def test_submit_for_approval_success(mock_notification, mock_db_session):
    """Vérifie la soumission pour approbation et l'envoi de notification."""
    # GIVEN: Une fiche en brouillon
    mock_fiche = FicheBesoin(id=1, statut=StatutFicheBesoin.BROUILLON, demandeur_id=1)
    mock_db_session.query.return_value.filter.return_value.first.return_value = mock_fiche
    demandeur = User(id=1)

    # WHEN
    result = PurchaseRequisitionWorkflowService.submit_for_approval(mock_db_session, 1, demandeur)

    # THEN
    # 1. Le statut est mis à jour
    assert result.statut == StatutFicheBesoin.EN_ATTENTE_APPROBATION
    # 2. La session est commitée
    mock_db_session.commit.assert_called_once()
    # 3. Une notification est créée
    mock_notification.assert_called_once()


def test_submit_for_approval_wrong_status(mock_db_session):
    """Vérifie l'échec de la soumission si le statut n'est pas BROUILLON."""
    # GIVEN: Une fiche déjà approuvée
    mock_fiche = FicheBesoin(id=1, statut=StatutFicheBesoin.APPROUVEE, demandeur_id=1)
    mock_db_session.query.return_value.filter.return_value.first.return_value = mock_fiche
    demandeur = User(id=1)

    # WHEN / THEN
    with pytest.raises(BusinessRuleViolationError, match="La fiche doit être en statut 'BROUILLON'"):
        PurchaseRequisitionWorkflowService.submit_for_approval(mock_db_session, 1, demandeur)


def test_approve_or_reject_approve(mock_db_session):
    """Vérifie l'approbation d'une fiche."""
    # GIVEN: Une fiche en attente d'approbation
    mock_fiche = FicheBesoin(id=1, statut=StatutFicheBesoin.EN_ATTENTE_APPROBATION, demandeur_id=1)
    mock_db_session.query.return_value.filter.return_value.first.side_effect = [
        mock_fiche, # Pour la recherche de la fiche
        User(id=1, email="demandeur@test.com") # Pour la recherche du demandeur
    ]
    approbateur = User(id=2)

    # WHEN
    result = PurchaseRequisitionWorkflowService.approve_or_reject(mock_db_session, 1, approbateur, is_approved=True)

    # THEN
    assert result.statut == StatutFicheBesoin.APPROUVEE
    assert result.approbateur_id == 2
    assert result.date_approbation is not None
    mock_db_session.commit.assert_called_once()


def test_approve_or_reject_reject(mock_db_session):
    """Vérifie le rejet d'une fiche."""
    # GIVEN: Une fiche en attente d'approbation
    mock_fiche = FicheBesoin(id=1, statut=StatutFicheBesoin.EN_ATTENTE_APPROBATION, demandeur_id=1)
    mock_db_session.query.return_value.filter.return_value.first.side_effect = [mock_fiche, User(id=1)]
    approbateur = User(id=2)

    # WHEN
    result = PurchaseRequisitionWorkflowService.approve_or_reject(mock_db_session, 1, approbateur, is_approved=False, notes="Budget insuffisant")

    # THEN
    assert result.statut == StatutFicheBesoin.REJETEE
    assert result.notes_approbation == "Budget insuffisant"
    mock_db_session.commit.assert_called_once()