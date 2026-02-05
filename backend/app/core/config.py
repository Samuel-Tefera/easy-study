from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  DATABASE_URL: str
  SUPABASE_URL: str
  SUPABASE_KEY: str

  model_config = SettingsConfigDict(
      env_file=".env",
      env_file_encoding='utf-8',
      case_sensitive=True
    )

settings = Settings()
