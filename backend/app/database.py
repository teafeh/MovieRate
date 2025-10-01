# app/database.py
from sqlmodel import create_engine, Session, SQLModel

# SQLite for now (easy start), you can swap to Postgres/MySQL later
DATABASE_URL = "sqlite:///./movie_rate.db"

engine = create_engine(DATABASE_URL, echo=True)

# Create tables
def init_db():
    SQLModel.metadata.create_all(engine)

# Dependency for FastAPI routes
def get_session():
    with Session(engine) as session:
        yield session
