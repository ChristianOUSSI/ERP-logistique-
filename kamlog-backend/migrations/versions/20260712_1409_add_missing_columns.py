"""Add missing columns: proprietes_dynamiques (camions_flotte, articles, missions) and registre_commerce, regime_fiscal (tiers)

Revision ID: 20260712_add_missing_cols
Revises: a7b8c9d0e1f2
Create Date: 2026-07-12 14:09:00.000000

This migration adds columns that are defined in SQLAlchemy models but were missing from the database schema.
This was causing UndefinedColumn errors during seed data execution.

Columns added:
- articles.proprietes_dynamiques (JSONB)
- camions_flotte.proprietes_dynamiques (JSONB) [if not exists]
- tiers.registre_commerce (VARCHAR)
- tiers.regime_fiscal (VARCHAR)
- missions_transport.proprietes_dynamiques (JSONB) [if not exists]
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260712_add_missing_cols'
down_revision = 'a7b8c9d0e1f2'
branch_labels = None
depends_on = None


def _add_col_if_missing(table: str, col_name: str, col_type: str, nullable: bool = True, default=None, comment: str = None):
    """Helper to safely add column only if it doesn't exist"""
    nullable_clause = 'NULL' if nullable else 'NOT NULL'
    default_clause = f'DEFAULT {default}' if default is not None else ''
    
    op.execute(f"""
        DO $$ BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name='{table}' AND column_name='{col_name}'
            ) THEN
                ALTER TABLE {table} ADD COLUMN {col_name} {col_type} {nullable_clause} {default_clause};
            END IF;
        END $$;
    """)


def upgrade() -> None:
    # ── Add proprietes_dynamiques to articles ──
    _add_col_if_missing(
        table='articles',
        col_name='proprietes_dynamiques',
        col_type='JSONB',
        nullable=True,
        default="'{}'::jsonb",
        comment='Variables libres dynamiques (Température, HS Code...)'
    )

    # ── Add proprietes_dynamiques to camions_flotte (if not already added) ──
    _add_col_if_missing(
        table='camions_flotte',
        col_name='proprietes_dynamiques',
        col_type='JSONB',
        nullable=True,
        default="'{}'::jsonb",
        comment='Variables libres dynamiques (Assurance, Numéro Pneu...)'
    )

    # ── Add registre_commerce to tiers ──
    _add_col_if_missing(
        table='tiers',
        col_name='registre_commerce',
        col_type='VARCHAR(50)',
        nullable=True,
        comment='Registre de commerce'
    )

    # ── Add regime_fiscal to tiers ──
    _add_col_if_missing(
        table='tiers',
        col_name='regime_fiscal',
        col_type='VARCHAR(100)',
        nullable=True,
        default="'Réel - Grandes Entreprises'",
        comment='Régime fiscal'
    )

    # ── Add proprietes_dynamiques to missions_transport (if table exists) ──
    _add_col_if_missing(
        table='missions_transport',
        col_name='proprietes_dynamiques',
        col_type='JSONB',
        nullable=True,
        default="'{}'::jsonb",
        comment='Variables libres dynamiques du trajet'
    )


def downgrade() -> None:
    # Drop all added columns
    columns_to_drop = [
        ('articles', 'proprietes_dynamiques'),
        ('camions_flotte', 'proprietes_dynamiques'),
        ('tiers', 'registre_commerce'),
        ('tiers', 'regime_fiscal'),
        ('missions_transport', 'proprietes_dynamiques'),
    ]
    
    for table, col_name in columns_to_drop:
        op.execute(f"""
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='{table}' AND column_name='{col_name}'
                ) THEN
                    ALTER TABLE {table} DROP COLUMN {col_name};
                END IF;
            END $$;
        """)

