from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, func
from db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)

    email = Column(String, unique=True, nullable=True, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)

    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=True)
