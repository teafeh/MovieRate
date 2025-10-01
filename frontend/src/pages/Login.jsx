import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useLogin";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form.email, form.password);
    if (success) navigate("/");
    else setError("Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded font-semibold transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-gray-400">
          Don't have an account?{" "}
          <span className="text-indigo-400 cursor-pointer" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
