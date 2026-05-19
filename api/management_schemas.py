from datetime import datetime
from pydantic import BaseModel


class ManagementUserOut(BaseModel):
    id: int
    username: str
    first_name: str | None
    last_name: str | None
    email: str | None
    role: str
    school_id: int | None
    survey_count: int
    latest_survey_date: datetime | None
    average_score: float


class UserSurveyOut(BaseModel):
    response_id: int
    survey_id: int
    title: str
    submitted_at: datetime
    ratings: dict[str, float]
    text_responses: dict[str, str]
