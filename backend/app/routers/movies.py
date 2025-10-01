from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from typing import Optional, List
from app.database import get_session
from app.models import Movie, Rating, User
from app.schemas import MovieCreate, MovieRead, UserRead, MovieDetail, RatingRead
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/movies", tags=["movies"])

# Create movie
@router.post("/", response_model=MovieRead)
def create_movie(
    movie: MovieCreate,
    session: Session = Depends(get_session),
    current_user: UserRead = Depends(get_current_user),
):
    db_movie = Movie(
        title=movie.title,
        genre=movie.genre,
        release_year=movie.release_year,
        description=movie.description,
        created_by=current_user.id
    )
    session.add(db_movie)
    session.commit()
    session.refresh(db_movie)

    # Set default ratings info
    db_movie.avg_rating = None
    db_movie.ratings_count = 0

    return db_movie


# List movies with filters and pagination
@router.get("/", response_model=List[MovieRead])
def list_movies(
    genre: Optional[str] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    session: Session = Depends(get_session)
):
    query = select(Movie)
    if genre:
        query = query.where(Movie.genre == genre)
    if min_year:
        query = query.where(Movie.release_year >= min_year)
    if max_year:
        query = query.where(Movie.release_year <= max_year)
    if search:
        query = query.where(Movie.title.ilike(f"%{search}%"))

    movies = session.exec(query.offset((page - 1) * limit).limit(limit)).all()

    # Populate avg_rating and ratings_count safely
    for movie in movies:
        avg_rating_result = session.exec(
            select(func.avg(Rating.score)).where(Rating.movie_id == movie.id)
        ).first()  # could be None

        count_rating_result = session.exec(
            select(func.count(Rating.id)).where(Rating.movie_id == movie.id)
        ).first()  # could be None

        # Safe extraction
        movie.avg_rating = float(avg_rating_result) if avg_rating_result is not None else None
        movie.ratings_count = count_rating_result if count_rating_result is not None else 0  

    return movies



# Get movie details including average rating and ratings count
@router.get("/{id}", response_model=MovieDetail)
def get_movie_details(id: int, session: Session = Depends(get_session)):
    movie = session.get(Movie, id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    avg_rating = session.exec(
        select(func.avg(Rating.score)).where(Rating.movie_id == id)
    ).one()
    count_ratings = session.exec(
        select(func.count(Rating.id)).where(Rating.movie_id == id)
    ).one()

    ratings = session.exec(
        select(Rating, User).join(User, User.id == Rating.user_id).where(Rating.movie_id == id)
    ).all()

    # Convert to Pydantic-friendly objects
    ratings_data = [
        RatingRead(
            id=r.id,
            score=r.score,
            comment=r.comment,
            created_at=r.created_at,
            updated_at=r.updated_at,
            user=UserRead.from_orm(u),
        )
        for r, u in ratings
    ]

    return MovieDetail(
        id=movie.id,
        title=movie.title,
        genre=movie.genre,
        release_year=movie.release_year,
        description=movie.description,
        created_at=movie.created_at,
        avg_rating=float(avg_rating) if avg_rating else None,
        ratings_count=count_ratings,
        ratings=ratings_data,
    )


# Delete movie
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_movie(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    movie = session.get(Movie, id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    if movie.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this movie")

    session.delete(movie)
    session.commit()
    return {"detail": "Movie deleted successfully"}
