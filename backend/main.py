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

async def get_session():
    async with AsyncSession(engine) as session:
        yield session

admin = CRUDAdmin(
    session=get_session,
    SECRET_KEY="your-secret-key-here",
    initial_admin={
        "username": "admin",
        "password": "secure_password123"
    },
)

async def get_session():
    async with AsyncSession(engine) as session:
        yield session

admin.add_view(
    model=User,
    create_schema=UserCreate,
    update_schema=UserUpdate,
    allowed_actions={"view", "create", "update", "delete"}
)

admin.add_view(
    model=Quiz,
    create_schema=QuizCreate,
    update_schema=QuizUpdate,
    allowed_actions={"view", "create", "update", "delete"}
)

admin.add_view(
    model=Question,
    create_schema=QuestionCreate,
    update_schema=QuestionUpdate,
    allowed_actions={"view", "create", "update", "delete"}
)

admin.add_view(
    model=Answer,
    create_schema=AnswerCreate,
    update_schema=AnswerUpdate,
    allowed_actions={"view", "create", "update", "delete"}
)

admin.add_view(
    model=QuizResult,
    create_schema=QuizResultRead,  # Note: Using Read schema as base since there's no specific Create schema
    update_schema=QuizResultRead,  # Similarly for update
    allowed_actions={"view", "create", "update", "delete"}
)

admin.add_view(
    model=ScoreRating,
    create_schema=ScoreRatingCreate,
    update_schema=ScoreRatingUpdate,
    allowed_actions={"view", "create", "update", "delete"}
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("Initializing admin...")
    await admin.initialize()
    print("Admin initialized successfully")
    yield

app = FastAPI(
    title="Netizen Quize API",
    description="(скажешь потом че сюда писать, но здесь лучше сделать инструкцию для твоих будущих админят)",
    version="0.0.1",
    docs_url="/docs",
    lifespan=lifespan
)

app.include_router(router)
app.mount("/admin", admin.app, name="admin")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
