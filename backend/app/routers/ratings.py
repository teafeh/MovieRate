from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Rating, Movie, User
from sqlalchemy import func
from app.schemas import RatingCreate, RatingRead, UserRead, MovieRead
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
def get_my_ratings(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    results = session.exec(
        select(
            Rating,
            Movie,
            func.avg(Rating.score).label("avg_rating"),
            func.count(Rating.id).label("ratings_count"),
        )
        .join(Movie, Movie.id == Rating.movie_id)
        .where(Rating.user_id == current_user.id)
        .group_by(Rating.id, Movie.id)
    ).all()

    return [
        RatingRead(
            id=r.id,
            score=r.score,
            comment=r.comment,
            created_at=r.created_at,
            updated_at=r.updated_at,
            user=UserRead.from_orm(current_user),
            movie=MovieRead(
                **{
                    k: v
                    for k, v in MovieRead.from_orm(m).model_dump().items()
                    if k not in {"avg_rating", "ratings_count"}
                },
                avg_rating=float(avg_rating or 0.0),
                ratings_count=int(ratings_count or 0),
            ),
        )
        for r, m, avg_rating, ratings_count in results
    ]
