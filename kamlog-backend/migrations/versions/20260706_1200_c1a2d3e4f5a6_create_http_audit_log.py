"""Create http_audit_log table

Revision ID: c1a2d3e4f5a6
Revises: 61387c8cd073
Create Date: 2026-07-06 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c1a2d3e4f5a6'
down_revision = '61387c8cd073'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'http_audit_log',
        sa.Column('user_id', sa.String(length=255), nullable=True),
        sa.Column('agency_id', sa.Integer(), nullable=True),
        sa.Column('request_method', sa.String(length=10), nullable=False),
        sa.Column('request_path', sa.String(length=500), nullable=False),
        sa.Column('request_query_params', sa.JSON(), nullable=True),
        sa.Column('request_body_summary', sa.Text(), nullable=True),
        sa.Column('response_status_code', sa.Integer(), nullable=False),
        sa.Column('duration_ms', sa.Integer(), nullable=False),
        sa.Column('ip_address', sa.String(length=50), nullable=True),
        sa.Column('tcode', sa.String(length=20), nullable=True),
        sa.Column('module', sa.String(length=50), nullable=True),
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), server_default='0', nullable=False),
        sa.ForeignKeyConstraint(['agency_id'], ['agencies.id'], name=op.f('fk_http_audit_log_agency_id_agencies')),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_http_audit_log')),
    )
    with op.batch_alter_table('http_audit_log', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_http_audit_log_id'), ['id'], unique=False)
        batch_op.create_index(batch_op.f('ix_http_audit_log_agency_id'), ['agency_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_http_audit_log_request_path'), ['request_path'], unique=False)
        batch_op.create_index(batch_op.f('ix_http_audit_log_created_at'), ['created_at'], unique=False)


def downgrade() -> None:
    with op.batch_alter_table('http_audit_log', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_http_audit_log_created_at'))
        batch_op.drop_index(batch_op.f('ix_http_audit_log_request_path'))
        batch_op.drop_index(batch_op.f('ix_http_audit_log_agency_id'))
        batch_op.drop_index(batch_op.f('ix_http_audit_log_id'))

    op.drop_table('http_audit_log')
