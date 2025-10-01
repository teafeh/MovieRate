import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useMoviesData(page = 1, limit = 10) {
  const [movies, setMovies] = useState([]);
  const [userMovies, setUserMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        // parallel fetch for efficiency
        const [allMoviesRes, userMoviesRes] = await Promise.all([
          fetch(`${API_URL}/movies?page=${page}&limit=${limit}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          token
            ? fetch(`${API_URL}/ratings/me`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve({ ok: true, json: async () => [] }), // empty if no token
        ]);

        if (!allMoviesRes.ok) {
          const err = await allMoviesRes.json();
          throw new Error(err.detail || "Failed to fetch movies");
        }

        if (!userMoviesRes.ok) {
          const err = await userMoviesRes.json();
          throw new Error(err.detail || "Failed to fetch user movies");
        }

        const allMoviesData = await allMoviesRes.json();
        const userMoviesData = await userMoviesRes.json();

        setMovies(allMoviesData.items || allMoviesData);
        setUserMovies(userMoviesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit]);

  return { movies, userMovies, loading, error };
}
