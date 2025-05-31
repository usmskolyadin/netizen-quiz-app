from sqlalchemy import select, update, insert, delete
from db.base import async_session
from db.quizes import Quiz, QuizCategory, QuizResult
from db.users import User
from pydantic import BaseModel, ConfigDict
from typing import List
from db.connection.pydantic import *

async def get_user(tg_id):
    async with async_session() as session:
        user = await session.scalar(select(User).where(User.tg_id == tg_id))
        if user:
            return user
        
        new_user = User(tg_id=tg_id)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user
    
async def get_quizes(user_id):
    async with async_session() as session:
        quizes = await session.scalars(
            select(Quiz)
        )

        serialized_quizes = [
            QuizBase.model_validate(q).models_dump() for q in quizes
        ]