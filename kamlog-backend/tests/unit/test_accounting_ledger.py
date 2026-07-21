# tests/unit/test_accounting_ledger.py — Tests unitaires pour le moteur comptable partie double
import pytest
from decimal import Decimal
from datetime import date
from app.models.accounting_ledger import ChartOfAccounts, AccountingJournal, AccountType, JournalType
from app.services.accounting_service import AccountingService
from app.exceptions import CustomHTTPException


def test_accounting_double_entry_balance(db_session):
    """Test qu'une écriture équilibrée Débit == Crédit est créée correctement."""
    # Setup plan comptable
    acc_client = ChartOfAccounts(code="411100", label="Client DUPONT", account_type=AccountType.ASSET, syscohada_class=4)
    acc_vente = ChartOfAccounts(code="701100", label="Ventes Marchandises", account_type=AccountType.REVENUE, syscohada_class=7)
    journal_vt = AccountingJournal(code="VT", label="Journal des Ventes", journal_type=JournalType.VENTES)

    db_session.add_all([acc_client, acc_vente, journal_vt])
    db_session.commit()

    # Création écriture équilibrée (100,000 XAF)
    lines = [
        {"account_code": "411100", "debit": 100000, "credit": 0},
        {"account_code": "701100", "debit": 0, "credit": 100000}
    ]

    entry = AccountingService.create_journal_entry(
        db=db_session,
        journal_code="VT",
        description="Facture F-2026-001 Client DUPONT",
        lines_data=lines,
        entry_date=date.today()
    )

    assert entry.entry_number.startswith("VT-")
    assert len(entry.lines) == 2
    assert entry.status.value == "DRAFT"


def test_unbalanced_journal_entry_rejection(db_session):
    """Test qu'une écriture déséquilibrée Débit != Crédit est immédiatement rejetée."""
    acc_client = ChartOfAccounts(code="411200", label="Client MARTIN", account_type=AccountType.ASSET, syscohada_class=4)
    acc_vente = ChartOfAccounts(code="701200", label="Ventes Services", account_type=AccountType.REVENUE, syscohada_class=7)
    journal_vt = AccountingJournal(code="VT2", label="Journal Ventes 2", journal_type=JournalType.VENTES)

    db_session.add_all([acc_client, acc_vente, journal_vt])
    db_session.commit()

    # Lignes déséquilibrées (100,000 vs 50,000)
    lines = [
        {"account_code": "411200", "debit": 100000, "credit": 0},
        {"account_code": "701200", "debit": 0, "credit": 50000}
    ]

    with pytest.raises(CustomHTTPException) as exc_info:
        AccountingService.create_journal_entry(
            db=db_session,
            journal_code="VT2",
            description="Écriture erronée",
            lines_data=lines
        )

    assert "déséquilibrée" in str(exc_info.value.detail)
