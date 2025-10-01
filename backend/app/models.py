from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

# --- User model ---
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    password: str

    movies: List["Movie"] = Relationship(back_populates="creator")
    ratings: List["Rating"] = Relationship(back_populates="user")


# --- Movie model ---
class Movie(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    genre: str
    release_year: int
    description: Optional[str] = None
    created_by: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    creator: Optional[User] = Relationship(back_populates="movies")
    ratings: List["Rating"] = Relationship(
        back_populates="movie",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

    # These are optional dynamic fields for responses
    avg_rating: Optional[float] = None
    ratings_count: Optional[int] = None


# --- Rating model ---
class Rating(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    movie_id: int = Field(foreign_key="movie.id")
    score: int
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="ratings")
    movie: Optional[Movie] = Relationship(back_populates="ratings")
