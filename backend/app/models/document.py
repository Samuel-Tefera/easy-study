import uuid

import enum

from sqlalchemy import Column, ForeignKey, Index, Integer, String,  DateTime, Enum, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class DocumentStatus(enum.Enum):
    processing = "processing"
    ready = "ready"
    failed = "failed"

class Document(Base):
  __tablename__ = "documents"

  id = Column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
    unique=True,
    nullable=False
  )
  user_id = Column(
    UUID(as_uuid=True),
    ForeignKey("users.id"),
    nullable=False
   )
  filename = Column(String, nullable=False)
  file_url = Column(String, nullable=False)
  pages = Column(Integer, nullable=True)
  created_at = Column(
    DateTime(timezone=True),
    server_default=func.now(),
    nullable=False
  )

  status = Column(
    Enum(DocumentStatus),
    default=DocumentStatus.processing,
    nullable=False
  )

  user = relationship("User", back_populates="documents")
  chunks = relationship("Chunk", back_populates="document", cascade="all, delete")
  ai_interactions = relationship("AIInteraction", back_populates="document", cascade="all, delete-orphan")


Index("ix_documents_user_id", Document.user_id)
