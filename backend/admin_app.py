# admin_app.py
from fastapi import FastAPI
from crudadmin import CRUDAdmin
from db.base import engine, Base
from contextlib import asynccontextmanager
from db.connection.pydantic import *
from sqlalchemy.ext.asyncio import AsyncSession
from db.quizes import *
from db.users import *

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
    print("Initializing admin...")
    await admin.initialize()
    print("Admin initialized successfully")
    yield

admin_app = FastAPI(lifespan=lifespan)

admin_app.mount("/", admin.app, name="admin")