from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import SessionLocal
from models import User, Survey, SurveyQuestion, SurveyResponse, ResponseAnswer
from auth import get_current_user
from management_schemas import ManagementUserOut, UserSurveyOut

router = APIRouter(prefix="/api/management", tags=["management"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/users", response_model=list[ManagementUserOut])
def list_all_users(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    users = db.query(User).order_by(User.id.asc()).all()

    # Load all survey responses keyed by user_id
    all_responses = db.query(SurveyResponse).all()
    responses_by_user: dict[int, list[SurveyResponse]] = {}
    for r in all_responses:
        responses_by_user.setdefault(r.user_id, []).append(r)

    # Load all numeric answers to compute average scores
    all_answers = db.query(ResponseAnswer).all()
    answers_by_response: dict[int, list[ResponseAnswer]] = {}
    for a in all_answers:
        answers_by_response.setdefault(a.response_id, []).append(a)

    # Load scale-type question IDs
    scale_question_ids = {
        q.id
        for q in db.query(SurveyQuestion).filter(
            SurveyQuestion.question_type.in_(["scale", "likert", "rating"])
        ).all()
    }

    out: list[ManagementUserOut] = []
    for user in users:
        user_responses = responses_by_user.get(user.id, [])
        survey_count = len(user_responses)
        latest_survey_date = (
            max(r.submitted_at for r in user_responses) if user_responses else None
        )

        # Average of all numeric (scale/likert) answers for this user
        numeric_scores: list[float] = []
        for resp in user_responses:
            for ans in answers_by_response.get(resp.id, []):
                if ans.question_id in scale_question_ids:
                    try:
                        numeric_scores.append(float(ans.answer))
                    except (ValueError, TypeError):
                        pass

        average_score = sum(numeric_scores) / len(numeric_scores) if numeric_scores else 0.0

        out.append(
            ManagementUserOut(
                id=user.id,
                username=user.username,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                role=user.role,
                school_id=user.school_id,
                survey_count=survey_count,
                latest_survey_date=latest_survey_date,
                average_score=round(average_score, 2),
            )
        )

    return out


@router.get("/users/{user_id}/surveys", response_model=list[UserSurveyOut])
def get_user_surveys(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    responses = (
        db.query(SurveyResponse)
        .filter(SurveyResponse.user_id == user_id)
        .order_by(SurveyResponse.submitted_at.asc())
        .all()
    )

    if not responses:
        return []

    survey_ids = list({r.survey_id for r in responses})
    surveys_by_id = {
        s.id: s for s in db.query(Survey).filter(Survey.id.in_(survey_ids)).all()
    }

    questions_by_survey: dict[int, list[SurveyQuestion]] = {}
    for q in (
        db.query(SurveyQuestion)
        .filter(SurveyQuestion.survey_id.in_(survey_ids))
        .order_by(SurveyQuestion.sort_order.asc(), SurveyQuestion.id.asc())
        .all()
    ):
        questions_by_survey.setdefault(q.survey_id, []).append(q)

    response_ids = [r.id for r in responses]
    answers_by_response: dict[int, list[ResponseAnswer]] = {}
    for a in db.query(ResponseAnswer).filter(ResponseAnswer.response_id.in_(response_ids)).all():
        answers_by_response.setdefault(a.response_id, []).append(a)

    out: list[UserSurveyOut] = []
    for resp in responses:
        survey = surveys_by_id.get(resp.survey_id)
        if not survey:
            continue

        answer_map: dict[int, str] = {
            a.question_id: a.answer for a in answers_by_response.get(resp.id, [])
        }

        ratings: dict[str, float] = {}
        text_responses: dict[str, str] = {}

        for q in questions_by_survey.get(resp.survey_id, []):
            raw = answer_map.get(q.id, "")
            qt = q.question_type.lower()

            if qt in ("scale", "likert", "rating"):
                try:
                    score = float(raw)
                except (ValueError, TypeError):
                    score = 0.0
                key = (q.category or "").lower() or f"q_{q.id}"
                ratings[key] = score
            else:
                key = q.question_text or q.category or f"q_{q.id}"
                text_responses[key] = raw

        out.append(
            UserSurveyOut(
                response_id=resp.id,
                survey_id=resp.survey_id,
                title=survey.title,
                submitted_at=resp.submitted_at,
                ratings=ratings,
                text_responses=text_responses,
            )
        )

    return out
