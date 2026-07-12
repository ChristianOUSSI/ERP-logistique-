"""Add purchase tables

Revision ID: d9b3a7c8e6f1
Revises: c1a2d3e4f5a6
Create Date: 2026-07-07 14:05:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd9b3a7c8e6f1'
down_revision = 'c1a2d3e4f5a6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('fiches_besoin',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('matricule', sa.String(length=50), nullable=False),
        sa.Column('titre', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('demandeur_id', sa.Integer(), nullable=False),
        sa.Column('agence_id', sa.Integer(), nullable=False),
        sa.Column('statut', sa.String(length=50), nullable=False),
        sa.Column('priorite', sa.String(length=20), nullable=False),
        sa.Column('montant_estime', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('devise', sa.String(length=3), nullable=False),
        sa.Column('date_soumission', sa.DateTime(timezone=True), nullable=True),
        sa.Column('date_approbation', sa.DateTime(timezone=True), nullable=True),
        sa.Column('date_besoin', sa.DateTime(timezone=True), nullable=True),
        sa.Column('approbateur_id', sa.Integer(), nullable=True),
        sa.Column('notes_approbation', sa.Text(), nullable=True),
        sa.Column('commande_fournisseur_id', sa.Integer(), nullable=True),
        sa.Column('cree_par', sa.String(length=255), nullable=False),
        sa.Column('modifie_par', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), server_default='0', nullable=False),
        sa.ForeignKeyConstraint(['agence_id'], ['agencies.id'], ),
        sa.ForeignKeyConstraint(['approbateur_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['demandeur_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_fiches_besoin_matricule'), 'fiches_besoin', ['matricule'], unique=True)
    op.create_index(op.f('ix_fiches_besoin_statut'), 'fiches_besoin', ['statut'], unique=False)

    op.create_table('lignes_fiches_besoin',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('fiche_besoin_id', sa.Integer(), nullable=False),
        sa.Column('code_article', sa.String(length=50), nullable=True),
        sa.Column('designation', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('quantite_demandee', sa.Integer(), nullable=False),
        sa.Column('unite', sa.String(length=20), nullable=True),
        sa.Column('prix_unitaire_estime', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('montant_total_estime', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('specifications', sa.Text(), nullable=True),
        sa.Column('reference_fabricant', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), server_default='0', nullable=False),
        sa.ForeignKeyConstraint(['fiche_besoin_id'], ['fiches_besoin.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('lignes_fiches_besoin')
    op.drop_index(op.f('ix_fiches_besoin_statut'), table_name='fiches_besoin')
    op.drop_index(op.f('ix_fiches_besoin_matricule'), table_name='fiches_besoin')
    op.drop_table('fiches_besoin')
