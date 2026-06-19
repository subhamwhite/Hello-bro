import { useState, useEffect, useMemo } from 'react';
import { Movie } from '../types';
import * as storage from '../utils/storage';
import { useApp } from '../context/AppContext';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import { Footer, LoadingSpinner } from '../components/SharedUI';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const { currentUser } = useApp();

  useEffect(() => {
    const data = storage.getMovies();
    setMovies(data);
    setLoading(false);
  }, []);

  const categories = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach(m => m.genre.forEach(g => genres.add(g)));
    return ['All', ...Array.from(genres).sort()];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    if (selectedGenre === 'All') return movies;
    return movies.filter(m => m.genre.includes(selectedGenre));
  }, [movies, selectedGenre]);

  const trendingMovies = useMemo(() => filteredMovies.filter(m => m.trending), [filteredMovies]);
  const latestMovies = useMemo(() => filteredMovies.filter(m => m.latest), [filteredMovies]);
  const topRatedMovies = useMemo(() => filteredMovies.filter(m => m.topRated), [filteredMovies]);

  const continueWatchingMovies = useMemo(() => {
    if (!currentUser) return [];
    return currentUser.continueWatching
      .map(cw => {
        const movie = movies.find(m => m.id === cw.movieId);
        return movie ? { movie, progress: cw.progress } : null;
      })
      .filter(Boolean) as { movie: Movie; progress: number }[];
  }, [currentUser, movies]);

  const watchlistMovies = useMemo(() => {
    if (!currentUser) return [];
    return movies.filter(m => currentUser.watchlist.includes(m.id));
  }, [currentUser, movies]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Banner */}
      <HeroBanner movies={movies} onMovieClick={setSelectedMovie} />

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedGenre(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedGenre === cat
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                  : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Watching */}
      {continueWatchingMovies.length > 0 && (
        <MovieRow
          title="Continue Watching"
          movies={continueWatchingMovies.map(cw => cw.movie)}
          onMovieClick={setSelectedMovie}
          progressMap={Object.fromEntries(continueWatchingMovies.map(cw => [cw.movie.id, cw.progress]))}
        />
      )}

      {/* My List */}
      {watchlistMovies.length > 0 && (
        <MovieRow
          title="My List"
          movies={watchlistMovies}
          onMovieClick={setSelectedMovie}
        />
      )}

      {/* Trending */}
      <MovieRow
        title="🔥 Trending Now"
        movies={trendingMovies}
        onMovieClick={setSelectedMovie}
      />

      {/* Latest */}
      <MovieRow
        title="✨ Latest Releases"
        movies={latestMovies}
        onMovieClick={setSelectedMovie}
      />

      {/* Top Rated */}
      <MovieRow
        title="⭐ Top Rated"
        movies={topRatedMovies}
        onMovieClick={setSelectedMovie}
      />

      {/* All Movies by Genre */}
      {selectedGenre !== 'All' && (
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h2 className="text-white text-lg md:text-xl font-bold mb-4">
            {selectedGenre} Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map(movie => (
              <div
                key={movie.id}
                className="cursor-pointer group"
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-white text-sm font-medium truncate group-hover:text-red-400 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-gray-500 text-xs">{movie.releaseYear}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
