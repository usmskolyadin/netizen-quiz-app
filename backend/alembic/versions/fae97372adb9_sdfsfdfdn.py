"""sdfsfdfdn

Revision ID: fae97372adb9
Revises: d678c6bd01a3
Create Date: 2025-06-07 17:16:45.217072

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fae97372adb9'
down_revision: Union[str, None] = 'd678c6bd01a3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
