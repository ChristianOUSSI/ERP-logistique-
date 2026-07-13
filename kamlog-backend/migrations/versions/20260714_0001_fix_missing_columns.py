"""Fix missing columns: articles.proprietes_dynamiques, tiers.regime_fiscal

Revision ID: 20260714_fix_missing_cols
Revises: 20260713_tiers_remaining
Create Date: 2026-07-14 00:01:00.000000

The previous migration (20260712_add_missing_cols) used a PL/pgSQL
IF NOT EXISTS wrapper that silently failed.  This migration uses
PostgreSQL-native ADD COLUMN IF NOT EXISTS (PG 9.6+) which is both
simpler and more reliable.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260714_fix_missing_cols'
down_revision = '20260713_tiers_remaining'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── articles.proprietes_dynamiques ────────────────────────────
    op.execute("""
        ALTER TABLE articles
        ADD COLUMN IF NOT EXISTS proprietes_dynamiques JSONB NULL DEFAULT '{}'::jsonb;
    """)

    # ── tiers.regime_fiscal ──────────────────────────────────────
    op.execute("""
        ALTER TABLE tiers
        ADD COLUMN IF NOT EXISTS regime_fiscal VARCHAR(100) NULL DEFAULT 'Réel - Grandes Entreprises';
    """)

    # ── tiers.registre_commerce (also reported missing in previous runs) ─
    op.execute("""
        ALTER TABLE tiers
        ADD COLUMN IF NOT EXISTS registre_commerce VARCHAR(50) NULL;
    """)

    # ── camions_flotte.proprietes_dynamiques (safety net) ────────
    op.execute("""
        ALTER TABLE camions_flotte
        ADD COLUMN IF NOT EXISTS proprietes_dynamiques JSONB NULL DEFAULT '{}'::jsonb;
    """)

    # ── missions_transport.proprietes_dynamiques (safety net) ────
    op.execute("""
        ALTER TABLE missions_transport
        ADD COLUMN IF NOT EXISTS proprietes_dynamiques JSONB NULL DEFAULT '{}'::jsonb;
    """)


def downgrade() -> None:
    # These are idempotent drops – safe to run even if cols don't exist
    for table, col in [
        ("missions_transport", "proprietes_dynamiques"),
        ("camions_flotte", "proprietes_dynamiques"),
        ("tiers", "registre_commerce"),
        ("tiers", "regime_fiscal"),
        ("articles", "proprietes_dynamiques"),
    ]:
        op.execute(f"ALTER TABLE {table} DROP COLUMN IF EXISTS {col}")
