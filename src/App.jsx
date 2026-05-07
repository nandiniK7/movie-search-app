import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

const API_KEY = "60034897";

function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  const fetchMovies = async () => {
    if (!search) return;

    try {
      setMessage("");

      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&type=${type}&page=${page}`
      );

      const data = await res.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setMessage(data.Error);
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  useEffect(() => {
    if (search) {
      fetchMovies();
    }
  }, [page, type]);

  const addFavorite = (movie) => {
    const alreadyExists = favorites.find(
      (fav) => fav.imdbID === movie.imdbID
    );

    if (!alreadyExists) {
      setFavorites([...favorites, movie]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-5">
      <h1 className="text-5xl font-bold text-center mb-10">
        Movie Search App 🎬
      </h1>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-white p-3 rounded w-[300px] bg-black text-white"
        />

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="bg-black text-white border border-white p-3 rounded"
        >
          <option value="">All</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="episode">Episode</option>
        </select>

        <button
          onClick={() => {
            setPage(1);
            fetchMovies();
          }}
          className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded text-white font-semibold"
        >
          Search
        </button>
      </div>

      {movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className="bg-white text-black rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://via.placeholder.com/300x450"
                  }
                  alt={movie.Title}
                  className="w-full h-[400px] object-cover"
                />

                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">
                    {movie.Title}
                  </h2>

                  <p className="mb-2">Year: {movie.Year}</p>

                  <p className="mb-4 capitalize">
                    Type: {movie.Type}
                  </p>

                  <div className="flex justify-between">
                    <Link
                      to={`/movie/${movie.imdbID}`}
                      className="bg-blue-500 text-white px-3 py-2 rounded"
                    >
                      Details
                    </Link>

                    <button
                      onClick={() => addFavorite(movie)}
                      className="bg-green-500 text-white px-3 py-2 rounded"
                    >
                      Favorite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-5 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-gray-700 px-5 py-2 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <p className="text-xl">Page {page}</p>

            <button
              onClick={() => setPage(page + 1)}
              className="bg-gray-700 px-5 py-2 rounded"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400 text-xl">
          {message || "Search for a movie to see results"}
        </p>
      )}

      {favorites.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Favorites ❤️
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {favorites.map((movie) => (
              <div
                key={movie.imdbID}
                className="bg-white text-black rounded-lg p-3"
              >
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-[250px] object-cover rounded"
                />

                <h3 className="mt-3 font-bold">
                  {movie.Title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
    );

    const data = await res.json();
    setMovie(data);
  };

  if (!movie) {
    return (
      <h1 className="text-center text-white mt-20 text-3xl">
        Loading...
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-5">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-700 px-5 py-2 rounded mb-8"
      >
        ⬅ Back
      </button>

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          {movie.Title}
        </h1>

        <img
          src={movie.Poster}
          alt={movie.Title}
          className="mx-auto rounded-lg mb-6 w-[300px]"
        />

        <p className="mb-3 text-xl">
          <span className="font-bold">Year:</span> {movie.Year}
        </p>

        <p className="mb-3 text-xl">
          <span className="font-bold">Genre:</span> {movie.Genre}
        </p>

        <p className="mb-3 text-xl">
          <span className="font-bold">Plot:</span> {movie.Plot}
        </p>

        <p className="mb-3 text-xl">
          <span className="font-bold">Actors:</span> {movie.Actors}
        </p>

        <p className="text-xl">
          <span className="font-bold">IMDB Rating:</span> ⭐{" "}
          {movie.imdbRating}
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  );
}

export default App;