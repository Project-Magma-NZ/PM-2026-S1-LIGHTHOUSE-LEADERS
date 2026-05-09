from datetime import datetime
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