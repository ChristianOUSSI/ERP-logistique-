import importlib.util
from pathlib import Path


def test_add_gateway_tables_uses_idempotent_postgresql_enum_types():
    migration_path = Path(__file__).resolve().parents[1] / ".." / "migrations" / "versions" / "add_gateway_tables.py"
    spec = importlib.util.spec_from_file_location("add_gateway_tables", migration_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)

    source = migration_path.read_text(encoding="utf-8")
    assert "from sqlalchemy.dialects import postgresql" in source
    assert "postgresql.ENUM(" in source
    assert "create_type=False" in source
    assert "typepasserelle" in source
    assert "statutpasserelle" in source
