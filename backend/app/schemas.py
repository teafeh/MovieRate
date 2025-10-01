from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

# --- Movie schemas ---
class MovieBase(BaseModel):
    title: str
    genre: str
    release_year: int
    description: Optional[str] = None


class MovieCreate(MovieBase):
    pass


class MovieRead(BaseModel):
    id: int
    title: str
    genre: str
    release_year: int
    # add other movie fields
    avg_rating: float | None = None
    ratings_count: int | None = None

    model_config = ConfigDict(from_attributes=True)

# --- User/Auth schemas ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True   # ✅


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int


# --- Rating schemas ---
class RatingCreate(BaseModel):
    movie_id: int
    score: int
    comment: Optional[str] = None


class RatingRead(BaseModel):
    id: int
    score: int
    comment: str | None
    created_at: datetime
    updated_at: datetime
    user: UserRead
    movie: MovieRead | None = None


# --- Movie with details ---
class MovieDetail(MovieRead):
    ratings: List[RatingRead] = Field(default_factory=list)  # ✅ safe default list
