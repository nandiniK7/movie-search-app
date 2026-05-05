import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import MovieDetails from "./MovieDetails";

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [favorites, setFavorites] = useState([]);

  const API_KEY = "60034897";

  // 🎬 Fetch Movies
  const fetchMovies = async () => {
    if (!search) return;

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&type=${type}&page=${page}`
      );

      const data = await res.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.log(error);
      setMovies([]);
    }
  };

  // 🔁 Fetch on page/type change
  useEffect(() => {
    if (search) fetchMovies();
  }, [page, type]);

  // ⭐ Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  // 💾 Save favorites
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ⭐ Toggle favorite
  const toggleFavorite = (movie) => {
    const exists = favorites.find((m) => m.imdbID === movie.imdbID);

    if (exists) {
      setFavorites(favorites.filter((m) => m.imdbID !== movie.imdbID));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-5">

      <Routes>

        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <h1 className="text-3xl text-center mb-6">
                Movie Search App 🎬
              </h1>

              {/* ⭐ FAVORITES */}
              {favorites.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl mb-2">⭐ Favorites</h2>

                  <div className="flex gap-3 overflow-x-auto">
                    {favorites.map((movie) => (
                      <div
                        key={movie.imdbID}
                        className="bg-white text-black p-2 rounded"
                      >
                        <img
                          src={
                            movie.Poster !== "N/A"
                              ? movie.Poster
                              : "https://via.placeholder.com/150"
                          }
                          alt={movie.Title}
                          className="w-32 h-40 object-cover"
                        />
                        <p className="text-sm">{movie.Title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔍 SEARCH + FILTER */}
              <div className="flex justify-center gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 rounded w-80 bg-gray-900 text-white border border-gray-600 placeholder-gray-400"
                />

                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded text-black"
                >
                  <option value="">All</option>
                  <option value="movie">Movies</option>
                  <option value="series">Series</option>
                  <option value="episode">Episodes</option>
                </select>

                <button
                  onClick={() => {
                    setPage(1);
                    fetchMovies();
                  }}
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  Search
                </button>
              </div>

              {/* 🎬 MOVIES GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {movies.map((movie) => (
                  <Link key={movie.imdbID} to={`/movie/${movie.imdbID}`}>
                    <div className="bg-white text-black p-3 rounded hover:scale-105 transition">
                      <img
                        src={
                          movie.Poster !== "N/A"
                            ? movie.Poster
                            : "https://via.placeholder.com/300"
                        }
                        alt={movie.Title}
                        className="w-full h-64 object-cover"
                      />

                      <h2 className="font-bold mt-2">{movie.Title}</h2>
                      <p>{movie.Year}</p>

                      {/* ⭐ BUTTON */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(movie);
                        }}
                        className="mt-2 bg-yellow-400 px-2 py-1 rounded"
                      >
                        ⭐
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 🔁 PAGINATION */}
              {movies.length > 0 && (
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="bg-gray-700 px-4 py-2 rounded"
                  >
                    Prev
                  </button>

                  <span>Page {page}</span>

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="bg-gray-700 px-4 py-2 rounded"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          }
        />

        {/* 📄 DETAILS PAGE */}
        <Route path="/movie/:id" element={<MovieDetails />} />

      </Routes>
    </div>
  );
}

export default App;