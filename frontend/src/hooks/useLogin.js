import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Login failed");

      localStorage.setItem("token", data.access_token);
      setLoading(false);
      return true; 
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  return { login, loading, error };
}