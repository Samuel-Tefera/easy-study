from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  DATABASE_URL: str

  SUPABASE_URL: str
  SUPABASE_KEY: str
  SUPABASE_JWT_SECRET: str

  HF_API_URL: str
  HF_API_KEY: str

  LLM_API_URL: str
  LLM_MODEL: str
  LLM_API_KEY: str

  ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:5174"

  model_config = SettingsConfigDict(
      env_file=".env",
      env_file_encoding='utf-8',
      case_sensitive=True
    )

settings = Settings()
