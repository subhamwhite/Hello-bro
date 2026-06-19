import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Film, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

// ===== TOAST NOTIFICATIONS =====
export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const bgColors = {
    success: 'border-green-500/30 bg-green-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
  };

  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-slideLeft ${bgColors[toast.type]}`}
        >
          {icons[toast.type]}
          <p className="text-white text-sm flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ===== FOOTER =====
export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-6 h-6 text-red-500" />
              <span className="text-lg font-black text-white">
                STREAM<span className="text-red-500">FLIX</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your premium streaming destination. Watch thousands of movies and shows anytime, anywhere.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Navigation</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-500 hover:text-white text-sm transition-colors">Home</Link>
              <Link to="/search" className="block text-gray-500 hover:text-white text-sm transition-colors">Browse</Link>
              <Link to="/watchlist" className="block text-gray-500 hover:text-white text-sm transition-colors">My List</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Categories</h4>
            <div className="space-y-2">
              <span className="block text-gray-500 text-sm">Action</span>
              <span className="block text-gray-500 text-sm">Comedy</span>
              <span className="block text-gray-500 text-sm">Drama</span>
              <span className="block text-gray-500 text-sm">Sci-Fi</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Account</h4>
            <div className="space-y-2">
              <Link to="/login" className="block text-gray-500 hover:text-white text-sm transition-colors">Sign In</Link>
              <Link to="/register" className="block text-gray-500 hover:text-white text-sm transition-colors">Sign Up</Link>
              <Link to="/admin" className="block text-gray-500 hover:text-white text-sm transition-colors">Admin</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2024 StreamFlix. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">Privacy Policy</span>
            <span className="text-gray-600 text-sm">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ===== LOADING SPINNER =====
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// ===== EMPTY STATE =====
export function EmptyState({ title, description, icon }: { title: string; description: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
      <div className="text-gray-600 mb-4">
        {icon || <Heart className="w-16 h-16" />}
      </div>
      <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-md">{description}</p>
    </div>
  );
}

// ===== PAGINATION =====
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Prev
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-2 text-sm rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">1</button>
          {start > 2 && <span className="text-gray-600 px-1">...</span>}
        </>
      )}
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
            p === currentPage
              ? 'bg-red-600 text-white font-bold'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-600 px-1">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-2 text-sm rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}
