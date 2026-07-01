import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async (username, email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      
      setLoading(false);
      return true; 
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  return { register, loading, error };
}