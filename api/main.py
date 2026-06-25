from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from sqlalchemy.orm import Session
from db import SessionLocal
from models import User
from auth import router as auth_router
from survey import router as survey_router
from management import router as management_router

app = FastAPI(title="Survey API")

origins = ["http://localhost:5173", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(survey_router)
app.include_router(management_router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/users")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

handler = Mangum(app, lifespan="off")  # Use lifespan="off" to disable lifespan events for AWS Lambda