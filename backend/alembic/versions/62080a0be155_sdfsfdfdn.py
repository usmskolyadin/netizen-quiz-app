"""sdfsfdfdn

Revision ID: 62080a0be155
Revises: 82b88f72105a
Create Date: 2025-06-07 16:24:24.437719

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '62080a0be155'
down_revision: Union[str, None] = '82b88f72105a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
