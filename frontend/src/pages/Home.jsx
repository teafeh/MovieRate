import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMoviesData from "../hooks/useMoviesData";
import MovieForm from "./MovieForm";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [page, setPage] = useState(1);
  const { movies, userMovies, loading, error } = useMoviesData(page);

  const [showForm, setShowForm] = useState(false);

  // Redirect if no token
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  if (!token) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center text-white">
      {/* Header with logout + add movie */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-400">🎬 Movie List</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-semibold"
          >
            ➕ Add Movie
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Add Movie Form Modal */}
      {showForm && <MovieForm onClose={() => setShowForm(false)} />}

      {/* All Movies */}
      {loading && <p className="text-lg text-gray-300">Loading movies...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl mb-10">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-800 rounded-xl shadow-lg p-5 text-center hover:scale-105 transition-transform"
          >
            <h2
              className="text-xl font-semibold mb-2 cursor-pointer"
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              {movie.title}
            </h2>
            <p className="text-gray-400 mb-1">
              {movie.genre} | {movie.release_year}
            </p>
            <p className="text-yellow-400 font-bold mb-3">
              ⭐ {movie.avg_rating ?? "N/A"} ({movie.ratings_count})
            </p>
            <button
              onClick={() => navigate(`/rate/${movie.id}`)}
              className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded"
            >
              ⭐ Rate
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mb-10">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
        >
          Previous
        </button>
        <span className="font-semibold">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
        >
          Next
        </button>
      </div>

      {/* Movies Rated by Me */}
      <h2 className="text-2xl font-bold text-indigo-300 mb-4">🎯 Movies I Rated</h2>
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {userMovies.length > 0 ? (
            userMovies.map((rating) => (
              <div
                key={rating.movie.id}
                className="bg-gray-800 rounded-xl shadow-lg p-5 text-center hover:scale-105 transition-transform"
              >
                <h2
                  className="text-xl font-semibold mb-2 cursor-pointer"
                  onClick={() => navigate(`/movies/${rating.movie.id}`)}
                >
                  {rating.movie.title}
                </h2>
                <p className="text-gray-400 mb-1">
                  {rating.movie.genre} | {rating.movie.release_year}
                </p>
                <p className="text-yellow-400 font-bold mb-3">
                  ⭐ Your Rating: {rating.score}
                </p>
                <button
                  onClick={() => navigate(`/rate/${rating.movie.id}`)}
                  className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded"
                >
                  ⭐ Rate Again
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full">
              You haven't rated any movies yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
