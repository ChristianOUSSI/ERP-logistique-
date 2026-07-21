"""merge heads

Revision ID: fe8383ba3889
Revises: b1c2d3e4f5g6, add_module_based_permissions_to_roles
Create Date: 2026-07-19 23:27:58.584678

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fe8383ba3889'
down_revision = ('b1c2d3e4f5g6', 'add_module_based_permissions_to_roles')
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
