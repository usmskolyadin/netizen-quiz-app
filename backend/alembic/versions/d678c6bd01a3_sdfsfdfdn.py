"""sdfsfdfdn

Revision ID: d678c6bd01a3
Revises: 159ee14d9a65
Create Date: 2025-06-07 17:14:57.639424

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd678c6bd01a3'
down_revision: Union[str, None] = '159ee14d9a65'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
