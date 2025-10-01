from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .database import init_db
from .routers import auth, movies, ratings  # import all routers

app = FastAPI(title="Movie Rating Platform")


origins = [
    "http://localhost:5173",  # frontend URL
    "http://127.0.0.1:5173",  # if using 127.0.0.1
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(ratings.router)  # ratings router

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Movie Rating Platform API is running 🚀"}
