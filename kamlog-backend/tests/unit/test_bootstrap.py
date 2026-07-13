from app.utils.bootstrap import get_missing_required_tables


def test_get_missing_required_tables_reports_missing_core_tables():
    existing_tables = {"agencies", "users"}

    missing = get_missing_required_tables(existing_tables)

    assert missing == ["roles", "permissions"]


def test_get_missing_required_tables_returns_empty_when_all_required_tables_exist():
    existing_tables = {"agencies", "users", "roles", "permissions"}

    missing = get_missing_required_tables(existing_tables)

    assert missing == []
