from pydantic import BaseModel, Field


class SignupRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    school_id: int


class LoginRequest(BaseModel):
    username: str
    password: str


class MeResponse(BaseModel):
    id: int
    username: str
    first_name: str | None
    last_name: str | None
    role: str
    school_id: int | None