from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, func
from db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)

    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)

    email = Column(String, unique=True, nullable=True, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)

    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=True)


# Survey
# id, title, audience, version, status

class Survey(Base):
    __tablename__ = "surveys"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    audience = Column(String, nullable=False)  # e.g. "students", "teachers"
    version = Column(Integer, nullable=False, default=1)
    status = Column(String, nullable=False, default="active")  # e.g. "draft", "active", "archived"

# Survey Questions
# id, survey_id, question_text, category, question_type, sort_order
class SurveyQuestion(Base):
    __tablename__ = "survey_questions"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)
    question_text = Column(String, nullable=False)
    category = Column(String, nullable=True)  # e.g. which of the 7 pillars
    question_type = Column(String, nullable=False)  # e.g. "likert", "multiple_choice"
    sort_order = Column(Integer, nullable=False, default=0)

# Survey Responses
# id, survey_id, user_id, submitted_at
class SurveyResponse(Base):
    __tablename__ = "survey_responses"
    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

# Response Answers
# response_id, question_id, answer   PRIMARY KEY (response_id, question_id)
class ResponseAnswer(Base):
    __tablename__ = "response_answers"
    response_id = Column(Integer, ForeignKey("survey_responses.id"), primary_key=True)
    question_id = Column(Integer, ForeignKey("survey_questions.id"), primary_key=True)
    answer = Column(String, nullable=False)
