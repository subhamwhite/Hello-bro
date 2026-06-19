import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Play } from 'lucide-react';
import { Movie } from '../types';
import * as storage from '../utils/storage';
import { useApp } from '../context/AppContext';
import { Footer, EmptyState } from '../components/SharedUI';
import MovieModal from '../components/MovieModal';

export default function Watchlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { currentUser, toggleWatchlist, showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    setMovies(storage.getMovies());
  }, []);

  const watchlistMovies = useMemo(() => {
    if (!currentUser) return [];
    return movies.filter(m => currentUser.watchlist.includes(m.id));
  }, [currentUser, movies]);

  const handleRemove = (movieId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(movieId);
    showToast('Removed from My List', 'info');
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-black text-white">My List</h1>
          <span className="bg-gray-800 text-gray-400 text-sm px-3 py-1 rounded-full">{watchlistMovies.length}</span>
        </div>

        {watchlistMovies.length === 0 ? (
          <EmptyState
            title="Your list is empty"
            description="Start adding movies to your watchlist by clicking the + button on any movie card."
            icon={<Heart className="w-16 h-16" />}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlistMovies.map(movie => (
              <div
                key={movie.id}
                className="group cursor-pointer"
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/player/${movie.id}`); }}
                      className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center transform hover:scale-110 transition-transform"
                    >
                      <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                    </button>
                    <button
                      onClick={(e) => handleRemove(movie.id, e)}
                      className="w-10 h-10 rounded-full bg-red-500/80 flex items-center justify-center transform hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <h3 className="text-white text-sm font-medium truncate group-hover:text-red-400 transition-colors">{movie.title}</h3>
                <p className="text-gray-500 text-xs">{movie.releaseYear} • {movie.duration}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
}
