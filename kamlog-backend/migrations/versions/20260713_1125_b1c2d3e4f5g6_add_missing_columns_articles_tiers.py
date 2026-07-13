"""Add missing columns to articles and tiers tables

Revision ID: b1c2d3e4f5g6
Revises: a7b8c9d0e1f2
Create Date: 2026-07-13 11:25:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b1c2d3e4f5g6'
down_revision = 'a7b8c9d0e1f2'
branch_labels = None
depends_on = None


def _add_col_if_missing(table, col_name, col_sql):
    """Helper: ADD COLUMN IF NOT EXISTS (PostgreSQL only)."""
    op.execute(f"""
        DO $$
        BEGIN
            ALTER TABLE {table} ADD COLUMN {col_name} {col_sql};
        EXCEPTION WHEN duplicate_column THEN
            NULL;
        END $$;
    """)


def upgrade() -> None:
    # ── articles: add proprietes_dynamiques ──────────────────────
    _add_col_if_missing(
        "articles",
        "proprietes_dynamiques",
        "JSONB DEFAULT '{}'::jsonb"
    )

    # ── tiers: add missing columns from the model ───────────────
    _add_col_if_missing(
        "tiers",
        "registre_commerce",
        "VARCHAR(50)"
    )
    _add_col_if_missing(
        "tiers",
        "regime_fiscal",
        "VARCHAR(100) DEFAULT 'Réel - Grandes Entreprises'"
    )
    _add_col_if_missing(
        "tiers",
        "sigle_ou_enseigne",
        "VARCHAR(50)"
    )
    _add_col_if_missing(
        "tiers",
        "adresse_physique",
        "TEXT"
    )
    _add_col_if_missing(
        "tiers",
        "autorise_parc_stockage",
        "BOOLEAN DEFAULT FALSE"
    )
    _add_col_if_missing(
        "tiers",
        "autorise_manutention",
        "BOOLEAN DEFAULT FALSE"
    )
    _add_col_if_missing(
        "tiers",
        "compte_collectif_syscohada",
        "VARCHAR(15) DEFAULT '411100'"
    )
    _add_col_if_missing(
        "tiers",
        "limite_credit_maximum",
        "NUMERIC(15,2) DEFAULT 0.00"
    )
    _add_col_if_missing(
        "tiers",
        "delai_paiement_jours",
        "INTEGER DEFAULT 30"
    )
    _add_col_if_missing(
        "tiers",
        "conditions_facturation",
        "JSONB DEFAULT '{}'::jsonb"
    )


def downgrade() -> None:
    # Drop columns in reverse order (only the ones this migration added)
    columns_tiers = [
        "conditions_facturation",
        "delai_paiement_jours",
        "limite_credit_maximum",
        "compte_collectif_syscohada",
        "autorise_manutention",
        "autorise_parc_stockage",
        "adresse_physique",
        "sigle_ou_enseigne",
        "regime_fiscal",
        "registre_commerce",
    ]
    for col in columns_tiers:
        op.execute(f"ALTER TABLE tiers DROP COLUMN IF EXISTS {col}")

    op.execute("ALTER TABLE articles DROP COLUMN IF EXISTS proprietes_dynamiques")
