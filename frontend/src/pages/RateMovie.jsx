import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import useRateMovie from "../hooks/useRateMovie";

export default function RateMovie({ onClose }) {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { rateMovie, loading, error, success } = useRateMovie();

  const [score, setScore] = useState(3);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await rateMovie({
      movie_id: parseInt(movieId, 10),
      score,
      comment,
    });

    if (result) {
      onClose?.(); // close modal
      navigate(`/movies/${movieId}`); // refresh movie detail
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md text-white"
      >
        <h1 className="text-2xl font-bold text-indigo-400 mb-4">⭐ Rate Movie</h1>

        {/* Slider */}
        <label className="block mb-2">Score: {score}</label>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full accent-yellow-500"
        />

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment (optional)"
          className="w-full p-3 rounded bg-gray-700 mt-4 text-white"
          rows="4"
        />

        {/* Errors & Success */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">Rating submitted!</p>}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onClose || (() => navigate(-1))}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
