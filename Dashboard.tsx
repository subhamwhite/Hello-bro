import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Film, Users, Tags, LogOut, Menu, X,
  BarChart3, Activity, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import * as storage from '../../utils/storage';

// ===== ADMIN LAYOUT =====
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, showToast } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  if (!currentUser || !currentUser.isAdmin) return null;

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/movies', label: 'Movies', icon: Film },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/categories', label: 'Categories', icon: Tags },
  ];

  const handleLogout = () => {
    logout();
    showToast('Admin logged out', 'info');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <Film className="w-7 h-7 text-red-500" />
            <span className="text-lg font-black text-white">
              STREAM<span className="text-red-500">FLIX</span>
            </span>
          </Link>
          <p className="text-gray-500 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-red-600/20 text-red-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm transition-colors">
            ← Back to Site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors w-full">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 animate-slideRight" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-7 h-7 text-red-500" />
                <span className="text-lg font-black text-white">
                  STREAM<span className="text-red-500">FLIX</span>
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-red-600/20 text-red-400'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
              <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm transition-colors">
                ← Back to Site
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors w-full">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-white font-bold text-lg">
              {navItems.find(n => location.pathname === n.path)?.label || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// ===== DASHBOARD PAGE =====
export default function AdminDashboard() {
  const stats = storage.getStats();
  const activities = storage.getActivities().slice(0, 8);

  const statCards = [
    { label: 'Total Movies', value: stats.totalMovies, icon: Film, color: 'from-red-500 to-orange-500', bgColor: 'bg-red-500/10' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10' },
    { label: 'Categories', value: stats.totalCategories, icon: Tags, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10' },
    { label: 'Avg Rating', value: stats.avgRating, icon: BarChart3, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500/10' },
  ];

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 bg-gradient-to-r ${card.color} bg-clip-text`} style={{ color: card.color.includes('red') ? '#ef4444' : card.color.includes('blue') ? '#3b82f6' : card.color.includes('green') ? '#22c55e' : '#a855f7' }} />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-2xl font-black text-white">{card.value}</p>
            <p className="text-gray-500 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/movies" className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-red-500/30 transition-colors group">
          <Film className="w-6 h-6 text-red-400 mb-2" />
          <h3 className="text-white font-bold text-sm group-hover:text-red-400 transition-colors">Manage Movies</h3>
          <p className="text-gray-500 text-xs mt-1">Add, edit, or remove movies</p>
        </Link>
        <Link to="/admin/users" className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500/30 transition-colors group">
          <Users className="w-6 h-6 text-blue-400 mb-2" />
          <h3 className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">Manage Users</h3>
          <p className="text-gray-500 text-xs mt-1">View and manage user accounts</p>
        </Link>
        <Link to="/admin/categories" className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-500/30 transition-colors group">
          <Tags className="w-6 h-6 text-green-400 mb-2" />
          <h3 className="text-white font-bold text-sm group-hover:text-green-400 transition-colors">Categories</h3>
          <p className="text-gray-500 text-xs mt-1">Manage movie categories</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-400" /> Recent Activity
        </h3>
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {activities.map(a => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm">{a.detail}</p>
                  <p className="text-gray-600 text-xs">{formatTime(a.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
