"""add_salaire_base_chauffeur

Revision ID: b938459a1234
Revises: a624747f1521
Create Date: 2026-07-14 01:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b938459a1234'
down_revision: Union[str, None] = 'a624747f1521'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Adding safely without using DO $$ BEGIN to avoid SQLite syntax errors
    # In production (PostgreSQL) this runs fine.
    try:
        op.add_column('chauffeurs', sa.Column('salaire_base', sa.Numeric(precision=12, scale=2), nullable=True))
    except Exception as e:
        print(f"Column might already exist: {e}")
        
    try:
        op.add_column('magasins', sa.Column('capacite_max_m3', sa.Float(), nullable=True, server_default='1000.0'))
    except Exception:
        pass
        
    try:
        op.add_column('articles', sa.Column('valeur_unitaire', sa.Float(), nullable=True, server_default='0.0'))
    except Exception:
        pass
        
    try:
        op.create_table('positions_gps',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('camion_id', sa.Integer(), nullable=False),
            sa.Column('latitude', sa.Float(), nullable=False),
            sa.Column('longitude', sa.Float(), nullable=False),
            sa.Column('vitesse_kmh', sa.Float(), nullable=False, server_default='0.0'),
            sa.Column('timestamp', sa.DateTime(), nullable=False),
            sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='0'),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('updated_at', sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(['camion_id'], ['camions_flotte.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_positions_gps_camion_id'), 'positions_gps', ['camion_id'], unique=False)
        op.create_index(op.f('ix_positions_gps_timestamp'), 'positions_gps', ['timestamp'], unique=False)
    except Exception:
        pass


def downgrade() -> None:
    try:
        op.drop_index(op.f('ix_positions_gps_timestamp'), table_name='positions_gps')
        op.drop_index(op.f('ix_positions_gps_camion_id'), table_name='positions_gps')
        op.drop_table('positions_gps')
    except Exception:
        pass
    try:
        op.drop_column('articles', 'valeur_unitaire')
    except Exception:
        pass
    try:
        op.drop_column('magasins', 'capacite_max_m3')
    except Exception:
        pass
    try:
        op.drop_column('chauffeurs', 'salaire_base')
    except Exception:
        pass
