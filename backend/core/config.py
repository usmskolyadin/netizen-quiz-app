from pydantic import Field
from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    telegram_api_key: str = Field(default="", alias="TELEGRAM_API_KEY")
    
    db_host: str = Field(default="localhost", alias="DB_HOST")
    db_port: int = Field(default=5432, alias="DB_PORT")
    db_name: str = Field(default="postgres", alias="DB_NAME")
    db_user: str = Field(default="postgres", alias="DB_USER")
    db_pass: str = Field(default="postgres", alias="DB_PASS")
    
    echo: bool = Field(default=False, alias="DB_ECHO")

    @property
    def db_url(self):
        return f"postgresql+asyncpg://{self.db_user}:{self.db_pass}@{self.db_host}:{self.db_port}/{self.db_name}"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()