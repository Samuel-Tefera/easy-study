from pydantic import BaseModel
from app.schemas.user import UserOut


class SupabaseSessionRequest(BaseModel):
    """Request body for POST /auth/session"""
    access_token: str


class TokenResponse(BaseModel):
    """Response returned after a successful session login"""
    user: UserOut
