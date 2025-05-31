from sqlalchemy import ForeignKey, String, Text, Boolean, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime

from db.base import Base


class Quiz(Base):
    __tablename__ = 'quizzes'
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text())
    image_url: Mapped[str] = mapped_column(String(255))
    is_popular: Mapped[bool] = mapped_column(Boolean(), default=False)
    is_new: Mapped[bool] = mapped_column(Boolean(), default=False)
    max_score: Mapped[int] = mapped_column(Integer())
    collaborator_name: Mapped[Optional[str]] = mapped_column(String(100))
    collaborator_logo: Mapped[Optional[str]] = mapped_column(String(255))
    collaborator_link: Mapped[Optional[str]] = mapped_column(String(255))
    
    categories: Mapped[List['QuizCategory']] = relationship(back_populates='quiz')
    questions: Mapped[List['Question']] = relationship(back_populates='quiz')
    results: Mapped[List['QuizResult']] = relationship(back_populates='quiz')

class QuizCategory(Base):
    __tablename__ = 'quiz_categories'
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey('quizzes.id'))
    name: Mapped[str] = mapped_column(String(50))
    
    quiz: Mapped['Quiz'] = relationship(back_populates='categories')

class Question(Base):
    __tablename__ = 'questions'
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey('quizzes.id'))
    text: Mapped[str] = mapped_column(Text())
    question_type: Mapped[str] = mapped_column(String(20))  # 'question' или 'story'
    presentation_type: Mapped[str] = mapped_column(String(20))  # 'text', 'video/text' и т.д.
    media_url: Mapped[Optional[str]] = mapped_column(String(255))
    order_number: Mapped[int] = mapped_column(Integer())
    correct_answers_count: Mapped[int] = mapped_column(Integer())
    points: Mapped[int] = mapped_column(Integer())
    explanation: Mapped[Optional[str]] = mapped_column(Text())
    
    quiz: Mapped['Quiz'] = relationship(back_populates='questions')
    answers: Mapped[List['Answer']] = relationship(back_populates='question')

class Answer(Base):
    __tablename__ = 'answers'
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    question_id: Mapped[int] = mapped_column(ForeignKey('questions.id'))
    text: Mapped[str] = mapped_column(Text())
    is_correct: Mapped[bool] = mapped_column(Boolean())
    
    question: Mapped['Question'] = relationship(back_populates='answers')

class QuizResult(Base):
    __tablename__ = 'quiz_results'
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey('quizzes.id'))
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    correct_answers: Mapped[int] = mapped_column(Integer())
    total_questions: Mapped[int] = mapped_column(Integer())
    score: Mapped[int] = mapped_column(Integer())
    completed_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    quiz: Mapped['Quiz'] = relationship(back_populates='results')
    user: Mapped['User'] = relationship()

class ScoreRating(Base):
    __tablename__ = 'score_ratings'
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey('quizzes.id'))
    min_score: Mapped[int] = mapped_column(Integer())
    max_score: Mapped[int] = mapped_column(Integer())
    title: Mapped[str] = mapped_column(String(100))
    text: Mapped[str] = mapped_column(Text())
    image_url: Mapped[Optional[str]] = mapped_column(String(255))
    
    quiz: Mapped['Quiz'] = relationship()