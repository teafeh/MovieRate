import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useRegister";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    const success = await register(form.username, form.email, form.password);
    
    if (success) {
      setSuccessMessage("Account created successfully! Redirecting...");
      

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      
      {/* 🚀 Beautiful Custom Toast Alert */}
      {successMessage && (
        <div className="absolute top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce transition-all z-50">
          <span>✅</span>
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center z-10">
        <h1 className="text-3xl font-bold text-green-400 mb-6">Register</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full p-3 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={loading || !!successMessage}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={loading || !!successMessage}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={loading || !!successMessage}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-3 rounded font-semibold transition-all"
            disabled={loading || !!successMessage}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-gray-400">
          Already have an account?{" "}
          <span className="text-green-400 cursor-pointer hover:underline" onClick={() => !successMessage && navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}