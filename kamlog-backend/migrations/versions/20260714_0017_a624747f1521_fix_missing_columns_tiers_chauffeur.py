"""fix_missing_columns_tiers_chauffeur

Revision ID: a624747f1521
Revises: 20260714_fix_missing_cols
Create Date: 2026-07-14 00:17:07.123456

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a624747f1521'
down_revision: Union[str, None] = '20260714_fix_missing_cols'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Tiers missing columns ────────────────────────────────────
    # These columns were supposedly added by a PL/pgSQL block that silently failed
    op.execute("ALTER TABLE tiers ADD COLUMN IF NOT EXISTS sigle_ou_enseigne VARCHAR(50);")
    op.execute("ALTER TABLE tiers ADD COLUMN IF NOT EXISTS adresse_physique TEXT;")
    op.execute("ALTER TABLE tiers ADD COLUMN IF NOT EXISTS autorise_parc_stockage BOOLEAN DEFAULT FALSE;")
    op.execute("ALTER TABLE tiers ADD COLUMN IF NOT EXISTS autorise_manutention BOOLEAN DEFAULT FALSE;")
    op.execute("ALTER TABLE tiers ADD COLUMN IF NOT EXISTS compte_collectif_syscohada VARCHAR(15) DEFAULT '411100';")
    op.execute("ALTER TABLE tiers ADD COLUMN IF NOT EXISTS limite_credit_maximum NUMERIC(15,2) DEFAULT 0.00;")
    op.execute("ALTER TABLE tiers ADD COLUMN IF NOT EXISTS delai_paiement_jours INTEGER DEFAULT 30;")
    op.execute("ALTER TABLE tiers ADD COLUMN IF NOT EXISTS conditions_facturation JSONB DEFAULT '{}'::jsonb;")
    
    # ── Chauffeurs missing columns ───────────────────────────────
    # Adding these just in case they were missed in previous migrations
    op.execute("ALTER TABLE chauffeurs ADD COLUMN IF NOT EXISTS adresse TEXT;")
    op.execute("ALTER TABLE chauffeurs ADD COLUMN IF NOT EXISTS contact_urgence_nom VARCHAR(100);")
    op.execute("ALTER TABLE chauffeurs ADD COLUMN IF NOT EXISTS contact_urgence_telephone VARCHAR(30);")
    op.execute("ALTER TABLE chauffeurs ADD COLUMN IF NOT EXISTS categorie_permis VARCHAR(10);")
    op.execute("ALTER TABLE chauffeurs ADD COLUMN IF NOT EXISTS specialisation VARCHAR(100);")
    op.execute("ALTER TABLE chauffeurs ADD COLUMN IF NOT EXISTS affectation_vehicule_id INTEGER REFERENCES camions_flotte(id);")
    op.execute("ALTER TABLE chauffeurs ADD COLUMN IF NOT EXISTS date_entree DATE;")
    op.execute("ALTER TABLE chauffeurs ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE;")
    op.execute("ALTER TABLE chauffeurs ADD COLUMN IF NOT EXISTS statut VARCHAR(20) DEFAULT 'EN_SERVICE';")


def downgrade() -> None:
    pass
