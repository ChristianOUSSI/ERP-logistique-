"""add_new_models

Revision ID: add_new_models
Revises: add_gateway_tables
Create Date: 2026-06-15

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_new_models'
down_revision = 'add_gateway_tables'
branch_labels = None
depends_on = None


def upgrade():
    # Create enum types for goods_declaration
    statut_declaration_enum = sa.Enum('BROUILLON', 'SOUMISE', 'VALIDEE', 'EN_COURS', 'COMPLETEE', 'ANNULEE', name='statutdeclaration')
    statut_declaration_enum.create(op.get_bind(), checkfirst=True)
    
    # Create enum types for removal_slip
    statut_removal_slip_enum = sa.Enum('EN_ATTENTE', 'AUTORISE', 'EN_TRANSIT', 'LIVRE', 'ANNULE', name='statutremovalslip')
    statut_removal_slip_enum.create(op.get_bind(), checkfirst=True)
    
    # Create enum types for reception_mag3
    statut_reception_mag3_enum = sa.Enum('EN_ATTENTE', 'EN_COURS', 'COMPLETEE', 'ANNULEE', name='statutreceptionmag3')
    statut_reception_mag3_enum.create(op.get_bind(), checkfirst=True)
    
    # Create enum types for suppliers
    statut_fournisseur_enum = sa.Enum('ACTIF', 'INACTIF', 'BLOQUE', name='statutfournisseur')
    categorie_fournisseur_enum = sa.Enum('LOGISTIQUE', 'IMPORT_EXPORT', 'SERVICES', 'MATERIEL', name='categoriefournisseur')
    statut_fournisseur_enum.create(op.get_bind(), checkfirst=True)
    categorie_fournisseur_enum.create(op.get_bind(), checkfirst=True)
    
    # Create goods_declarations table
    op.create_table(
        'goods_declarations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('numero_declaration', sa.String(length=50), nullable=False),
        sa.Column('article_id', sa.Integer(), nullable=False),
        sa.Column('quantite', sa.Integer(), nullable=False),
        sa.Column('unite', sa.String(length=20), nullable=False),
        sa.Column('poids', sa.Float(), nullable=True),
        sa.Column('valeur', sa.Float(), nullable=True),
        sa.Column('devise', sa.String(length=10), nullable=True),
        sa.Column('incoterm', sa.String(length=10), nullable=True),
        sa.Column('port_depart', sa.String(length=100), nullable=True),
        sa.Column('port_arrivee', sa.String(length=100), nullable=True),
        sa.Column('date_declaration', sa.DateTime(), nullable=False),
        sa.Column('statut', statut_declaration_enum, nullable=False),
        sa.Column('declaration_douaniere', sa.String(length=100), nullable=True),
        sa.Column('cree_par', sa.String(length=100), nullable=False),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_goods_declarations_id'), 'goods_declarations', ['id'], unique=False)
    op.create_index(op.f('ix_goods_declarations_numero_declaration'), 'goods_declarations', ['numero_declaration'], unique=True)
    op.create_index(op.f('ix_goods_declarations_article_id'), 'goods_declarations', ['article_id'], unique=False)
    op.create_index(op.f('ix_goods_declarations_statut'), 'goods_declarations', ['statut'], unique=False)
    
    # Create goods_declaration_lines table
    op.create_table(
        'goods_declaration_lines',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('declaration_id', sa.Integer(), nullable=False),
        sa.Column('article_id', sa.Integer(), nullable=False),
        sa.Column('quantite', sa.Integer(), nullable=False),
        sa.Column('unite', sa.String(length=20), nullable=False),
        sa.Column('poids', sa.Float(), nullable=True),
        sa.Column('valeur', sa.Float(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['declaration_id'], ['goods_declarations.id'], ),
        sa.ForeignKeyConstraint(['article_id'], ['articles.id'], )
    )
    op.create_index(op.f('ix_goods_declaration_lines_id'), 'goods_declaration_lines', ['id'], unique=False)
    op.create_index(op.f('ix_goods_declaration_lines_declaration_id'), 'goods_declaration_lines', ['declaration_id'], unique=False)
    
    # Create removal_slips table
    op.create_table(
        'removal_slips',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('numero_bon', sa.String(length=50), nullable=False),
        sa.Column('article_id', sa.Integer(), nullable=False),
        sa.Column('quantite', sa.Integer(), nullable=False),
        sa.Column('unite', sa.String(length=20), nullable=False),
        sa.Column('magasin_source', sa.String(length=100), nullable=False),
        sa.Column('magasin_destination', sa.String(length=100), nullable=False),
        sa.Column('date_bon', sa.DateTime(), nullable=False),
        sa.Column('statut', statut_removal_slip_enum, nullable=False),
        sa.Column('declaration_douaniere', sa.String(length=100), nullable=True),
        sa.Column('demande_par', sa.String(length=100), nullable=False),
        sa.Column('autorise_par', sa.String(length=100), nullable=True),
        sa.Column('date_autorisation', sa.DateTime(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_removal_slips_id'), 'removal_slips', ['id'], unique=False)
    op.create_index(op.f('ix_removal_slips_numero_bon'), 'removal_slips', ['numero_bon'], unique=True)
    op.create_index(op.f('ix_removal_slips_article_id'), 'removal_slips', ['article_id'], unique=False)
    op.create_index(op.f('ix_removal_slips_statut'), 'removal_slips', ['statut'], unique=False)
    op.create_index(op.f('ix_removal_slips_magasin_source'), 'removal_slips', ['magasin_source'], unique=False)
    op.create_index(op.f('ix_removal_slips_magasin_destination'), 'removal_slips', ['magasin_destination'], unique=False)
    
    # Create receptions_mag3 table
    op.create_table(
        'receptions_mag3',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('removal_slip_id', sa.Integer(), nullable=False),
        sa.Column('article_id', sa.Integer(), nullable=False),
        sa.Column('quantite_attendue', sa.Integer(), nullable=False),
        sa.Column('quantite_recue', sa.Integer(), nullable=False),
        sa.Column('unite', sa.String(length=20), nullable=False),
        sa.Column('magasin_source', sa.String(length=100), nullable=True),
        sa.Column('magasin_destination', sa.String(length=100), nullable=False),
        sa.Column('date_reception', sa.DateTime(), nullable=False),
        sa.Column('statut', statut_reception_mag3_enum, nullable=False),
        sa.Column('declaration_douaniere', sa.String(length=100), nullable=True),
        sa.Column('recu_par', sa.String(length=100), nullable=False),
        sa.Column('valide_par', sa.String(length=100), nullable=True),
        sa.Column('date_validation', sa.DateTime(), nullable=True),
        sa.Column('observations', sa.Text(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_receptions_mag3_id'), 'receptions_mag3', ['id'], unique=False)
    op.create_index(op.f('ix_receptions_mag3_removal_slip_id'), 'receptions_mag3', ['removal_slip_id'], unique=False)
    op.create_index(op.f('ix_receptions_mag3_article_id'), 'receptions_mag3', ['article_id'], unique=False)
    op.create_index(op.f('ix_receptions_mag3_statut'), 'receptions_mag3', ['statut'], unique=False)
    op.create_index(op.f('ix_receptions_mag3_date_reception'), 'receptions_mag3', ['date_reception'], unique=False)
    
    # Create suppliers table
    op.create_table(
        'suppliers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code_fournisseur', sa.String(length=20), nullable=False),
        sa.Column('raison_sociale', sa.String(length=200), nullable=False),
        sa.Column('niu', sa.String(length=20), nullable=True),
        sa.Column('adresse', sa.Text(), nullable=True),
        sa.Column('ville', sa.String(length=100), nullable=True),
        sa.Column('pays', sa.String(length=100), nullable=True),
        sa.Column('telephone', sa.String(length=20), nullable=True),
        sa.Column('email', sa.String(length=100), nullable=True),
        sa.Column('site_web', sa.String(length=200), nullable=True),
        sa.Column('statut', statut_fournisseur_enum, nullable=False),
        sa.Column('categorie', categorie_fournisseur_enum, nullable=False),
        sa.Column('limite_credit_xaf', sa.Integer(), nullable=True),
        sa.Column('solde_credit_xaf', sa.Integer(), nullable=True),
        sa.Column('cree_par', sa.String(length=100), nullable=False),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_suppliers_id'), 'suppliers', ['id'], unique=False)
    op.create_index(op.f('ix_suppliers_code_fournisseur'), 'suppliers', ['code_fournisseur'], unique=True)
    op.create_index(op.f('ix_suppliers_niu'), 'suppliers', ['niu'], unique=True)
    op.create_index(op.f('ix_suppliers_statut'), 'suppliers', ['statut'], unique=False)
    op.create_index(op.f('ix_suppliers_categorie'), 'suppliers', ['categorie'], unique=False)
    
    # Create supplier_profiles table
    op.create_table(
        'supplier_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('supplier_id', sa.Integer(), nullable=False),
        sa.Column('contact_principal', sa.String(length=100), nullable=True),
        sa.Column('telephone_contact', sa.String(length=20), nullable=True),
        sa.Column('email_contact', sa.String(length=100), nullable=True),
        sa.Column('conditions_paiement', sa.Text(), nullable=True),
        sa.Column('delai_paiement_jours', sa.Integer(), nullable=True),
        sa.Column('remise_pourcentage', sa.Float(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('actif', sa.Boolean(), nullable=True),
        sa.Column('date_creation', sa.DateTime(), nullable=False),
        sa.Column('date_modification', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], )
    )
    op.create_index(op.f('ix_supplier_profiles_id'), 'supplier_profiles', ['id'], unique=False)
    op.create_index(op.f('ix_supplier_profiles_supplier_id'), 'supplier_profiles', ['supplier_id'], unique=False)


def downgrade():
    # Drop tables in reverse order
    op.drop_index(op.f('ix_supplier_profiles_supplier_id'), table_name='supplier_profiles')
    op.drop_index(op.f('ix_supplier_profiles_id'), table_name='supplier_profiles')
    op.drop_table('supplier_profiles')
    
    op.drop_index(op.f('ix_suppliers_categorie'), table_name='suppliers')
    op.drop_index(op.f('ix_suppliers_statut'), table_name='suppliers')
    op.drop_index(op.f('ix_suppliers_niu'), table_name='suppliers')
    op.drop_index(op.f('ix_suppliers_code_fournisseur'), table_name='suppliers')
    op.drop_index(op.f('ix_suppliers_id'), table_name='suppliers')
    op.drop_table('suppliers')
    
    op.drop_index(op.f('ix_receptions_mag3_date_reception'), table_name='receptions_mag3')
    op.drop_index(op.f('ix_receptions_mag3_statut'), table_name='receptions_mag3')
    op.drop_index(op.f('ix_receptions_mag3_article_id'), table_name='receptions_mag3')
    op.drop_index(op.f('ix_receptions_mag3_removal_slip_id'), table_name='receptions_mag3')
    op.drop_index(op.f('ix_receptions_mag3_id'), table_name='receptions_mag3')
    op.drop_table('receptions_mag3')
    
    op.drop_index(op.f('ix_removal_slips_magasin_destination'), table_name='removal_slips')
    op.drop_index(op.f('ix_removal_slips_magasin_source'), table_name='removal_slips')
    op.drop_index(op.f('ix_removal_slips_statut'), table_name='removal_slips')
    op.drop_index(op.f('ix_removal_slips_article_id'), table_name='removal_slips')
    op.drop_index(op.f('ix_removal_slips_numero_bon'), table_name='removal_slips')
    op.drop_index(op.f('ix_removal_slips_id'), table_name='removal_slips')
    op.drop_table('removal_slips')
    
    op.drop_index(op.f('ix_goods_declaration_lines_declaration_id'), table_name='goods_declaration_lines')
    op.drop_index(op.f('ix_goods_declaration_lines_id'), table_name='goods_declaration_lines')
    op.drop_table('goods_declaration_lines')
    
    op.drop_index(op.f('ix_goods_declarations_statut'), table_name='goods_declarations')
    op.drop_index(op.f('ix_goods_declarations_article_id'), table_name='goods_declarations')
    op.drop_index(op.f('ix_goods_declarations_numero_declaration'), table_name='goods_declarations')
    op.drop_index(op.f('ix_goods_declarations_id'), table_name='goods_declarations')
    op.drop_table('goods_declarations')
    
    # Drop enum types
    sa.Enum(name='categoriefournisseur').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='statutfournisseur').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='statutreceptionmag3').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='statutremovalslip').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='statutdeclaration').drop(op.get_bind(), checkfirst=True)
