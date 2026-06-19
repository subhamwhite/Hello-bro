import { useState } from 'react';
import { Play, Heart, Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { useApp } from '../context/AppContext';

interface MovieCardProps {
  movie: Movie;
  onMovieClick: (movie: Movie) => void;
  showProgress?: number;
}

export default function MovieCard({ movie, onMovieClick, showProgress }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { currentUser, toggleWatchlist, isInWatchlist, showToast } = useApp();
  const navigate = useNavigate();
  const inWatchlist = currentUser ? isInWatchlist(movie.id) : false;

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      showToast('Please sign in to add to watchlist', 'warning');
      return;
    }
    toggleWatchlist(movie.id);
    showToast(
      inWatchlist ? 'Removed from My List' : 'Added to My List',
      inWatchlist ? 'info' : 'success'
    );
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/player/${movie.id}`);
  };

  return (
    <div
      className="relative group cursor-pointer shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onMovieClick(movie)}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}
        <img
          src={movie.poster}
          alt={movie.title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isHovered ? 'scale-110 brightness-50' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Progress Bar */}
        {showProgress !== undefined && showProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${showProgress}%` }}
            />
          </div>
        )}

        {/* Hover Overlay */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handlePlay}
            className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform hover:scale-110 transition-transform shadow-lg"
          >
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </button>
          <button
            onClick={handleWatchlist}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              inWatchlist ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            {inWatchlist ? <Heart className="w-4 h-4 fill-white" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded">
          <Star className="w-3 h-3 fill-yellow-400" />
          {movie.rating}
        </div>
      </div>

      {/* Info */}
      <div className="mt-2 px-0.5">
        <h3 className="text-white text-sm font-medium truncate group-hover:text-red-400 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span>{movie.releaseYear}</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <span>{movie.duration}</span>
        </div>
      </div>
    </div>
  );
}
