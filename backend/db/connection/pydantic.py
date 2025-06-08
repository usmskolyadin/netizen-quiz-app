from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Базовые схемы
class UserBase(BaseModel):
    username: str = Field(..., max_length=50)
    tg_id: int

class UserCreate(UserBase):
    is_superuser: Optional[bool] = Field(default=False)
    is_active: Optional[bool] = Field(default=False)

class User(UserBase):
    id: int
    results: List['QuizResult'] = []  # Или добавить класы QuizResult при необходимости

    class Config:
        orm_mode = True

class QuizBase(BaseModel):
    title: str = Field(..., max_length=100)
    description: str
    image_url: str = Field(..., max_length=255)
    is_popular: bool = False
    is_new: bool = False
    max_score: int
    collaborator_name: Optional[str] = Field(None, max_length=100)
    collaborator_logo: Optional[str] = Field(None, max_length=255)
    collaborator_link: Optional[str] = Field(None, max_length=255)

class QuizCategoryBase(BaseModel):
    name: str = Field(..., max_length=50)

class QuestionBase(BaseModel):
    text: str
    question_type: str = Field(..., max_length=20)
    presentation_type: str = Field(..., max_length=20) 
    media_url: Optional[str] = Field(None, max_length=255)
    order_number: int
    correct_answers_count: int
    points: int
    explanation: Optional[str] = None

class AnswerBase(BaseModel):
    text: str
    is_correct: bool

class ScoreRatingBase(BaseModel):
    min_score: int
    max_score: int
    title: str = Field(..., max_length=100)
    text: str
    image_url: Optional[str] = Field(None, max_length=255)

# Create-схемы
class UserCreate(UserBase):
    pass

class QuizCategoryCreate(QuizCategoryBase):
    quiz_id: int

class QuizCreate(QuizBase):
    pass  # Categories and score ratings should be added separately

class QuestionCreate(QuestionBase):
    quiz_id: int

class AnswerCreate(AnswerBase):
    question_id: int

class ScoreRatingCreate(ScoreRatingBase):
    quiz_id: int

# Read-схемы
class UserRead(UserBase):
    id: int
    class Config:
        from_attributes = True

class QuizCategoryRead(QuizCategoryBase):
    id: int
    quiz_id: int
    class Config:
        from_attributes = True

class AnswerRead(AnswerBase):
    id: int
    question_id: int
    class Config:
        from_attributes = True

class QuestionRead(QuestionBase):
    id: int
    quiz_id: int
    answers: List[AnswerRead] = []
    class Config:
        from_attributes = True

class ScoreRatingRead(ScoreRatingBase):
    id: int
    quiz_id: int
    class Config:
        from_attributes = True

class QuizRead(QuizBase):
    id: int
    categories: List[QuizCategoryRead] = []
    questions: List[QuestionRead] = []
    score_ratings: List[ScoreRatingRead] = []
    
    class Config:
        from_attributes = True

class QuizResultRead(BaseModel):
    id: int
    quiz_id: int
    user_id: int
    correct_answers: int
    total_questions: int
    score: int
    completed_at: datetime
    class Config:
        from_attributes = True

# Update-схемы
class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, max_length=50)
    tg_id: Optional[int] = None

class QuizCategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)

class QuizUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=255)
    is_popular: Optional[bool] = None
    is_new: Optional[bool] = None
    max_score: Optional[int] = None
    collaborator_name: Optional[str] = Field(None, max_length=100)
    collaborator_logo: Optional[str] = Field(None, max_length=255)
    collaborator_link: Optional[str] = Field(None, max_length=255)

class QuestionUpdate(BaseModel):
    text: Optional[str] = None
    question_type: Optional[str] = Field(None, max_length=20)
    presentation_type: Optional[str] = Field(None, max_length=20)
    media_url: Optional[str] = Field(None, max_length=255)
    order_number: Optional[int] = None
    correct_answers_count: Optional[int] = None
    points: Optional[int] = None
    explanation: Optional[str] = None

class AnswerUpdate(BaseModel):
    text: Optional[str] = None
    is_correct: Optional[bool] = None

class ScoreRatingUpdate(BaseModel):
    min_score: Optional[int] = None
    max_score: Optional[int] = None
    title: Optional[str] = Field(None, max_length=100)
    text: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=255)