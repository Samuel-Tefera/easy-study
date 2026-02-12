import enum
import uuid

from sqlalchemy import Column, ForeignKey, Enum, Index, Text,  DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class AIInteractionType(enum.Enum):
  highlight = "highlight"
  question = "question"
  summary = "summary"
  quiz = "quiz"


class AIActionType(enum.Enum):
  explain_simple = "explain_simple"
  define = "define"
  analogy = "analogy"
  example = "example"
  expand_acronym = "expand_acronym"


class AIInteraction(Base):
  __tablename__ = "ai_interactions"

  id = Column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
    unique=True,
    nullable=False
  )

  user_id = Column(
      UUID(as_uuid=True),
      ForeignKey("users.id", ondelete="CASCADE"),
      nullable=False,
      index=True
    )

  document_id = Column(
      UUID(as_uuid=True),
      ForeignKey("documents.id", ondelete="CASCADE"),
      nullable=False,
      index=True
    )

  interaction_type = Column(
    Enum(AIInteractionType),
    nullable=False
  )

  action = Column(
    Enum(AIActionType),
    nullable=False
  )

  input_text = Column(Text, nullable=False)
  response_text = Column(Text, nullable=False)
  created_at = Column(
    DateTime(timezone=True),
    server_default=func.now(),
    nullable=False
  )

  user = relationship("User", back_populates="ai_interactions")
  document = relationship("Document", back_populates="ai_interactions")


Index("idx_user_document", "user_id", "document_id"),
