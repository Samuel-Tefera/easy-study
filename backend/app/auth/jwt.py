from datetime import datetime, timedelta

from jose import jwt

from app.core.config import settings

def create_access_token(data: dict) -> str:
  to_encode = data.copy()
  expire_time = datetime.utcnow() + timedelta(minutes=int(settings.ACCESS_TOKEN_EXPIRE_MINUTES))

  to_encode.update({"exp": expire_time})

  return jwt.encode(
      to_encode,
      settings.JWT_SECRET_KEY,
      algorithm=settings.JWT_ALGORITHM
    )
