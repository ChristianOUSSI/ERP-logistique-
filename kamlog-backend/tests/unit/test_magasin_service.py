# tests/test_magasin_service.py
import pytest
from unittest.mock import MagicMock, patch, ANY
from decimal import Decimal
from datetime import datetime

from app.services.magasin_service import (
    MagasinService, ClientMagasinService, ArticleService, ConversionService,
    DeclarationService, ReceptionService, StockService, CommandeService, BandeLivraisonService
)
from app.models.magasin import (
    Magasin, ClientMagasin, Article, Declaration, LigneDeclaration, Reception, LigneReception,
    Stock, Commande, LigneCommande, BandeLivraison, LigneBandeLivraison,
    UniteMesure, StatutDeclaration, StatutCommande
)
from app.schemas.magasin import (
    DeclarationCreate, LigneDeclarationCreate, ReceptionCreate, LigneReceptionCreate,
    CommandeCreate, LigneCommandeCreate, BandeLivraisonCreate, LigneBandeLivraisonCreate
)
from app.exceptions import InsufficientStockError, InvalidConversionError, BusinessRuleViolationError


@pytest.fixture
def mock_db_session():
    """Fixture pour simuler une session de base de données."""
    return MagicMock()

# --- Tests pour ConversionService ---

@pytest.mark.parametrize("unite, poids_unitaire, quantite, attendu", [
    (UniteMesure.UDB, Decimal("10"), Decimal("5"), Decimal("5")),
    (UniteMesure.KG, Decimal("10"), Decimal("50"), Decimal("5")),
    (UniteMesure.TONNE, Decimal("10"), Decimal("1"), Decimal("100")),
])
def test_convertir_vers_udb_poids(unite, poids_unitaire, quantite, attendu):
    """Vérifie la conversion de diverses unités de poids vers UDB."""
    # GIVEN
    article = Article(poids_unitaire=poids_unitaire, volume_unitaire=None)

    # WHEN
    resultat = ConversionService.convertir_vers_udb(quantite, unite, article)

    # THEN
    assert resultat == attendu

def test_convertir_vers_udb_erreur_si_poids_manquant():
    """Vérifie qu'une exception est levée si le poids unitaire manque pour la conversion."""
    # GIVEN
    article = Article(poids_unitaire=None)

    # WHEN / THEN
    with pytest.raises(InvalidConversionError):
        ConversionService.convertir_vers_udb(Decimal("50"), UniteMesure.KG, article)


# --- Tests pour StockService ---

@patch('app.services.magasin_service.AuditService.log_stock_modification')
def test_mettre_a_jour_stock_apres_reception_creation(mock_audit, mock_db_session):
    """Vérifie la création d'une nouvelle entrée de stock après une réception."""
    # GIVEN: Une réception et aucun stock existant pour cet article/magasin
    reception = Reception(
        id=1, numero_reception="REC-001", magasin_id=1,
        lignes=[LigneReception(article_id=1, quantite_recue=Decimal("100"), quantite_udb=Decimal("100"))]
    )
    # Le service de stock ne trouve rien
    mock_db_session.query.return_value.filter.return_value.first.return_value = None

    # WHEN
    StockService.mettre_a_jour_stock_apres_reception(mock_db_session, reception, user_id=1)

    # THEN
    # 1. Une nouvelle entrée de stock est ajoutée à la session
    mock_db_session.add.assert_called_once()
    added_stock = mock_db_session.add.call_args[0][0]
    assert isinstance(added_stock, Stock)
    assert added_stock.article_id == 1
    assert added_stock.magasin_id == 1
    assert added_stock.quantite_disponible == Decimal("100")
    # 2. L'audit est appelé pour la création
    mock_audit.assert_called_once_with(
        db=mock_db_session,
        action="stock_creation",
        article_id=1,
        magasin_id=1,
        quantite_avant=0.0,
        quantite_apres=100.0,
        user_id=1,
        raison=ANY
    )

@patch('app.services.magasin_service.AuditService.log_stock_modification')
def test_mettre_a_jour_stock_apres_reception_mise_a_jour(mock_audit, mock_db_session):
    """Vérifie la mise à jour d'un stock existant après une réception."""
    # GIVEN: Une réception et un stock existant
    reception = Reception(
        id=1, numero_reception="REC-001", magasin_id=1,
        lignes=[LigneReception(article_id=1, quantite_recue=Decimal("50"), quantite_udb=Decimal("50"))]
    )
    existing_stock = Stock(magasin_id=1, article_id=1, quantite_disponible=Decimal("100"), quantite_udb=Decimal("100"))
    mock_db_session.query.return_value.filter.return_value.first.return_value = existing_stock

    # WHEN
    StockService.mettre_a_jour_stock_apres_reception(mock_db_session, reception, user_id=1)

    # THEN
    # 1. Le stock existant est mis à jour
    assert existing_stock.quantite_disponible == Decimal("150")
    assert existing_stock.quantite_udb == Decimal("150")
    # 2. L'audit est appelé pour la modification
    mock_audit.assert_called_once_with(
        db=mock_db_session,
        action="reception",
        article_id=1,
        magasin_id=1,
        quantite_avant=100.0,
        quantite_apres=150.0,
        user_id=1,
        raison=ANY
    )

