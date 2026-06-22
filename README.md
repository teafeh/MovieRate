
# MovieRate

MovieRate is a modern, production-ready full-stack Movie Rating Platform where users can discover, add, and review movies. The project showcases robust architectural choices, including a highly performant **FastAPI** backend with JWT authentication and a modular **React** single-page application frontend.

---

## 🚀 Architecture Overview

The system is split into two decoupled layers architecture:

* **Backend:** A stateless, high-performance REST API built with Python, FastAPI, and SQLAlchemy.
* **Frontend:** A responsive Single Page Application (SPA) built with React, leveraging modern hooks, context-driven state, and client-side routing.

---

## 🛠️ Tech Stack

### Backend

* **Core:** Python 3.11+, FastAPI
* **Database & ORM:** SQLite (configured for seamless PostgreSQL swap), SQLAlchemy, Alembic (Migrations)
* **Security:** Passlib (bcrypt hashing), PyJWT (JSON Web Tokens)
* **Testing:** Pytest

### Frontend

* **Core:** React 18+, React Router DOM
* **HTTP Client:** Axios
* **Styling:** Clean UI with component-scoped states, explicit loading, and robust error boundaries.
* **Testing:** Jest & React Testing Library

---

## 📐 Design Decisions & Scalability

### 1. Database & Optimization Strategy

* **Aggregated Analytics:** To avoid expensive runtime calculation overhead ($O(N)$ read complexity where $N$ is total ratings), the `Movie` model leverages **denormalized fields**: `ratings_count` and `ratings_avg`.
* **Write Hooks:** When a user adds or updates a rating, an database-level transaction hooks update these values atomically. This shifts computation to writes ($O(1)$ read delivery), ensuring the main movie listing page scales smoothly even with millions of reviews.
* **Postgres Compatibility:** Environment variables dictate database drivers. Swapping from SQLite to PostgreSQL is as simple as updating the `DATABASE_URL` connection string without modifying any core engine logic.

### 2. Authentication & Route Security

* **JWT Handshake:** Authentication is stateless. Upon login, users receive a signed JWT token passed in standard HTTP `Authorization: Bearer <token>` headers to guard protected endpoints.
* **Frontend Route Guards:** Unauthorized users are kept safe from broken flows via application-level router interceptors. If a user attempts to manually navigate to an authenticated view, they are contextually routed back to the sign-in prompt.

### 3. Business Rule Handling

* **Idempotent Ratings:** The API utilizes an upsert pattern for reviews. A composite unique constraint on `(user_id, movie_id)` guarantees that a user can only rate a movie once. Submitting a new rating to an existing movie automatically overrides the previous payload and recalculates downstream aggregates.
* **Safe Deletions:** Movies can be deleted via a protected route. For baseline integrity, deletion rights are restricted solely to the user who initially registered the movie asset.

---

## 📋 Database Schema Design

```
   ┌───────────────┐             ┌───────────────┐
   │     USER      │             │     MOVIE     │
   ├───────────────┤             ├───────────────┤
   │ id (PK)       │             │ id (PK)       │
   │ username      │             │ title         │
   │ email         │             │ genre         │
   │ password_hash │             │ release_year  │
   │ created_at    │             │ description   │
   └───────┬───────┘             │ created_by(FK)│
           │                     │ ratings_count │
           │ 1                   │ ratings_avg   │
           │                     │ created_at    │
           │                     └───────┬───────┘
           │                             │ 1
           │             M               │
           └───────────┐ ┌───────────────┘
                       ▼ ▼
                ┌───────────────┐
                │    RATING     │
                ├───────────────┤
                │ id (PK)       │
                │ movie_id (FK) │
                │ user_id (FK)  │
                │ rating (1-5)  │
                │ review (text) │
                │ created_at    │
                │ updated_at    │
                └───────────────┘

```

---

## ⚙️ Project Setup & Installation

Clone the repository locally:

```bash
git clone https://github.com/teafeh/MovieRate.git
cd MovieRate

```

### Backend Setup

1. **Navigate to backend and create environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

```



```

2. **Install dependencies:**
   ```bash
pip install -r requirements.txt

```

3. **Configure Environment:**
Create a `.env` file in the root backend folder:
```env
DATABASE_URL=sqlite:///./movies.db
SECRET_KEY=your_super_secret_jwt_signing_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

```



```

4. **Run Migrations & Seed DB:**
   ```bash
alembic upgrade head

```

5. **Start the server:**
```bash

```



uvicorn app.main:app --reload

```
   The backend API interactive docs will live seamlessly at: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
cd ../frontend

```

2. **Install modules:**
```bash
npm install

```



```

3. **Configure Environment:**
   Create a `.local.env` or configure your layout to direct API fetches target: `http://localhost:8000`

4. **Launch Application:**
   ```bash
npm start

```

Open `http://localhost:3000` to interact with your live environment UI.

---

## 🧪 Testing Protocol

### Running Backend Unit Tests

Execute the comprehensive test suite (handles user auth flows, multi-parameter movie searches, and rating update transactions):

```bash
cd backend
pytest

```

### Running Frontend Tests

Run component testing and snapshot assertions with React Testing Library:

```bash
cd frontend
npm test

```

---

## 📌 API Contract Sample Reference

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| **POST** | `/api/auth/register` | Create a new user account | No |
| **POST** | `/api/auth/login` | Exchange credentials for valid access token | No |
| **GET** | `/api/movies` | Get list of movies (Supports pagination & filtering) | No |
| **POST** | `/api/movies` | Insert new movie into listing index | **Yes** |
| **GET** | `/api/movies/{id}` | Deep dive detail view including calculated metrics | No |
| **POST** | `/api/movies/{id}/ratings` | Submit or update structural 1-5 star review | **Yes** |
| **DELETE** | `/api/movies/{id}` | Strip out entry index (Creator only privilege) | **Yes** |

---

