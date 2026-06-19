import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, Moon, Sun, LogOut, Heart, Film, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';


export default function Navbar() {
  const { currentUser, logout, theme, toggleTheme, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Hide navbar on admin pages
  if (location.pathname.startsWith('/admin') && location.pathname !== '/admin') return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/20' 
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Film className="w-8 h-8 text-red-500" />
              <span className="text-xl md:text-2xl font-black tracking-tight text-white">
                STREAM<span className="text-red-500">FLIX</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            {!isAuthPage && (
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className={`text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === '/' ? 'text-white' : 'text-gray-400'
                }`}>Home</Link>
                <Link to="/watchlist" className={`text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === '/watchlist' ? 'text-white' : 'text-gray-400'
                }`}>My List</Link>
                <Link to="/search" className={`text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === '/search' ? 'text-white' : 'text-gray-400'
                }`}>Browse</Link>
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Search */}
              {!isAuthPage && (
                <div className="relative">
                  {showSearch ? (
                    <form onSubmit={handleSearch} className="flex items-center">
                      <input
                        ref={searchRef}
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search movies..."
                        className="bg-gray-900/90 border border-gray-600 text-white text-sm rounded-full px-4 py-1.5 w-44 md:w-64 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      />
                      <button type="button" onClick={() => setShowSearch(false)} className="ml-2 text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </form>
                  ) : (
                    <button onClick={() => setShowSearch(true)} className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                      <Search className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* User Menu / Login */}
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-white font-medium">{currentUser.username}</p>
                        <p className="text-gray-400 text-xs">{currentUser.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/watchlist" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <Heart className="w-4 h-4" /> My List
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors w-full text-left">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                !isAuthPage && (
                  <div className="hidden md:flex items-center gap-3">
                    <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                      Sign In
                    </Link>
                    <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
                      Sign Up
                    </Link>
                  </div>
                )
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-gray-900 border-l border-gray-800 shadow-2xl animate-slideRight" onClick={e => e.stopPropagation()}>
            <div className="p-6 pt-20">
              {currentUser && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-lg font-bold">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{currentUser.username}</p>
                    <p className="text-gray-400 text-xs">{currentUser.email}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <Link to="/" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                  <Home className="w-5 h-5" /> Home
                </Link>
                <Link to="/search" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                  <Search className="w-5 h-5" /> Browse
                </Link>
                {currentUser && (
                  <>
                    <Link to="/watchlist" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                      <Heart className="w-5 h-5" /> My List
                    </Link>
                    <Link to="/profile" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                      <User className="w-5 h-5" /> Profile
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
                {currentUser ? (
                  <button onClick={() => { handleLogout(); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setShowMobileMenu(false)} className="block text-center py-2.5 text-gray-300 hover:text-white font-medium transition-colors">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setShowMobileMenu(false)} className="block text-center bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
