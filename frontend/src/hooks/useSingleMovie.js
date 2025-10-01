import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useSingleMovie(id) {
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");

        // fetch movie details
        const res = await fetch(`${API_URL}/movies/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Failed to fetch movie details");
        const data = await res.json();
        setMovie(data);

        // fetch current user’s rating for this movie (optional)
        if (token) {
          const ratingRes = await fetch(`${API_URL}/ratings/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (ratingRes.ok) {
            const ratings = await ratingRes.json();
            const match = ratings.find((r) => r.movie.id === parseInt(id));
            if (match) setUserRating(match);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  return { movie, userRating, loading, error };
}
