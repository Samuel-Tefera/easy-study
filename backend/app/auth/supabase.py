from supabase import create_client, Client
from app.core.config import settings

_supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


def verify_supabase_token(token: str) -> dict:
    try:
        response = _supabase_client.auth.get_user(token)
        user = response.user
        if not user:
            raise ValueError("Token is invalid or user not found")
        return {
            "sub": user.id,
            "email": user.email,
            "user_metadata": user.user_metadata or {},
        }
    except Exception as e:
        raise ValueError(f"Token verification failed: {e}")
