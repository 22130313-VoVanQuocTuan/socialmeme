"""merge heads

Revision ID: 3f6922145c24
Revises: b31fe69aac45, c1f3a8b2d9e0
Create Date: 2026-05-21 14:36:46.238076

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3f6922145c24'
down_revision: Union[str, None] = ('b31fe69aac45', 'c1f3a8b2d9e0')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
