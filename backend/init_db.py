# backend/init_db.py
from sqlmodel import SQLModel, create_engine
from app.models import User, Movie, Rating

DATABASE_URL = "sqlite:///./movie_rate.db"

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db()
