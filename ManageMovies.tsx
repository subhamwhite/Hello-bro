import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Star, X, Upload } from 'lucide-react';
import { Movie } from '../../types';
import * as storage from '../../utils/storage';
import { useApp } from '../../context/AppContext';
import { Pagination } from '../../components/SharedUI';

export default function ManageMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useApp();
  const itemsPerPage = 8;

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = () => {
    setMovies(storage.getMovies());
  };

  const filteredMovies = searchQuery
    ? movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : movies;

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      storage.deleteMovie(id);
      loadMovies();
      showToast('Movie deleted', 'success');
    }
  };

  const openAddForm = () => {
    setEditingMovie(null);
    setShowForm(true);
  };

  const openEditForm = (movie: Movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Movies Library</h2>
          <p className="text-gray-500 text-sm">{movies.length} total movies</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Movie
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          placeholder="Search movies..."
          className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors"
        />
      </div>

      {/* Movies Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">Movie</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase hidden sm:table-cell">Genre</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase hidden md:table-cell">Year</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">Rating</th>
                <th className="text-right px-4 py-3 text-gray-400 text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMovies.map(movie => (
                <tr key={movie.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={movie.poster} alt={movie.title} className="w-10 h-14 rounded object-cover bg-gray-800" />
                      <div>
                        <p className="text-white text-sm font-medium">{movie.title}</p>
                        <p className="text-gray-500 text-xs">{movie.duration}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {movie.genre.slice(0, 2).map(g => (
                        <span key={g} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{g}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">{movie.releaseYear}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm">{movie.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(movie)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMovies.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">No movies found</div>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Movie Form Modal */}
      {showForm && (
        <MovieForm
          movie={editingMovie}
          onClose={() => { setShowForm(false); setEditingMovie(null); }}
          onSave={() => { loadMovies(); setShowForm(false); setEditingMovie(null); }}
        />
      )}
    </div>
  );
}

// ===== MOVIE FORM =====
function MovieForm({ movie, onClose, onSave }: { movie: Movie | null; onClose: () => void; onSave: () => void }) {
  const categories = storage.getCategories();
  const { showToast } = useApp();
  
  const [form, setForm] = useState({
    title: movie?.title || '',
    description: movie?.description || '',
    rating: movie?.rating || 7.0,
    genre: movie?.genre || [] as string[],
    releaseYear: movie?.releaseYear || 2024,
    duration: movie?.duration || '2h 00m',
    poster: movie?.poster || '',
    backdrop: movie?.backdrop || '',
    videoUrl: movie?.videoUrl || '',
    featured: movie?.featured || false,
    trending: movie?.trending || false,
    latest: movie?.latest || false,
    topRated: movie?.topRated || false,
  });

  const [saving, setSaving] = useState(false);

  const handleGenreToggle = (genre: string) => {
    setForm(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || form.genre.length === 0) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      if (movie) {
        // Update
        storage.updateMovie({
          ...movie,
          ...form,
        });
        showToast('Movie updated successfully', 'success');
      } else {
        // Add new
        const newMovie: Movie = {
          id: `movie-${Date.now()}`,
          ...form,
          createdAt: new Date().toISOString(),
        };
        storage.addMovie(newMovie);
        showToast('Movie added successfully', 'success');
      }
      setSaving(false);
      onSave();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl animate-scaleIn mb-10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">{movie ? 'Edit Movie' : 'Add New Movie'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Release Year</label>
              <input
                type="number"
                value={form.releaseYear}
                onChange={e => setForm(p => ({ ...p, releaseYear: parseInt(e.target.value) || 2024 }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.rating}
                onChange={e => setForm(p => ({ ...p, rating: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                placeholder="2h 15m"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Year</label>
              <input
                type="number"
                value={form.releaseYear}
                onChange={e => setForm(p => ({ ...p, releaseYear: parseInt(e.target.value) || 2024 }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Genres *</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleGenreToggle(cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.genre.includes(cat.name)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Poster URL
            </label>
            <input
              type="url"
              value={form.poster}
              onChange={e => setForm(p => ({ ...p, poster: e.target.value }))}
              placeholder="https://example.com/poster.jpg"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
            {form.poster && (
              <img src={form.poster} alt="Preview" className="w-16 h-24 rounded mt-2 object-cover bg-gray-800" />
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Backdrop URL</label>
            <input
              type="url"
              value={form.backdrop}
              onChange={e => setForm(p => ({ ...p, backdrop: e.target.value }))}
              placeholder="https://example.com/backdrop.jpg"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Video URL</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))}
              placeholder="https://example.com/video.mp4"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Flags</label>
            <div className="flex flex-wrap gap-3">
              {(['featured', 'trending', 'latest', 'topRated'] as const).map(flag => (
                <label key={flag} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[flag]}
                    onChange={e => setForm(p => ({ ...p, [flag]: e.target.checked }))}
                    className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-gray-400 text-sm capitalize">{flag === 'topRated' ? 'Top Rated' : flag}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              {movie ? 'Update Movie' : 'Add Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
