import { useParams } from "react-router-dom";
import useSingleMovie from "../hooks/useSingleMovie";

export default function MovieDetail() {
  const { id } = useParams();
  const { movie, loading, error } = useSingleMovie(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-bold text-indigo-400 mb-4">{movie.title}</h1>
        <p className="text-gray-400 mb-2">
          {movie.genre} | {movie.release_year}
        </p>
        <p className="text-yellow-400 font-bold mb-4">
          ⭐ {movie.avg_rating ?? "N/A"} ({movie.ratings_count} ratings)
        </p>

        {/* Description if available */}
        {movie.description && (
          <p className="text-gray-300 mb-6">{movie.description}</p>
        )}

        {/* Ratings + comments */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3">User Ratings</h2>
          {movie.ratings && movie.ratings.length > 0 ? (
            <div className="space-y-4">
              {movie.ratings.map((r) => (
                <div
                  key={r.id}
                  className="bg-gray-700 p-3 rounded-lg shadow-sm"
                >
                  <p className="text-yellow-400 font-semibold">⭐ {r.score}</p>
                  {r.comment && (
                    <p className="text-gray-300 mt-1">💬 {r.comment}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    by {r.user?.email || "Anonymous"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No ratings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
