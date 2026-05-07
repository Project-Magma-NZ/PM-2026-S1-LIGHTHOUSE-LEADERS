from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db import SessionLocal
from models import Survey, SurveyQuestion, SurveyResponse, ResponseAnswer
from auth import get_current_user
from survey_schemas import (
    SurveyListItem,
    SurveyDetailOut,
    SurveyQuestionOut,
    SubmitSurveyResponseIn,
    SubmitSurveyResponseOut,
    SurveyResponseOut,
    ResponseAnswerOut,
)

router = APIRouter(prefix="/api/surveys", tags=["surveys"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[SurveyListItem])
def list_surveys(db: Session = Depends(get_db)):
    surveys = db.query(Survey).order_by(Survey.id.desc()).all()
    return [
        SurveyListItem(
            id=s.id,
            title=s.title,
            audience=s.audience,
            version=s.version,
            status=s.status,
        )
        for s in surveys
    ]


@router.get("/{survey_id}", response_model=SurveyDetailOut)
def get_survey(survey_id: int, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    questions = (
        db.query(SurveyQuestion)
        .filter(SurveyQuestion.survey_id == survey_id)
        .order_by(SurveyQuestion.sort_order.asc(), SurveyQuestion.id.asc())
        .all()
    )

    return SurveyDetailOut(
        id=survey.id,
        title=survey.title,
        audience=survey.audience,
        version=survey.version,
        status=survey.status,
        questions=[
            SurveyQuestionOut(
                id=q.id,
                survey_id=q.survey_id,
                question_text=q.question_text,
                category=q.category,
                question_type=q.question_type,
                sort_order=q.sort_order,
            )
            for q in questions
        ],
    )


@router.post("/{survey_id}/responses", response_model=SubmitSurveyResponseOut, status_code=201)
def submit_survey_response(
    survey_id: int,
    body: SubmitSurveyResponseIn,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    # Optional: block submission if archived/draft etc.
    if survey.status != "active":
        raise HTTPException(status_code=400, detail="Survey is not active")

    # Prevent duplicates (MVP rule: 1 response per user per survey)
    existing = (
        db.query(SurveyResponse)
        .filter(SurveyResponse.survey_id == survey_id, SurveyResponse.user_id == current_user.id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Survey already submitted")

    # Validate question IDs belong to this survey
    question_ids = [a.question_id for a in body.answers]
    if len(question_ids) != len(set(question_ids)):
        raise HTTPException(status_code=400, detail="Duplicate question_id in answers")

    valid_questions = (
        db.query(SurveyQuestion.id)
        .filter(SurveyQuestion.survey_id == survey_id, SurveyQuestion.id.in_(question_ids))
        .all()
    )
    valid_ids = {row[0] for row in valid_questions}
    missing = [qid for qid in question_ids if qid not in valid_ids]
    if missing:
        raise HTTPException(status_code=400, detail=f"Invalid question_id(s): {missing}")

    response = SurveyResponse(survey_id=survey_id, user_id=current_user.id)
    db.add(response)
    db.flush()  # ensures response.id is available

    for a in body.answers:
        db.add(ResponseAnswer(response_id=response.id, question_id=a.question_id, answer=a.answer))

    db.commit()
    db.refresh(response)

    return SubmitSurveyResponseOut(
        response_id=response.id,
        survey_id=response.survey_id,
        submitted_at=response.submitted_at,
    )


@router.get("/{survey_id}/my-response", response_model=SurveyResponseOut)
def get_my_response_for_survey(
    survey_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resp = (
        db.query(SurveyResponse)
        .filter(SurveyResponse.survey_id == survey_id, SurveyResponse.user_id == current_user.id)
        .first()
    )
    if not resp:
        raise HTTPException(status_code=404, detail="No response found for this survey")

    answers = db.query(ResponseAnswer).filter(ResponseAnswer.response_id == resp.id).all()

    return SurveyResponseOut(
        id=resp.id,
        survey_id=resp.survey_id,
        user_id=resp.user_id,
        submitted_at=resp.submitted_at,
        answers=[ResponseAnswerOut(question_id=a.question_id, answer=a.answer) for a in answers],
    )