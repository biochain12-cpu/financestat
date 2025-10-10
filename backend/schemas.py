from pydantic import BaseModel
from typing import Optional, Dict, Any
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
    # Добавим автора как объект (если нужно)
    author: Optional[UserOut] = None

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
    author: Optional[UserOut] = None

    class Config:
        from_attributes = True

# Для истории смен (ShiftSnapshot)
class ShiftSnapshotBase(BaseModel):
    shift_number: int
    balances: Dict[str, Any]
    rates: Dict[str, Any]

class ShiftSnapshotCreate(ShiftSnapshotBase):
    pass

class ShiftSnapshotOut(ShiftSnapshotBase):
    id: int
    user_id: int
    datetime: datetime.datetime

    class Config:
        from_attributes = True