from pydantic import BaseModel, EmailStr
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


class MovieRead(MovieBase):
    id: int
    created_at: datetime
    avg_rating: Optional[float] = None
    ratings_count: int = 0

    class Config:
        orm_mode = True


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
        orm_mode = True


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
    comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    user: UserRead   # <-- full user info here

    class Config:
        orm_mode = True


# --- Movie with details ---
class MovieDetail(MovieRead):
    ratings: List[RatingRead] = []
