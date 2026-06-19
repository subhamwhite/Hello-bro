import { useState, useEffect } from 'react';
import { Play, Info, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';

interface HeroBannerProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function HeroBanner({ movies, onMovieClick }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featured = movies.filter(m => m.featured).slice(0, 3);
  const navigate = useNavigate();

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featured.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const movie = featured[currentSlide];

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Background Images */}
      {featured.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === currentSlide ? 1 : 0 }}
        >
          <img
            src={m.backdrop}
            alt={m.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl animate-fadeIn">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">FEATURED</span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="text-sm font-bold">{movie.rating}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-gray-300 mb-4">
              <span>{movie.releaseYear}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span>{movie.duration}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span className="bg-gray-700/80 px-2 py-0.5 rounded text-xs">HD</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map(g => (
                <span key={g} className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">{g}</span>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
              {movie.description}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/player/${movie.id}`)}
                className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-black" /> Play Now
              </button>
              <button
                onClick={() => onMovieClick(movie)}
                className="flex items-center gap-2 bg-gray-600/70 text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-600 transition-all backdrop-blur-sm"
              >
                <Info className="w-5 h-5" /> More Info
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {featured.length > 1 && (
        <div className="absolute bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-8 bg-red-500' : 'w-4 bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
