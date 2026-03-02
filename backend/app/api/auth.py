from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.auth_service import supabase_session_login
from app.schemas.auth import TokenResponse, SupabaseSessionRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/session", response_model=TokenResponse)
async def login_with_supabase_session(
    body: SupabaseSessionRequest,
    db: Session = Depends(get_db),
):
    try:
        return await supabase_session_login(db, access_token=body.access_token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
