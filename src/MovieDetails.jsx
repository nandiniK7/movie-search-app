import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  const API_KEY = "60034897";

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
      );
      const data = await res.json();
      setMovie(data);
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <h1 className="text-white">Loading...</h1>;

  return (
    <div className="bg-black min-h-screen text-white p-6 text-center">
      
      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
      >
        ⬅ Back
      </button>

      <h1 className="text-3xl mb-4">{movie.Title}</h1>

      <img
        src={movie.Poster}
        alt={movie.Title}
        className="mx-auto mb-4 w-64 rounded"
      />

      <div className="space-y-2">
        <p><b>Year:</b> {movie.Year}</p>
        <p><b>Genre:</b> {movie.Genre}</p>
        <p><b>Plot:</b> {movie.Plot}</p>
        <p><b>Actors:</b> {movie.Actors}</p>
        <p><b>IMDB Rating:</b> ⭐ {movie.imdbRating}</p>
      </div>
    </div>
  );
}

export default MovieDetails;