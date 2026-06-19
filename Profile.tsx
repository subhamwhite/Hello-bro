import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Heart, Clock, Film, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';

export default function Profile() {
  const { currentUser, updateCurrentUser, logout, showToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [saving, setSaving] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const watchlistMovies = storage.getMovies().filter(m => currentUser.watchlist.includes(m.id));
  const totalWatchTime = currentUser.continueWatching.reduce((sum, cw) => sum + cw.progress, 0);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateCurrentUser({ ...currentUser, email });
      showToast('Profile updated successfully', 'success');
      setSaving(false);
    }, 500);
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-red-500/20">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-white mb-1">{currentUser.username}</h1>
            <p className="text-gray-400 mb-3">{currentUser.email}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Member since {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{watchlistMovies.length}</p>
            <p className="text-gray-500 text-xs">Watchlist</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <Film className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{currentUser.continueWatching.length}</p>
            <p className="text-gray-500 text-xs">Watched</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{Math.round(totalWatchTime)}%</p>
            <p className="text-gray-500 text-xs">Progress</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <User className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{currentUser.isAdmin ? 'Admin' : 'User'}</p>
            <p className="text-gray-500 text-xs">Role</p>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" /> Edit Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Username</label>
              <input
                type="text"
                value={currentUser.username}
                disabled
                className="w-full bg-gray-800 border border-gray-700 text-gray-500 rounded-lg px-4 py-3 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Watchlist Preview */}
        {watchlistMovies.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" /> My Watchlist
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {watchlistMovies.slice(0, 6).map(m => (
                <div
                  key={m.id}
                  className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 cursor-pointer hover:ring-2 hover:ring-red-500 transition-all"
                  onClick={() => navigate(`/player/${m.id}`)}
                >
                  <img src={m.poster} alt={m.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            {watchlistMovies.length > 6 && (
              <button
                onClick={() => navigate('/watchlist')}
                className="mt-3 text-red-400 text-sm hover:text-red-300 transition-colors"
              >
                View all →
              </button>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-gray-900 border border-gray-800 hover:border-red-500/50 text-red-400 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  );
}
