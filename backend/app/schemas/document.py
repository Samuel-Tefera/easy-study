import uuid

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentOut(BaseModel):
  id: uuid.UUID
  filename: str
  pages: int
  status: str
  summary: str | None = None
  created_at: datetime

  model_config = ConfigDict(from_attributes=True)

class DocumentSummaryOut(BaseModel):
  summary: str
