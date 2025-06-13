from sqlalchemy import BigInteger, ForeignKey, String, Text, Boolean, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime
from fastadmin import register, SqlAlchemyModelAdmin
from db.base import Base
from sqlalchemy import select, update
import uuid
import bcrypt
import typing as tp


class User(Base):
    __tablename__ = 'users'
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    tg_id = mapped_column(BigInteger)
    total_score: Mapped[int] = mapped_column(Integer, default=0)
    
    results: Mapped[List['QuizResult']] = relationship(back_populates='user')