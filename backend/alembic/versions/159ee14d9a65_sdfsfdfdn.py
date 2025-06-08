"""sdfsfdfdn

Revision ID: 159ee14d9a65
Revises: 62080a0be155
Create Date: 2025-06-07 16:39:12.310313

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '159ee14d9a65'
down_revision: Union[str, None] = '62080a0be155'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
