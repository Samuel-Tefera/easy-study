from sqlalchemy.orm import Session

from app.auth.supabase import verify_supabase_token
from app.repositories.user_repository import UserRepository


async def supabase_session_login(db: Session, access_token: str) -> dict:
    """
    Validates a Supabase access token, then upserts the user row in our
    database using supabase_id as the stable identity anchor.
    Returns the user info dict — no custom JWT is issued; the Supabase
    token is the session token.
    """
    payload = verify_supabase_token(access_token)

    supabase_id: str = payload.get("sub")
    email: str = payload.get("email")
    name: str = payload.get("user_metadata", {}).get("full_name") or email

    if not supabase_id or not email:
        raise ValueError("Token is missing required claims (sub, email)")

    # Look up by supabase_id first for robustness
    user = UserRepository.get_user_by_supabase_id(db, supabase_id)

    if not user:
        # New sign-in: create the user row
        user = UserRepository.create_user(
            db,
            name=name,
            email=email,
            supabase_id=supabase_id,
        )

    return {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
        }
    }
