"""Add remaining missing columns to tiers table

Revision ID: 20260713_tiers_remaining
Revises: 20260712_add_missing_cols
Create Date: 2026-07-13 11:25:00.000000

Adds columns present in the Tiers SQLAlchemy model but not yet in the
database or in the previous migration (20260712_add_missing_cols).
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260713_tiers_remaining'
down_revision = '20260712_add_missing_cols'
branch_labels = None
depends_on = None


def _add_col_if_missing(table, col_name, col_sql):
    """ADD COLUMN with duplicate_column guard (PostgreSQL)."""
    op.execute(f"""
        DO $$
        BEGIN
            ALTER TABLE {table} ADD COLUMN {col_name} {col_sql};
        EXCEPTION WHEN duplicate_column THEN
            NULL;
        END $$;
    """)


def upgrade() -> None:
    _add_col_if_missing("tiers", "sigle_ou_enseigne", "VARCHAR(50)")
    _add_col_if_missing("tiers", "adresse_physique", "TEXT")
    _add_col_if_missing("tiers", "autorise_parc_stockage", "BOOLEAN DEFAULT FALSE")
    _add_col_if_missing("tiers", "autorise_manutention", "BOOLEAN DEFAULT FALSE")
    _add_col_if_missing("tiers", "compte_collectif_syscohada", "VARCHAR(15) DEFAULT '411100'")
    _add_col_if_missing("tiers", "limite_credit_maximum", "NUMERIC(15,2) DEFAULT 0.00")
    _add_col_if_missing("tiers", "delai_paiement_jours", "INTEGER DEFAULT 30")
    _add_col_if_missing("tiers", "conditions_facturation", "JSONB DEFAULT '{}'::jsonb")


def downgrade() -> None:
    cols = [
        "conditions_facturation",
        "delai_paiement_jours",
        "limite_credit_maximum",
        "compte_collectif_syscohada",
        "autorise_manutention",
        "autorise_parc_stockage",
        "adresse_physique",
        "sigle_ou_enseigne",
    ]
    for col in cols:
        op.execute(f"ALTER TABLE tiers DROP COLUMN IF EXISTS {col}")
