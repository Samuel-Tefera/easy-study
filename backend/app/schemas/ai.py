import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.ai_interaction import AIActionType


class AIHighlightRequest(BaseModel):
  document_id: uuid.UUID
  selected_text: str
  action: AIActionType


class AIHighlightResponse(BaseModel):
  interaction_id: uuid.UUID
  document_id: uuid.UUID

  input_text: str
  response_text: str
  created_at: datetime
