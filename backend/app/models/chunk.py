import uuid

from sqlalchemy import Column, ForeignKey, Index, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base

class Chunk(Base):
  __tablename__ = "chunks"

  id = Column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
    unique=True,
    nullable=False
  )
  document_id = Column(
      UUID(as_uuid=True),
      ForeignKey("documents.id"),
      nullable=False
    )
  chunk_index = Column(Integer, nullable=False)
  text = Column(Text, nullable=False)

  document = relationship("Document", back_populates="chunks")
  embedding = relationship("Embedding", back_populates="chunk", uselist=False, cascade="all, delete")

Index("ix_chunks_document_id", Chunk.document_id)
