from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.connection import postgres as cn
from db.connection.pydantic import *
from db.quizes import *
from db.users import *
from routers.router import router
from fastapi.staticfiles import StaticFiles
import os
from crudadmin import CRUDAdmin
from db.base import async_session, engine
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager


app = FastAPI(
    title="Netizen Quize API",
    description="(скажешь потом че сюда писать, но здесь лучше сделать инструкцию для твоих будущих админят)",
    version="0.0.1",
    root_path="/tma", 
    docs_url="/docs",
)

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
