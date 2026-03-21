"""Add ai_interactions table

Revision ID: 6e2d1d2b7c4a
Revises: af24fc97a432
Create Date: 2026-03-20 15:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '6e2d1d2b7c4a'
down_revision: Union[str, Sequence[str], None] = 'af24fc97a432'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Safely create enum types if they don't exist
    op.execute("DO $$ BEGIN CREATE TYPE ai_interaction_type AS ENUM ('highlight', 'question', 'summary', 'quiz'); EXCEPTION WHEN duplicate_object THEN null; END $$;")
    op.execute("DO $$ BEGIN CREATE TYPE ai_action_type AS ENUM ('explain_simple', 'define', 'analogy', 'example', 'expand_acronym'); EXCEPTION WHEN duplicate_object THEN null; END $$;")

    # Add new value 'answer_question' to ai_action_type if it doesn't already exist
    op.execute("ALTER TYPE ai_action_type ADD VALUE IF NOT EXISTS 'answer_question'")

    op.create_table('ai_interactions',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.UUID(), nullable=False),
    sa.Column('document_id', sa.UUID(), nullable=False),
    sa.Column('interaction_type', sa.Enum('highlight', 'question', 'summary', 'quiz', name='ai_interaction_type'), nullable=False),
    sa.Column('action', sa.Enum('explain_simple', 'define', 'analogy', 'example', 'expand_acronym', 'answer_question', name='ai_action_type'), nullable=False),
    sa.Column('input_text', sa.Text(), nullable=False),
    sa.Column('response_text', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id')
    )
    op.create_index(op.f('ix_ai_interactions_document_id'), 'ai_interactions', ['document_id'], unique=False)
    op.create_index(op.f('ix_ai_interactions_user_id'), 'ai_interactions', ['user_id'], unique=False)
    op.create_index('idx_user_document', 'ai_interactions', ['user_id', 'document_id'], unique=False)


def downgrade() -> None:
    op.drop_index('idx_user_document', table_name='ai_interactions')
    op.drop_index(op.f('ix_ai_interactions_user_id'), table_name='ai_interactions')
    op.drop_index(op.f('ix_ai_interactions_document_id'), table_name='ai_interactions')
    op.drop_table('ai_interactions')

    # Drop types
    sa.Enum(name='ai_interaction_type').drop(op.get_bind())
    sa.Enum(name='ai_action_type').drop(op.get_bind())
