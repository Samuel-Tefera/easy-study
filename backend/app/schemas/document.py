import uuid

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentOut(BaseModel):
  id: uuid.UUID
  filename: str
  pages: int
  status: str
  created_at: datetime

  model_config = ConfigDict(from_attributes=True)
