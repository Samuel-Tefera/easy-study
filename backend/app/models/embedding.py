from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from pgvector.sqlalchemy import Vector

from app.db.database import Base


class Embedding(Base):
  __tablename__ = "embeddings"

  chunk_id = Column(
    UUID(as_uuid=True),
    ForeignKey("chunks.id"),
    primary_key=True
  )
  vector = Column(Vector(384), nullable=False)

  chunk = relationship("Chunk", back_populates="embedding")
