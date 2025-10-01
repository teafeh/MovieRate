import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useRateMovie() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const rateMovie = async ({ movie_id, score, comment }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found, please login.");

      // Decode token to extract user ID
      const decoded = jwtDecode(token);
      const user_id = decoded?.user_id || decoded?.id; 

      if (!user_id) throw new Error("Invalid token: user id missing");

      const res = await fetch("http://127.0.0.1:8000/api/ratings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ user_id, movie_id, score, comment }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Failed with status ${res.status}`);
      }

      setSuccess(true);
      na
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { rateMovie, loading, error, success };
}
