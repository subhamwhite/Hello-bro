import { X, Play, Heart, Star, Clock, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { useApp } from '../context/AppContext';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const { currentUser, toggleWatchlist, isInWatchlist, showToast } = useApp();
  const navigate = useNavigate();
  const inWatchlist = currentUser ? isInWatchlist(movie.id) : false;

  const handleWatchlist = () => {
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

  const handlePlay = () => {
    navigate(`/player/${movie.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Backdrop Image */}
        <div className="relative h-56 sm:h-72 md:h-80">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlay}
              className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transform hover:scale-110 transition-transform shadow-xl"
            >
              <Play className="w-7 h-7 text-black fill-black ml-1" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 -mt-16 relative">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{movie.title}</h2>
          
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-400 font-bold">
              <Star className="w-4 h-4 fill-yellow-400" /> {movie.rating}
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-4 h-4" /> {movie.releaseYear}
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" /> {movie.duration}
            </div>
            <span className="bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-300">HD</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genre.map(g => (
              <span key={g} className="text-xs text-gray-300 bg-white/10 px-3 py-1 rounded-full">{g}</span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" /> Watch Now
            </button>
            <button
              onClick={handleWatchlist}
              className={`flex items-center gap-2 font-bold px-6 py-3 rounded-lg transition-all border ${
                inWatchlist
                  ? 'bg-red-500/20 border-red-500 text-red-400'
                  : 'bg-transparent border-gray-600 text-gray-300 hover:border-white hover:text-white'
              }`}
            >
              {inWatchlist ? <Heart className="w-5 h-5 fill-red-400" /> : <Plus className="w-5 h-5" />}
              {inWatchlist ? 'In My List' : 'My List'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
