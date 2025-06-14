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
    quizes = await cn.get_all_quizes()
    return [QuizRead.model_validate(quiz) for quiz in quizes]

@router.get("/quizes/{quiz_id}", response_model=QuizRead)
async def get_quiz(quiz_id: int):
    quiz = await cn.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    return QuizRead.model_validate(quiz)

@router.post("/quizes/", response_model=QuizRead, status_code=status.HTTP_201_CREATED)
async def create_quiz(quiz_data: QuizCreate):
    quiz = await cn.create_quiz(quiz_data)
    
    full_quiz = await cn.get_quiz(quiz.id)
    
    if not full_quiz:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve created quiz"
        )
    
    categories = [
        QuizCategoryRead(
            id=category.id,
            quiz_id=category.quiz_id,
            name=category.name
        )
        for category in full_quiz.categories
    ]
    
    return QuizRead(
        id=full_quiz.id,
        title=full_quiz.title,
        description=full_quiz.description,
        image_url=full_quiz.image_url,
        is_popular=full_quiz.is_popular,
        is_new=full_quiz.is_new,
        max_score=full_quiz.max_score,
        collaborator_name=full_quiz.collaborator_name,
        collaborator_logo=full_quiz.collaborator_logo,
        collaborator_link=full_quiz.collaborator_link,
        categories=categories,
        questions=[]
    )

@router.put("/quizes/{quiz_id}", response_model=QuizRead)
async def update_quiz(quiz_id: int, quiz_data: QuizUpdate):
    updated_quiz = await cn.update_quiz(quiz_id, quiz_data)
    if not updated_quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    return QuizRead.model_validate(updated_quiz)

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
    questions = await cn.get_quiz_questions(quiz_id)
    return [QuestionRead.model_validate(q) for q in questions]

@router.post("/quizes/{quiz_id}/questions", response_model=QuestionRead, status_code=status.HTTP_201_CREATED)
async def create_question(quiz_id: int, question_data: QuestionCreate):
    question = await cn.create_question(quiz_id, question_data)
    return QuestionRead.model_validate(question)

@router.post("/questions/{question_id}/answers", response_model=AnswerRead, status_code=status.HTTP_201_CREATED)
async def create_answer(question_id: int, answer_data: AnswerCreate):
    answer = await cn.create_answer(question_id, answer_data)
    return AnswerRead.model_validate(answer)

@router.post("/quizes/{quiz_id}/results", response_model=QuizResultRead, status_code=status.HTTP_201_CREATED)
async def create_result(quiz_id: int, user_id: int, result_data: dict):
    result = await cn.create_quiz_result(quiz_id, user_id, result_data)
    
    user = await cn.get_user(user_id)
    if user:
        total_score = sum(r.score for r in user.results)
        await cn.update_user(user_id, {"total_score": total_score})
    
    return QuizResultRead.model_validate(result)

@router.get("/users/{user_id}/results")
async def get_user_results(user_id: int):
    user = await cn.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return [
        {"quiz_id": result.quiz_id, "score": result.score}
        for result in user.results
    ]