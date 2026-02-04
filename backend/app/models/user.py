import uuid

from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base

class User(Base):
  __tablename__ = "users"

  id = Column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
    unique=True,
    nullable=False
  )
  name = Column(String, nullable=False)
  email = Column(String, nullable=False, unique=True)
  created_at = Column(
    DateTime(timezone=True),
    server_default=func.now(),
    nullable=False
  )

  documents = relationship("Document", back_populates="user", cascade="all, delete")
