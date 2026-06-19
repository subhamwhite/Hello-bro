import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Movie } from '../types';
import * as storage from '../utils/storage';
import { Footer, Pagination, EmptyState } from '../components/SharedUI';
import MovieModal from '../components/MovieModal';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  useEffect(() => {
    setMovies(storage.getMovies());
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const genres = useMemo(() => {
    const g = new Set<string>();
    movies.forEach(m => m.genre.forEach(genre => g.add(genre)));
    return ['All', ...Array.from(g).sort()];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = [...movies];
    
    // Search filter
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.genre.some(g => g.toLowerCase().includes(q))
      );
    }
    
    // Genre filter
    if (selectedGenre !== 'All') {
      result = result.filter(m => m.genre.includes(selectedGenre));
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      return a.title.localeCompare(b.title);
    });
    
    return result;
  }, [movies, query, selectedGenre, sortBy]);

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      setCurrentPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white mb-6">Browse Movies</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search movies, genres..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-500"
            />
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Genre</span>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => { setSelectedGenre(g); setCurrentPage(1); }}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedGenre === g
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-sm">Sort by</span>
            </div>
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value as typeof sortBy); setCurrentPage(1); }}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-red-500"
            >
              <option value="rating">Top Rated</option>
              <option value="year">Newest</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredMovies.length === 0 ? (
          <EmptyState
            title="No movies found"
            description="Try adjusting your search or filters"
            icon={<SearchIcon className="w-16 h-16" />}
          />
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">{filteredMovies.length} movies found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {paginatedMovies.map(movie => (
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
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>⭐ {movie.rating}</span>
                    <span>{movie.releaseYear}</span>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
      <Footer />
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
}
