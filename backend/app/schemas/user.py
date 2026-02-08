import uuid
from pydantic import BaseModel, ConfigDict


class UserOut(BaseModel):
  id: uuid.UUID
  name: str
  email: str

  model_config = ConfigDict(from_attributes=True)
