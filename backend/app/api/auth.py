from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.auth_service import google_login
from app.schemas.auth import TokenResponse
from app.schemas.auth import GoogleAuthRequest

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/google", response_model=TokenResponse)
async def login_with_google(
    body: GoogleAuthRequest,
    db: Session = Depends(get_db)
  ):
  try:
    result = await google_login(
      db,
      code=body.code,
      code_verifier=body.code_verifier,
      redirect_uri=body.redirect_uri or "postmessage",
    )
    return result
  except Exception as e:
    raise HTTPException(status_code=400, detail=str(e))
