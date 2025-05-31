from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.connection import postgres as cn
from db.connection.pydantic import *
from routers.router import router

app = FastAPI(
    title="Netizen Quize API",
    description="(скажешь потом че сюда писать, но здесь лучше сделать инструкцию для твоих будущих админят)",
    version="0.0.1",
    root_path="/api/v1",
    root_path_in_servers=False,
    docs_url="/"
)

app.include_router(router)

from webhooks.telegram import router as webhook_router
app.include_router(webhook_router)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)