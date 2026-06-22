"""add_gateway_tables

Revision ID: add_gateway_tables
Revises: 
Create Date: 2026-06-07

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_gateway_tables'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create enum types
    type_passerelle_enum = sa.Enum('COMMANDE_FACTURE', 'COMMANDE_LIVRAISON', 'RECEPTION_STOCK', 'FACTURE_PAIEMENT', 'MISSION_FACTURE', 'BON_LIVRAISON_FACTURE', name='typepasserelle')
    statut_passerelle_enum = sa.Enum('EN_ATTENTE', 'TRAITE', 'ECHOUE', 'ANNULE', name='statutpasserelle')
    
    type_passerelle_enum.create(op.get_bind(), checkfirst=True)
    statut_passerelle_enum.create(op.get_bind(), checkfirst=True)
    
    # Create passerelles table
    op.create_table(
        'passerelles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('type_passerelle', type_passerelle_enum, nullable=False),
        sa.Column('source_module', sa.String(length=50), nullable=False),
        sa.Column('source_id', sa.Integer(), nullable=False),
        sa.Column('cible_module', sa.String(length=50), nullable=False),
        sa.Column('cible_id', sa.Integer(), nullable=True),
        sa.Column('statut', statut_passerelle_enum, nullable=True),
        sa.Column('donnees', postgresql.JSON(), nullable=True),
        sa.Column('message_erreur', sa.Text(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_traitement', sa.DateTime(), nullable=True),
        sa.Column('traite_par', sa.String(length=100), nullable=True),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_passerelles_id'), 'passerelles', ['id'], unique=False)
    op.create_index(op.f('ix_passerelles_type_passerelle'), 'passerelles', ['type_passerelle'], unique=False)
    op.create_index(op.f('ix_passerelles_source_module'), 'passerelles', ['source_module'], unique=False)
    op.create_index(op.f('ix_passerelles_source_id'), 'passerelles', ['source_id'], unique=False)
    op.create_index(op.f('ix_passerelles_cible_module'), 'passerelles', ['cible_module'], unique=False)
    op.create_index(op.f('ix_passerelles_cible_id'), 'passerelles', ['cible_id'], unique=False)
    op.create_index(op.f('ix_passerelles_statut'), 'passerelles', ['statut'], unique=False)
    
    # Create commande_factures table
    op.create_table(
        'commande_factures',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('commande_id', sa.Integer(), nullable=False),
        sa.Column('facture_id', sa.Integer(), nullable=True),
        sa.Column('passerelle_id', sa.Integer(), nullable=False),
        sa.Column('montant_commande', sa.Integer(), nullable=False),
        sa.Column('montant_facture', sa.Integer(), nullable=True),
        sa.Column('tva', sa.Integer(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_facturation', sa.DateTime(), nullable=True),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['commande_id'], ['commandes.id'], ),
        sa.ForeignKeyConstraint(['facture_id'], ['factures.id'], ),
        sa.ForeignKeyConstraint(['passerelle_id'], ['passerelles.id'], )
    )
    op.create_index(op.f('ix_commande_factures_id'), 'commande_factures', ['id'], unique=False)
    
    # Create commande_livraisons table
    op.create_table(
        'commande_livraisons',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('commande_id', sa.Integer(), nullable=False),
        sa.Column('livraison_id', sa.Integer(), nullable=True),
        sa.Column('passerelle_id', sa.Integer(), nullable=False),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_livraison', sa.DateTime(), nullable=True),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['commande_id'], ['commandes.id'], ),
        sa.ForeignKeyConstraint(['livraison_id'], ['bandes_livraison.id'], ),
        sa.ForeignKeyConstraint(['passerelle_id'], ['passerelles.id'], )
    )
    op.create_index(op.f('ix_commande_livraisons_id'), 'commande_livraisons', ['id'], unique=False)
    
    # Create reception_stocks table
    op.create_table(
        'reception_stocks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('reception_id', sa.Integer(), nullable=False),
        sa.Column('stock_id', sa.Integer(), nullable=True),
        sa.Column('passerelle_id', sa.Integer(), nullable=False),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_maj_stock', sa.DateTime(), nullable=True),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['reception_id'], ['receptions.id'], ),
        sa.ForeignKeyConstraint(['stock_id'], ['stocks.id'], ),
        sa.ForeignKeyConstraint(['passerelle_id'], ['passerelles.id'], )
    )
    op.create_index(op.f('ix_reception_stocks_id'), 'reception_stocks', ['id'], unique=False)
    
    # Create facture_paiements table
    op.create_table(
        'facture_paiements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('facture_id', sa.Integer(), nullable=False),
        sa.Column('paiement_id', sa.Integer(), nullable=True),
        sa.Column('passerelle_id', sa.Integer(), nullable=False),
        sa.Column('montant_facture', sa.Integer(), nullable=False),
        sa.Column('montant_paye', sa.Integer(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_paiement', sa.DateTime(), nullable=True),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['facture_id'], ['factures.id'], ),
        sa.ForeignKeyConstraint(['passerelle_id'], ['passerelles.id'], )
    )
    op.create_index(op.f('ix_facture_paiements_id'), 'facture_paiements', ['id'], unique=False)
    
    # Create mission_factures table
    op.create_table(
        'mission_factures',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('mission_id', sa.Integer(), nullable=False),
        sa.Column('facture_id', sa.Integer(), nullable=True),
        sa.Column('passerelle_id', sa.Integer(), nullable=False),
        sa.Column('distance_km', sa.Integer(), nullable=False),
        sa.Column('tarif_km', sa.Integer(), nullable=False),
        sa.Column('montant_total', sa.Integer(), nullable=False),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_facturation', sa.DateTime(), nullable=True),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['mission_id'], ['missions.id'], ),
        sa.ForeignKeyConstraint(['facture_id'], ['factures.id'], ),
        sa.ForeignKeyConstraint(['passerelle_id'], ['passerelles.id'], )
    )
    op.create_index(op.f('ix_mission_factures_id'), 'mission_factures', ['id'], unique=False)


def downgrade():
    # Drop tables in reverse order
    op.drop_index(op.f('ix_mission_factures_id'), table_name='mission_factures')
    op.drop_table('mission_factures')
    
    op.drop_index(op.f('ix_facture_paiements_id'), table_name='facture_paiements')
    op.drop_table('facture_paiements')
    
    op.drop_index(op.f('ix_reception_stocks_id'), table_name='reception_stocks')
    op.drop_table('reception_stocks')
    
    op.drop_index(op.f('ix_commande_livraisons_id'), table_name='commande_livraisons')
    op.drop_table('commande_livraisons')
    
    op.drop_index(op.f('ix_commande_factures_id'), table_name='commande_factures')
    op.drop_table('commande_factures')
    
    op.drop_index(op.f('ix_passerelles_statut'), table_name='passerelles')
    op.drop_index(op.f('ix_passerelles_cible_id'), table_name='passerelles')
    op.drop_index(op.f('ix_passerelles_cible_module'), table_name='passerelles')
    op.drop_index(op.f('ix_passerelles_source_id'), table_name='passerelles')
    op.drop_index(op.f('ix_passerelles_source_module'), table_name='passerelles')
    op.drop_index(op.f('ix_passerelles_type_passerelle'), table_name='passerelles')
    op.drop_index(op.f('ix_passerelles_id'), table_name='passerelles')
    op.drop_table('passerelles')
    
    # Drop enum types
    sa.Enum(name='statutpasserelle').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='typepasserelle').drop(op.get_bind(), checkfirst=True)