@patch('app.services.magasin_service.ConversionService.convertir_vers_udb', return_value=Decimal("20"))
def test_mettre_a_jour_stock_apres_livraison_erreur_stock_insuffisant(mock_conversion, mock_db_session):
    """Vérifie qu'une erreur est levée si le stock est insuffisant pour une livraison."""
    # GIVEN: Une bande de livraison et un stock insuffisant
    bande = BandeLivraison(
        id=1, numero_bande="BL-001", magasin_id=1,
        lignes=[LigneBandeLivraison(article_id=1, quantite=Decimal("50"), unite_mesure=UniteMesure.UDB)]
    )
    existing_stock = Stock(magasin_id=1, article_id=1, quantite_disponible=Decimal("30"), quantite_udb=Decimal("30"))
    mock_db_session.query.return_value.filter.return_value.first.side_effect = [
        existing_stock, # Pour StockService.get_stock
        Article(id=1)   # Pour ArticleService.get_article
    ]

    # WHEN / THEN
    with pytest.raises(InsufficientStockError, match="Stock insuffisant"):
        StockService.mettre_a_jour_stock_apres_livraison(mock_db_session, bande, user_id=1)


# --- Tests pour DeclarationService ---

@patch('app.services.magasin_service.DeclarationService.generate_numero_bl', return_value="BL-2024-0001")
@patch('app.services.magasin_service.ConversionService.convertir_vers_udb', return_value=Decimal("100"))
@patch('app.services.magasin_service.ArticleService.get_article', return_value=Article(id=1))
@patch('app.services.magasin_service.invalidate_cache_pattern')
def test_create_declaration_success(mock_invalidate, mock_get_article, mock_convert, mock_gen_bl, mock_db_session):
    """Vérifie la création réussie d'une déclaration."""
    # GIVEN
    ligne_data = LigneDeclarationCreate(article_id=1, quantite_declaree=Decimal("100"), unite_mesure=UniteMesure.UDB)
    declaration_data = DeclarationCreate(client_id=1, lignes=[ligne_data])

    # WHEN
    result = DeclarationService.create_declaration(mock_db_session, declaration_data, "test_user")

    # THEN
    # 1. Le numéro de BL est généré et assigné
    assert result.numero_bl == "BL-2024-0001"
    # 2. La déclaration et ses lignes sont ajoutées à la session
    assert mock_db_session.add.call_count >= 2 # Au moins la déclaration et une ligne
    # 3. La conversion d'unité est appelée pour la ligne
    mock_convert.assert_called_once()
    # 4. Le cache est invalidé
    mock_invalidate.assert_called_once_with("magasin:declarations:*")

def test_valider_declaration(mock_db_session):
    """Vérifie que le statut d'une déclaration passe à VALIDEE."""
    # GIVEN
    mock_declaration = Declaration(id=1, statut=StatutDeclaration.BROUILLON)
    with patch('app.services.magasin_service.DeclarationService.get_declaration', return_value=mock_declaration):
        # WHEN
        result = DeclarationService.valider_declaration(mock_db_session, 1)

        # THEN
        assert result.statut == StatutDeclaration.VALIDEE
        mock_db_session.commit.assert_called_once()
        mock_db_session.refresh.assert_called_once_with(mock_declaration)


# --- Tests pour ReceptionService ---

@patch('app.services.magasin_service.ReceptionService.generate_numero_reception', return_value="REC-2024-0001")
@patch('app.services.magasin_service.StockService.mettre_a_jour_stock_apres_reception')
@patch('app.services.magasin_service.ConversionService.convertir_vers_udb', return_value=Decimal("95"))
@patch('app.services.magasin_service.ArticleService.get_article', return_value=Article(id=1))
@patch('app.services.magasin_service.invalidate_cache_pattern')
def test_create_reception_success(mock_invalidate, mock_get_article, mock_convert, mock_update_stock, mock_gen_rec, mock_db_session):
    """Vérifie la création d'une réception et l'appel à la mise à jour du stock."""
    # GIVEN
    ligne_data = LigneReceptionCreate(article_id=1, quantite_recue=Decimal("95"), unite_mesure=UniteMesure.UDB)
    reception_data = ReceptionCreate(declaration_id=1, magasin_id=1, lignes=[ligne_data])

    # WHEN
    result = ReceptionService.create_reception(mock_db_session, reception_data, "test_user", user_id=1)

    # THEN
    # 1. Le numéro de réception est généré
    assert result.numero_reception == "REC-2024-0001"
    # 2. La mise à jour du stock est appelée
    mock_update_stock.assert_called_once_with(mock_db_session, result, 1)
    # 3. Le cache est invalidé pour les réceptions et les stocks
    assert mock_invalidate.call_count == 2
    mock_invalidate.assert_any_call("magasin:receptions:*")
    mock_invalidate.assert_any_call("magasin:stocks:*")


