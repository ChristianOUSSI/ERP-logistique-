"""Enrich declarations BL + add ordres de transfert

Revision ID: a7b8c9d0e1f2
Revises: d9b3a7c8e6f1
Create Date: 2026-07-08 12:40:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a7b8c9d0e1f2'
down_revision = 'd9b3a7c8e6f1'
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # ── 1. Enrichir la table declarations avec les champs BL maritimes ──
    existing_columns = [col['name'] for col in inspector.get_columns('declarations')]

    new_declaration_columns = [
        # Identification & Traçabilité
        ('numero_bl_externe', sa.String(50), True),
        ('reference_booking', sa.String(50), True),
        ('numero_scelle', sa.String(50), True),
        # Liaison Navire
        ('escale_id', sa.Integer(), True),
        ('nom_navire', sa.String(100), True),
        ('numero_voyage', sa.String(50), True),
        # Parties prenantes
        ('expediteur_shipper', sa.String(200), True),
        ('destinataire_consignee', sa.String(200), True),
        ('notify_party', sa.String(200), True),
        # Logistique & Ports
        ('port_chargement', sa.String(100), True),
        ('port_dechargement', sa.String(100), True),
        ('lieu_livraison', sa.String(200), True),
        ('description_marchandises', sa.String(1000), True),
        # Poids, volumes, conditionnement
        ('poids_brut_kg', sa.Numeric(12, 3), True),
        ('poids_net_kg', sa.Numeric(12, 3), True),
        ('volume_m3', sa.Numeric(10, 3), True),
        ('nombre_colis', sa.Integer(), True),
        ('type_emballage', sa.String(100), True),
        # Données commerciales & douanières
        ('mode_fret', sa.String(10), True),
        ('code_hs', sa.String(10), True),
        ('numero_declaration_douane', sa.String(50), True),
    ]

    for col_name, col_type, nullable in new_declaration_columns:
        if col_name not in existing_columns:
            op.add_column('declarations', sa.Column(col_name, col_type, nullable=nullable))

    # Ajouter la FK vers escales si la colonne vient d'être créée
    if 'escale_id' not in existing_columns:
        try:
            op.create_foreign_key(
                'fk_declarations_escale_id', 'declarations',
                'escales', ['escale_id'], ['id']
            )
        except Exception:
            pass  # La FK peut déjà exister

    # Ajouter un index sur numero_bl_externe
    if 'numero_bl_externe' not in existing_columns:
        try:
            op.create_index('ix_declarations_bl_externe', 'declarations', ['numero_bl_externe'])
        except Exception:
            pass

    # ── 2. Créer la table ordres_transfert ──
    if not inspector.has_table('ordres_transfert'):
        op.create_table('ordres_transfert',
            sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column('numero_ot', sa.String(30), unique=True, nullable=False, index=True),
            sa.Column('declaration_id', sa.Integer(), sa.ForeignKey('declarations.id'), nullable=True),
            sa.Column('magasin_source_id', sa.Integer(), sa.ForeignKey('magasins.id'), nullable=False),
            sa.Column('magasin_dest_id', sa.Integer(), sa.ForeignKey('magasins.id'), nullable=False),
            sa.Column('date_transfert', sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column('date_validation', sa.DateTime(timezone=True), nullable=True),
            sa.Column('date_expedition', sa.DateTime(timezone=True), nullable=True),
            sa.Column('date_reception', sa.DateTime(timezone=True), nullable=True),
            sa.Column('statut', sa.String(20), nullable=False, server_default='BROUILLON', index=True),
            sa.Column('motif', sa.String(500), nullable=True),
            sa.Column('autorise_par', sa.String(100), nullable=True),
            sa.Column('notes', sa.String(500), nullable=True),
            sa.Column('cree_par', sa.String(100), nullable=True),
            sa.Column('date_creation', sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column('date_modification', sa.DateTime(timezone=True), nullable=True),
        )

    # ── 3. Créer la table lignes_ordre_transfert ──
    if not inspector.has_table('lignes_ordre_transfert'):
        op.create_table('lignes_ordre_transfert',
            sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column('ordre_transfert_id', sa.Integer(), sa.ForeignKey('ordres_transfert.id'), nullable=False),
            sa.Column('article_id', sa.Integer(), sa.ForeignKey('articles.id'), nullable=False),
            sa.Column('quantite', sa.Numeric(15, 3), nullable=False),
            sa.Column('unite_mesure', sa.String(10), nullable=False),
            sa.Column('quantite_recue', sa.Numeric(15, 3), server_default='0'),
        )


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # Supprimer les tables OT
    if inspector.has_table('lignes_ordre_transfert'):
        op.drop_table('lignes_ordre_transfert')
    if inspector.has_table('ordres_transfert'):
        op.drop_table('ordres_transfert')

    # Supprimer les colonnes enrichies de declarations
    columns_to_drop = [
        'numero_bl_externe', 'reference_booking', 'numero_scelle',
        'escale_id', 'nom_navire', 'numero_voyage',
        'expediteur_shipper', 'destinataire_consignee', 'notify_party',
        'port_chargement', 'port_dechargement', 'lieu_livraison',
        'description_marchandises', 'poids_brut_kg', 'poids_net_kg',
        'volume_m3', 'nombre_colis', 'type_emballage',
        'mode_fret', 'code_hs', 'numero_declaration_douane',
    ]
    existing_columns = [col['name'] for col in inspector.get_columns('declarations')]
    for col_name in columns_to_drop:
        if col_name in existing_columns:
            op.drop_column('declarations', col_name)
