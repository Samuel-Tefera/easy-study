import httpx

from google.oauth2 import id_token
from google.auth.transport import requests

from app.core.config import settings


async def exchange_code_for_tokens(
    code: str,
    code_verifier: str | None = None
  ):
  data = {
    "code": code,
    "client_id": settings.GOOGLE_CLIENT_ID,
    "client_secret": settings.GOOGLE_CLIENT_SECRET,
    "redirect_uri": settings.FRONTEND_CALLBACK_URL,
    "grant_type": "authorization_code",
  }

  if code_verifier:
    data["code_verifier"] = code_verifier

  async with httpx.AsyncClient() as client:
    response = await client.post(
      settings.GOOGLE_TOKEN_URL,
      data=data
    )
  if response.status_code != 200:
    raise ValueError("Failed to exchange code with Google")

  return response.json()

def verify_google_id_token(id_token_str: str):
  try:
    decoded_token = id_token.verify_oauth2_token(
      id_token_str,
      requests.Request(),
      settings.GOOGLE_CLIENT_ID,
    )
    return decoded_token
  except Exception:
    raise ValueError("Invalid Google ID token")