# --- Tests pour CommandeService ---

@patch('app.services.magasin_service.gateway_service.creer_commande_facture')
def test_valider_paiement_cree_passerelle_facture(mock_creer_passerelle, mock_db_session):
    """Vérifie que la validation du paiement d'une commande crée une passerelle vers la facturation."""
    # GIVEN
    mock_commande = Commande(
        id=1, client_id=1, numero_commande="CMD-001", date_commande=datetime.now(),
        lignes=[LigneCommande(article_id=1, quantite_demandee=Decimal("10"), prix_unitaire=Decimal("100"))]
    )
    with patch('app.services.magasin_service.CommandeService.get_commande', return_value=mock_commande):
        # WHEN
        result = CommandeService.valider_paiement(mock_db_session, 1, "admin_user")

        # THEN
        # 1. Le statut de la commande est mis à jour
        assert result.paiement_valide is True
        assert result.statut == StatutCommande.PAYEE
        # 2. La passerelle vers la finance est créée
        mock_creer_passerelle.assert_called_once()

@patch('app.services.magasin_service.gateway_service.creer_commande_livraison')
def test_mettre_en_preparation_cree_passerelle_livraison(mock_creer_passerelle, mock_db_session):
    """Vérifie que la mise en préparation d'une commande crée une passerelle vers le transport."""
    # GIVEN
    mock_commande = Commande(
        id=1, client_id=1, numero_commande="CMD-001", paiement_valide=True,
        date_livraison_souhaitee=datetime.now(), cree_par="test_user",
        lignes=[LigneCommande(article_id=1, quantite_demandee=Decimal("10"), unite_mesure=UniteMesure.UDB)]
    )
    # Mock pour la recherche du client
    mock_db_session.query.return_value.filter.return_value.first.return_value = ClientMagasin(adresse="123 Rue Test")

    with patch('app.services.magasin_service.CommandeService.get_commande', return_value=mock_commande):
        # WHEN
        result = CommandeService.mettre_en_preparation(mock_db_session, 1)

        # THEN
        # 1. Le statut de la commande est mis à jour
        assert result.statut == StatutCommande.EN_PREPARATION
        # 2. La passerelle vers le transport est créée
        mock_creer_passerelle.assert_called_once()


# --- Tests pour BandeLivraisonService ---

@patch('app.services.magasin_service.BandeLivraisonService.generate_numero_bande', return_value="BLD-2024-0001")
@patch('app.services.magasin_service.StockService.mettre_a_jour_stock_apres_livraison')
@patch('app.services.magasin_service.invalidate_cache_pattern')
def test_create_bande_livraison_success(mock_invalidate, mock_update_stock, mock_gen_bande, mock_db_session):
    """Vérifie la création d'une bande de livraison et la mise à jour du stock."""
    # GIVEN
    ligne_data = LigneBandeLivraisonCreate(article_id=1, quantite=Decimal("10"), unite_mesure=UniteMesure.UDB)
    bande_data = BandeLivraisonCreate(commande_id=1, magasin_id=1, lignes=[ligne_data])

    # WHEN
    result = BandeLivraisonService.create_bande(mock_db_session, bande_data, "test_user", user_id=1)

    # THEN
    # 1. Le numéro de bande est généré
    assert result.numero_bande == "BLD-2024-0001"
    # 2. La mise à jour du stock est appelée
    mock_update_stock.assert_called_once_with(mock_db_session, result, 1)
    # 3. Le cache est invalidé
    mock_invalidate.assert_called_once_with("magasin:bandes:*")

@patch('app.services.magasin_service.BandeLivraisonService.generate_numero_bande', return_value="BLD-2024-0001")
@patch('app.services.magasin_service.StockService.mettre_a_jour_stock_apres_livraison', side_effect=InsufficientStockError("Stock insuffisant"))
def test_create_bande_livraison_rollback_on_error(mock_update_stock, mock_gen_bande, mock_db_session):
    """Vérifie que la transaction est annulée (rollback) si la mise à jour du stock échoue."""
    # GIVEN
    ligne_data = LigneBandeLivraisonCreate(article_id=1, quantite=Decimal("1000"), unite_mesure=UniteMesure.UDB)
    bande_data = BandeLivraisonCreate(commande_id=1, magasin_id=1, lignes=[ligne_data])

    # WHEN / THEN
    with pytest.raises(BusinessRuleViolationError, match="Erreur lors de la création de la bande de livraison"):
        BandeLivraisonService.create_bande(mock_db_session, bande_data, "test_user", user_id=1)

    # La méthode de rollback de la session doit avoir été appelée
    mock_db_session.rollback.assert_called_once()