from pydantic import BaseModel

from app.schemas.user import UserOut

class TokenResponse(BaseModel):
  access_token: str
  token_type: str = "bearer"
  user: UserOut


class GoogleAuthRequest(BaseModel):
    code: str
    redirect_uri: str | None = None
    code_verifier: str | None = None
