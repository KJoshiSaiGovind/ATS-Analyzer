"""create skills table

Revision ID: 5e610a00af3d
Revises: a909ea09ca59
Create Date: 2026-06-11 19:59:11.343638

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5e610a00af3d'
down_revision: Union[str, Sequence[str], None] = 'a909ea09ca59'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
    "skills",
    sa.Column("id", sa.Integer(), nullable=False),
    sa.Column("name", sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint("id"),
    sa.UniqueConstraint("name")
)

def downgrade() -> None:
    op.drop_table("skills")
