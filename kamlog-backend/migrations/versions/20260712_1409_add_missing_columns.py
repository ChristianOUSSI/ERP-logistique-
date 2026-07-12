"""Add missing columns: proprietes_dynamiques (camions_flotte) and registre_commerce (tiers)

Revision ID: 20260712_add_missing_cols
Revises: a7b8c9d0e1f2
Create Date: 2026-07-12 14:09:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260712_add_missing_cols'
down_revision = 'a7b8c9d0e1f2'
branch_labels = None
depends_on = None


def _add_col_if_missing(table: str, col_name: str, col_type: str, nullable: bool = True, default=None, comment: str = None):
    """Helper to add column only if it doesn't exist"""
    op.execute(f"""
        DO $$ BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name='{table}' AND column_name='{col_name}'
            ) THEN
                ALTER TABLE {table} ADD COLUMN {col_name} {col_type}
                {'NULL' if nullable else 'NOT NULL'} 
                {'DEFAULT ' + str(default) if default is not None else ''};
            END IF;
        END $$;
    """)


def upgrade() -> None:
    # ── Add proprietes_dynamiques to camions_flotte ──
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


def downgrade() -> None:
    # Drop the added columns
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name='camions_flotte' AND column_name='proprietes_dynamiques'
            ) THEN
                ALTER TABLE camions_flotte DROP COLUMN proprietes_dynamiques;
            END IF;
        END $$;
    """)

    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name='tiers' AND column_name='registre_commerce'
            ) THEN
                ALTER TABLE tiers DROP COLUMN registre_commerce;
            END IF;
        END $$;
    """)

