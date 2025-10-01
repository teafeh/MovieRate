import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function MovieForm({ onClose }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          genre,
          release_year: parseInt(releaseYear),
          description,
        }),
      });

      if (!res.ok) throw new Error("Failed to add movie");

      onClose(); // close modal on success
      window.location.reload(); // refresh movies
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">➕ Add Movie</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
          <input
            type="number"
            placeholder="Release Year"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-semibold"
            >
              {loading ? "Adding..." : "Add Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
