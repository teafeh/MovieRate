import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function useMovies(page = 1, limit = 10) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/movies?page=${page}&limit=${limit}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to fetch movies");
        setMovies(data.items || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page, limit]);

  return { movies, loading, error };
}
