import { useMemo, useState } from "react";
import movieData from "./data/movies.json";

function getCategories(movies) {
  return ["All", ...new Set(movies.map((movie) => movie.category))];
}

function getTags(movies) {
  return ["All", ...new Set(movies.flatMap((movie) => movie.tags))];
}

export default function App() {
  const [movies, setMovies] = useState(movieData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [watchFilter, setWatchFilter] = useState("All");
  const [sortBy, setSortBy] = useState("title");

  const categories = useMemo(() => getCategories(movies), [movies]);
  const tags = useMemo(() => getTags(movies), [movies]);

  const visibleMovies = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return [...movies]
      .filter((movie) => {
        const matchesSearch =
          search === "" ||
          movie.title.toLowerCase().includes(search) ||
          movie.category.toLowerCase().includes(search) ||
          movie.tags.some((tag) => tag.toLowerCase().includes(search));

        const matchesCategory =
          selectedCategory === "All" || movie.category === selectedCategory;

        const matchesTag =
          selectedTag === "All" || movie.tags.includes(selectedTag);

        const matchesWatchStatus =
          watchFilter === "All" ||
          (watchFilter === "Watched" && movie.watched) ||
          (watchFilter === "Not watched" && !movie.watched);

        return matchesSearch && matchesCategory && matchesTag && matchesWatchStatus;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "year-new") return b.year - a.year;
        if (sortBy === "year-old") return a.year - b.year;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [movies, searchTerm, selectedCategory, selectedTag, watchFilter, sortBy]);

  function toggleWatched(id) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === id ? { ...movie, watched: !movie.watched } : movie
      )
    );
  }

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">🎬 My Movie Watchlist</p>
          <h1>Welcome back, movie fan.</h1>
          <p className="hero-text">
            Search your films, filter by category or tag, sort your watchlist,
            and keep track of what you have watched.
          </p>
        </div>

        <div className="movie-count">
          <strong>{movies.length}</strong>
          <span>movies saved</span>
        </div>
      </header>

      <section className="controls">
        <label>
          Search movies
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Try: space, thriller, Inception..."
          />
        </label>

        <label>
          Category
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <label>
          Tag
          <select
            value={selectedTag}
            onChange={(event) => setSelectedTag(event.target.value)}
          >
            {tags.map((tag) => (
              <option key={tag}>{tag}</option>
            ))}
          </select>
        </label>

        <label>
          Sort
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="title">Title A-Z</option>
            <option value="year-new">Newest first</option>
            <option value="year-old">Oldest first</option>
            <option value="rating">Highest rating</option>
          </select>
        </label>
      </section>

      <section className="watch-buttons">
        {["All", "Watched", "Not watched"].map((status) => (
          <button
            key={status}
            onClick={() => setWatchFilter(status)}
            className={watchFilter === status ? "active" : ""}
          >
            {status}
          </button>
        ))}
      </section>

      <section className="movie-grid">
        {visibleMovies.map((movie) => (
          <article className="movie-card" key={movie.id}>
              {movie.image && (
                <img
                  className="poster"
                  src={movie.image}
                  alt={movie.title}
                />
              )}
            <div className="movie-card-header">
              <div>
                <h2>{movie.title}</h2>
                <p>{movie.year} · {movie.category}</p>
              </div>

              <button
                className="watched-toggle"
                onClick={() => toggleWatched(movie.id)}
                title={movie.watched ? "Mark as not watched" : "Mark as watched"}
              >
                {movie.watched ? "✅" : "⭕"}
              </button>
            </div>

            <p className="notes">{movie.notes}</p>

            <p className="rating">⭐ {movie.rating}/10</p>

            <div className="tags">
              {movie.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </section>

      {visibleMovies.length === 0 && (
        <section className="empty">
          No movies found. Try changing your search or filters.
        </section>
      )}
    </main>
  );
}