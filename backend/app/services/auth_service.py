from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.auth.google import exchange_code_for_tokens, verify_google_id_token
from app.auth.jwt import create_access_token


async def google_login(
    db: Session,
    code: str,
    code_verifier: str | None = None,
  ):
  tokens = await exchange_code_for_tokens(code, code_verifier)
  google_id_token = tokens.get("id_token")

  if not google_id_token:
    raise ValueError("No id_token returned from Google")

  user_info = verify_google_id_token(google_id_token)

  email = user_info["email"]
  name = user_info.get("name", "Google User")

  user = UserRepository.get_user_by_email(db, email)

  if not user:
    user = UserRepository.create_user(db, name=name, email=email)

  access_token = create_access_token({
    "sub": str(user.id),
    "email": user.email
  })

  return {
    "access_token": access_token,
    "token_type": "bearer",
    "user": {
      "id": str(user.id),
      "email": user.email,
      "name": user.name,
    }
  }
