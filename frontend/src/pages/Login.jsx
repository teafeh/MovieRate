import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useLogin";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    const success = await login(form.email, form.password);
    if (success) {
      setSuccessMessage("Welcome back! Logging you in...");
      

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      
      {/* 🚀 Sleek Indigo Success Toast */}
      {successMessage && (
        <div className="absolute top-5 right-5 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce transition-all z-50">
          <span>🔓</span>
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center z-10">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={loading || !!successMessage}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={loading || !!successMessage}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 text-white py-3 rounded font-semibold transition-all"
            disabled={loading || !!successMessage}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-gray-400">
          Don't have an account?{" "}
          <span 
            className="text-indigo-400 cursor-pointer hover:underline" 
            onClick={() => !successMessage && navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}