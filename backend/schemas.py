from pydantic import BaseModel
from typing import Optional
import datetime

class UserBase(BaseModel):
    login: str
    avatar_url: Optional[str] = None
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True  # Для Pydantic v2

class TransactionBase(BaseModel):
    type: str
    shift: int
    from_currency: Optional[str]
    from_amount: Optional[float]
    to_currency: Optional[str]
    to_amount: Optional[float]
    comment: Optional[str]

class TransactionCreate(TransactionBase):
    pass

class TransactionOut(TransactionBase):
    id: int
    author_id: int
    date: datetime.datetime

    class Config:
        from_attributes = True

class FireMessageBase(BaseModel):
    text: str

class FireMessageCreate(FireMessageBase):
    pass

class FireMessageOut(FireMessageBase):
    id: int
    author_id: int
    date: datetime.datetime

    class Config:
        from_attributes = True