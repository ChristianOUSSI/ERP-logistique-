"""Add agency table and fix models

Revision ID: add_agency_table
Revises: 
Create Date: 2026-06-15 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_agency_table'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create agencies table
    op.create_table('agencies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(length=20), nullable=False),
        sa.Column('nom', sa.String(length=200), nullable=False),
        sa.Column('adresse', sa.String(length=500), nullable=True),
        sa.Column('ville', sa.String(length=100), nullable=True),
        sa.Column('pays', sa.String(length=100), nullable=True),
        sa.Column('telephone', sa.String(length=20), nullable=True),
        sa.Column('email', sa.String(length=100), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('date_creation', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('date_modification', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_agencies_code'), 'agencies', ['code'], unique=True)
    op.create_index(op.f('ix_agencies_id'), 'agencies', ['id'], unique=False)

    # Add agency_id to users table if it doesn't exist
    try:
        op.add_column('users', sa.Column('agency_id', sa.Integer(), nullable=True))
        op.create_foreign_key('fk_users_agency', 'users', 'agencies', ['agency_id'], ['id'])
    except Exception:
        # Column might already exist
        pass

    # Create audit_logs table if it doesn't exist
    try:
        op.create_table('audit_logs',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('user_id', sa.Integer(), nullable=True),
            sa.Column('agency_id', sa.Integer(), nullable=True),
            sa.Column('action', sa.String(length=50), nullable=False),
            sa.Column('table_name', sa.String(length=100), nullable=False),
            sa.Column('record_id', sa.String(length=100), nullable=False),
            sa.Column('old_values', sa.JSON(), nullable=True),
            sa.Column('new_values', sa.JSON(), nullable=True),
            sa.Column('context', sa.JSON(), nullable=True),
            sa.Column('ip_address', sa.String(length=45), nullable=True),
            sa.Column('user_agent', sa.String(length=500), nullable=True),
            sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_audit_logs_id'), 'audit_logs', ['id'], unique=False)
        op.create_index(op.f('ix_audit_logs_table_name'), 'audit_logs', ['table_name'], unique=False)
        op.create_index(op.f('ix_audit_logs_user_id'), 'audit_logs', ['user_id'], unique=False)
    except Exception:
        # Table might already exist
        pass


def downgrade():
    # Remove foreign key and column from users
    try:
        op.drop_constraint('fk_users_agency', 'users', type_='foreignkey')
        op.drop_column('users', 'agency_id')
    except Exception:
        pass

    # Drop tables
    try:
        op.drop_table('audit_logs')
    except Exception:
        pass
    
    try:
        op.drop_table('agencies')
    except Exception:
        pass