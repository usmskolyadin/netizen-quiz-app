from pydantic import BaseSettings

class Settings(BaseSettings):
    TELEGRAM_TOKEN: str
    WEBHOOK_URL: str

settings = Settings()