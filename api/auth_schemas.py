from pydantic import BaseModel, Field


class SignupRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)
    school_id: int


class LoginRequest(BaseModel):
    username: str
    password: str


class MeResponse(BaseModel):
    id: int
    username: str
    role: str
    school_id: int | None