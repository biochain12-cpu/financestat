from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    role = Column(String, default="user")  # "user" или "admin"

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)  # exchange, adjustment, expense
    shift = Column(Integer, nullable=False)
    from_currency = Column(String, nullable=True)
    from_amount = Column(Float, nullable=True)
    to_currency = Column(String, nullable=True)
    to_amount = Column(Float, nullable=True)
    comment = Column(String, nullable=True)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User")
    date = Column(DateTime, default=datetime.datetime.utcnow)

class FireMessage(Base):
    __tablename__ = "fire_messages"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User")
    date = Column(DateTime, default=datetime.datetime.utcnow)

class ShiftSnapshot(Base):
    __tablename__ = "shift_snapshots"
    id = Column(Integer, primary_key=True, index=True)
    shift_number = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    datetime = Column(DateTime, default=datetime.datetime.utcnow)
    balances = Column(JSON, nullable=False)
    rates = Column(JSON, nullable=False)