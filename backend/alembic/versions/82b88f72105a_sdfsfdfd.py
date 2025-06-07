"""sdfsfdfd

Revision ID: 82b88f72105a
Revises: 2f7c5d80d846
Create Date: 2025-06-07 14:32:15.558748

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '82b88f72105a'
down_revision: Union[str, None] = '2f7c5d80d846'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
