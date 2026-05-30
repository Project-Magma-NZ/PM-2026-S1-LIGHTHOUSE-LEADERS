from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field


class SurveyListItem(BaseModel):
    id: int
    title: str
    audience: str
    version: int
    status: str


class SurveyQuestionOut(BaseModel):
    id: int
    survey_id: int
    question_text: str
    category: str | None = None
    question_type: str
    sort_order: int


class SurveyDetailOut(BaseModel):
    id: int
    title: str
    audience: str
    version: int
    status: str
    questions: list[SurveyQuestionOut]


class AnswerIn(BaseModel):
    question_id: int
    answer: str = Field(min_length=1, max_length=5000)


class SubmitSurveyResponseIn(BaseModel):
    answers: list[AnswerIn]


class SubmitSurveyResponseOut(BaseModel):
    response_id: int
    survey_id: int
    submitted_at: datetime


class ResponseAnswerOut(BaseModel):
    question_id: int
    answer: str


class SurveyResponseOut(BaseModel):
    id: int
    survey_id: int
    user_id: int
    submitted_at: datetime
    answers: list[ResponseAnswerOut]
    

class SurveyListItemWithStatus(SurveyListItem):
    has_submitted: bool
    response_id: int | None = None
    submitted_at: datetime | None = None


QuestionType = Literal["text", "rating"]

class SurveyCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    audience: str = Field(min_length=1, max_length=50)
    version: int = Field(ge=1)
    status: Literal["draft", "active", "archived"] = "draft"

class SurveyUpdateIn(BaseModel):
    title: str | None = None
    audience: str | None = None
    version: int | None = Field(default=None, ge=1)
    status: Literal["draft", "active", "archived"] | None = None

class SurveyQuestionCreateIn(BaseModel):
    question_text: str = Field(min_length=1, max_length=2000)
    category: str = Field(min_length=1, max_length=50)  # expect vision/strategy/... from UI
    question_type: QuestionType
    sort_order: int = Field(ge=1)

class SurveyQuestionsBulkCreateIn(BaseModel):
    questions: list[SurveyQuestionCreateIn] = Field(min_length=1)