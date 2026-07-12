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


def _add_col_if_missing(table, col_name, col_sql):
    op.execute(f"""
        DO $$ BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name='{table}' AND column_name='{col_name}'
            ) THEN
                ALTER TABLE {table} ADD COLUMN {col_name} {col_sql};
            END IF;
        END $$;
    """)


def upgrade() -> None:
    # ── 1. Enrichir la table declarations avec les champs BL maritimes ──
    _add_col_if_missing('declarations', 'numero_bl_externe', 'VARCHAR(50)')
    _add_col_if_missing('declarations', 'reference_booking', 'VARCHAR(50)')
    _add_col_if_missing('declarations', 'numero_scelle', 'VARCHAR(50)')
    _add_col_if_missing('declarations', 'escale_id', 'INTEGER')
    _add_col_if_missing('declarations', 'nom_navire', 'VARCHAR(100)')
    _add_col_if_missing('declarations', 'numero_voyage', 'VARCHAR(50)')
    _add_col_if_missing('declarations', 'expediteur_shipper', 'VARCHAR(200)')
    _add_col_if_missing('declarations', 'destinataire_consignee', 'VARCHAR(200)')
    _add_col_if_missing('declarations', 'notify_party', 'VARCHAR(200)')
    _add_col_if_missing('declarations', 'port_chargement', 'VARCHAR(100)')
    _add_col_if_missing('declarations', 'port_dechargement', 'VARCHAR(100)')
    _add_col_if_missing('declarations', 'lieu_livraison', 'VARCHAR(200)')
    _add_col_if_missing('declarations', 'description_marchandises', 'VARCHAR(1000)')
    _add_col_if_missing('declarations', 'poids_brut_kg', 'NUMERIC(12,3)')
    _add_col_if_missing('declarations', 'poids_net_kg', 'NUMERIC(12,3)')
    _add_col_if_missing('declarations', 'volume_m3', 'NUMERIC(10,3)')
    _add_col_if_missing('declarations', 'nombre_colis', 'INTEGER')
    _add_col_if_missing('declarations', 'type_emballage', 'VARCHAR(100)')
    _add_col_if_missing('declarations', 'mode_fret', 'VARCHAR(10)')
    _add_col_if_missing('declarations', 'code_hs', 'VARCHAR(10)')
    _add_col_if_missing('declarations', 'numero_declaration_douane', 'VARCHAR(50)')

    # escale_id est une référence future (table escales pas encore créée) — pas de FK pour l'instant

    # Index numero_bl_externe
    op.execute("""
        CREATE INDEX IF NOT EXISTS ix_declarations_bl_externe
        ON declarations (numero_bl_externe);
    """)

    # ── 2. Créer la table ordres_transfert ──
    op.execute("""
        CREATE TABLE IF NOT EXISTS ordres_transfert (
            id SERIAL PRIMARY KEY,
            numero_ot VARCHAR(30) UNIQUE NOT NULL,
            declaration_id INTEGER REFERENCES declarations(id),
            magasin_source_id INTEGER NOT NULL REFERENCES magasins(id),
            magasin_dest_id INTEGER NOT NULL REFERENCES magasins(id),
            date_transfert TIMESTAMPTZ DEFAULT now(),
            date_validation TIMESTAMPTZ,
            date_expedition TIMESTAMPTZ,
            date_reception TIMESTAMPTZ,
            statut VARCHAR(20) NOT NULL DEFAULT 'BROUILLON',
            motif VARCHAR(500),
            autorise_par VARCHAR(100),
            notes VARCHAR(500),
            cree_par VARCHAR(100),
            date_creation TIMESTAMPTZ DEFAULT now(),
            date_modification TIMESTAMPTZ
        );
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_ordres_transfert_numero_ot ON ordres_transfert (numero_ot);")
    op.execute("CREATE INDEX IF NOT EXISTS ix_ordres_transfert_statut ON ordres_transfert (statut);")

    # ── 3. Créer la table lignes_ordre_transfert ──
    op.execute("""
        CREATE TABLE IF NOT EXISTS lignes_ordre_transfert (
            id SERIAL PRIMARY KEY,
            ordre_transfert_id INTEGER NOT NULL REFERENCES ordres_transfert(id),
            article_id INTEGER NOT NULL REFERENCES articles(id),
            quantite NUMERIC(15,3) NOT NULL,
            unite_mesure VARCHAR(10) NOT NULL,
            quantite_recue NUMERIC(15,3) DEFAULT 0
        );
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS lignes_ordre_transfert;")
    op.execute("DROP TABLE IF EXISTS ordres_transfert;")

    columns_to_drop = [
        'numero_bl_externe', 'reference_booking', 'numero_scelle',
        'escale_id', 'nom_navire', 'numero_voyage',
        'expediteur_shipper', 'destinataire_consignee', 'notify_party',
        'port_chargement', 'port_dechargement', 'lieu_livraison',
        'description_marchandises', 'poids_brut_kg', 'poids_net_kg',
        'volume_m3', 'nombre_colis', 'type_emballage',
        'mode_fret', 'code_hs', 'numero_declaration_douane',
    ]
    for col_name in columns_to_drop:
        op.execute(f"""
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='declarations' AND column_name='{col_name}'
                ) THEN
                    ALTER TABLE declarations DROP COLUMN {col_name};
                END IF;
            END $$;
        """)
