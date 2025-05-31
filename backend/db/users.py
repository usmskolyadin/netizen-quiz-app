from sqlalchemy import BigInteger, ForeignKey, String, Text, Boolean, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime

from db.base import Base


class User(Base):
    __tablename__ = 'users'
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50))
    tg_id = mapped_column(BigInteger)

