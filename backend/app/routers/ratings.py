from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Rating, Movie, User
from app.schemas import RatingCreate, RatingRead
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/ratings", tags=["ratings"])

# Create or update a rating
@router.post("/", response_model=RatingRead)
def create_or_update_rating(
    rating: RatingCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    movie = session.get(Movie, rating.movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    db_rating = session.exec(
        select(Rating).where(
            (Rating.user_id == current_user.id) &
            (Rating.movie_id == rating.movie_id)
        )
    ).first()

    if db_rating:
        db_rating.score = rating.score
        db_rating.comment = rating.comment
    else:
        db_rating = Rating(
            user_id=current_user.id,
            movie_id=rating.movie_id,
            score=rating.score,
            comment=rating.comment
        )
        session.add(db_rating)

    session.commit()
    session.refresh(db_rating)
    return db_rating

# List ratings for a movie
@router.get("/movie/{id}", response_model=list[RatingRead])
def list_ratings_for_movie(id: int, session: Session = Depends(get_session)):
    movie = session.get(Movie, id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    ratings = session.exec(select(Rating).where(Rating.movie_id == id)).all()
    return ratings

# List ratings by current user
@router.get("/me", response_model=list[RatingRead])
def list_my_ratings(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    ratings = session.exec(select(Rating).where(Rating.user_id == current_user.id)).all()
    return ratings
