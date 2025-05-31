from fastapi import APIRouter, HTTPException, status
from typing import List
from db.connection import postgres as cn
from db.connection.postgres import *

router = APIRouter(prefix="/tma", tags=["Quiz & Users"])

@router.get("/users/{tg_id}", response_model=UserRead)
async def get_user(tg_id: int):
    user = await cn.get_user(tg_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get("/quizes/", response_model=List[QuizRead])
async def list_quizes():
    return await cn.get_all_quizes()

@router.get("/quizes/{quiz_id}", response_model=QuizRead)
async def get_quiz(quiz_id: int):
    quiz = await cn.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    return quiz

@router.post("/quizes/", response_model=QuizRead, status_code=status.HTTP_201_CREATED)
async def create_quiz(quiz_data: QuizCreate):
    return await cn.create_quiz(quiz_data)

@router.put("/quizes/{quiz_id}", response_model=QuizRead)
async def update_quiz(quiz_id: int, quiz_data: QuizUpdate):
    updated_quiz = await cn.update_quiz(quiz_id, quiz_data)
    if not updated_quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    return updated_quiz

@router.delete("/quizes/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_quiz(quiz_id: int):
    success = await cn.delete_quiz(quiz_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )

@router.get("/quizes/{quiz_id}/questions", response_model=List[QuestionRead])
async def list_questions(quiz_id: int):
    return await cn.get_quiz_questions(quiz_id)

@router.post("/quizes/{quiz_id}/questions", response_model=QuestionRead, status_code=status.HTTP_201_CREATED)
async def create_question(quiz_id: int, question_data: QuestionCreate):
    return await cn.create_question(quiz_id, question_data)

@router.post("/questions/{question_id}/answers", response_model=AnswerRead, status_code=status.HTTP_201_CREATED)
async def create_answer(question_id: int, answer_data: AnswerCreate):
    return await cn.create_answer(question_id, answer_data)

@router.post("/quizes/{quiz_id}/results", response_model=QuizResultRead, status_code=status.HTTP_201_CREATED)
async def create_result(quiz_id: int, user_id: int, result_data: dict):
    return await cn.create_quiz_result(quiz_id, user_id, result_data)