import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useUserMovies() {
  const [userMovies, setUserMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserMovies = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/ratings/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user movies");

        const data = await res.json();

        // Enrich ratings with movie details
        const enriched = await Promise.all(
          data.map(async (rating) => {
            try {
              const movieRes = await fetch(`${API_URL}/movies/${rating.movie_id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!movieRes.ok) throw new Error("Failed to fetch movie");
              const movie = await movieRes.json();
              return { ...rating, movie };
            } catch {
              return rating; // fallback if fetch fails
            }
          })
        );

        setUserMovies(enriched);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMovies();
  }, []);

  return { userMovies, loading, error };
}
