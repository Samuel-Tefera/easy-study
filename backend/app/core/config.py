from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  DATABASE_URL: str

  SUPABASE_URL: str
  SUPABASE_KEY: str

  HF_API_URL: str
  HF_API_KEY: str

  LLM_API_URL: str
  LLM_MODEL: str
  LLM_API_KEY: str

  GOOGLE_CLIENT_ID: str
  GOOGLE_CLIENT_SECRET: str

  JWT_SECRET_KEY: str
  JWT_ALGORITHM: str
  ACCESS_TOKEN_EXPIRE_MINUTES: str

  GOOGLE_TOKEN_URL: str

  FRONTEND_CALLBACK_URL: str

  model_config = SettingsConfigDict(
      env_file=".env",
      env_file_encoding='utf-8',
      case_sensitive=True
    )

settings = Settings()
