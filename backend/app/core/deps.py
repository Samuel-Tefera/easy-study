from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.user import User
from app.auth.supabase import verify_supabase_token

bearer_scheme = HTTPBearer(auto_error=True)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = verify_supabase_token(token)

        supabase_id: str = payload.get("sub")
        email: str = payload.get("email")

        if not supabase_id or not email:
            raise credentials_exception

    except ValueError:
        raise credentials_exception

    user = db.query(User).filter(User.supabase_id == supabase_id).first()
    if not user:
        raise credentials_exception

    return user
