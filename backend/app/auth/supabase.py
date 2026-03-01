import jwt as pyjwt
from app.core.config import settings


def verify_supabase_token(token: str) -> dict:
    """
    Validates a Supabase-issued JWT using the project JWT secret.
    Returns the decoded payload on success.
    Raises ValueError if the token is invalid or expired.
    """
    try:
        payload = pyjwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except pyjwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except pyjwt.InvalidTokenError as e:
        raise ValueError(f"Invalid token: {e}")
