from sqlalchemy import select, update, insert, delete
from db.base import async_session
from db.quizes import *
from db.users import *
from pydantic import BaseModel, ConfigDict
from typing import List
from db.connection.pydantic import *
from sqlalchemy.orm import selectinload


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


async def get_all_quizes() -> List[QuizRead]:
    async with async_session() as session:
        result = await session.execute(
            select(Quiz).options(
                selectinload(Quiz.categories),
                selectinload(Quiz.questions).selectinload(Question.answers)
            )
        )
        quizes = result.scalars().all()
        return [QuizRead.model_validate(q) for q in quizes]

async def get_quiz(quiz_id: int) -> Optional[QuizRead]:
    async with async_session() as session:
        result = await session.execute(
            select(Quiz)
            .where(Quiz.id == quiz_id)
            .options(
                selectinload(Quiz.categories),
                selectinload(Quiz.questions).selectinload(Question.answers)
            )
        )
        quiz = result.scalar_one_or_none()
        if quiz:
            return QuizRead.model_validate(quiz)
        return None
    
async def create_quiz(quiz_data: QuizCreate) -> QuizRead:
    async with async_session() as session:
        quiz = Quiz(**quiz_data.model_dump())
        session.add(quiz)
        await session.commit()
        await session.refresh(quiz)
        return QuizRead.model_validate(quiz)

async def update_quiz(quiz_id: int, quiz_data: QuizUpdate) -> Optional[QuizRead]:
    async with async_session() as session:
        quiz = await session.get(Quiz, quiz_id)
        if not quiz:
            return None
            
        update_data = quiz_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(quiz, key, value)
            
        await session.commit()
        await session.refresh(quiz)
        return QuizRead.model_validate(quiz)

async def delete_quiz(quiz_id: int) -> bool:
    async with async_session() as session:
        quiz = await session.get(Quiz, quiz_id)
        if not quiz:
            return False
            
        await session.delete(quiz)
        await session.commit()
        return True

async def get_quiz_questions(quiz_id: int) -> List[QuestionRead]:
    async with async_session() as session:
        result = await session.execute(
            select(Question).where(Question.quiz_id == quiz_id)
        )
        questions = result.scalars().all()
        return [QuestionRead.model_validate(q) for q in questions]

async def create_question(quiz_id: int, question_data: QuestionCreate) -> QuestionRead:
    async with async_session() as session:
        question = Question(quiz_id=quiz_id, **question_data.model_dump())
        session.add(question)
        await session.commit()
        await session.refresh(question)
        return QuestionRead.model_validate(question)

async def create_answer(question_id: int, answer_data: AnswerCreate) -> AnswerRead:
    async with async_session() as session:
        answer = Answer(question_id=question_id, **answer_data.model_dump())
        session.add(answer)
        await session.commit()
        await session.refresh(answer)
        return AnswerRead.model_validate(answer)

async def create_quiz_result(quiz_id: int, user_id: int, result_data: dict) -> QuizResultRead:
    async with async_session() as session:
        result = QuizResult(
            quiz_id=quiz_id,
            user_id=user_id,
            **result_data
        )
        session.add(result)
        await session.commit()
        await session.refresh(result)
        return QuizResultRead.model_validate(result)