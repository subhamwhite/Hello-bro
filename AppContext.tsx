// Combined application context for StreamFlix
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Toast as ToastType, ThemeMode } from '../types';
import * as storage from '../utils/storage';

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (username: string, password: string) => User | null;
  adminLogin: (username: string, password: string) => User | null;
  register: (username: string, email: string, password: string) => User | null;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
  toggleWatchlist: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;
  updateProgress: (movieId: string, progress: number) => void;
  
  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;
  
  // Toast
  toasts: ToastType[];
  showToast: (message: string, type?: ToastType['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Initialize database on mount
  useEffect(() => {
    storage.initializeDatabase();
    const user = storage.getCurrentUser();
    if (user) setCurrentUser(user);
    const savedTheme = storage.getTheme();
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Auth functions
  const login = useCallback((username: string, password: string) => {
    const user = storage.loginUser(username, password);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  }, []);

  const adminLogin = useCallback((username: string, password: string) => {
    const user = storage.loginAdmin(username, password);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  }, []);

  const register = useCallback((username: string, email: string, password: string) => {
    const user = storage.registerUser(username, email, password);
    if (user) {
      setCurrentUser(user);
      storage.loginUser(username, password);
      return user;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    storage.logoutUser();
    setCurrentUser(null);
  }, []);

  const updateCurrentUser = useCallback((user: User) => {
    storage.updateUser(user);
    setCurrentUser(user);
  }, []);

  const toggleWatchlist = useCallback((movieId: string) => {
    if (!currentUser) return;
    storage.toggleWatchlist(currentUser.id, movieId);
    // Refresh user data
    const updatedUser = storage.getUserById(currentUser.id);
    if (updatedUser) setCurrentUser(updatedUser);
  }, [currentUser]);

  const isInWatchlist = useCallback((movieId: string) => {
    if (!currentUser) return false;
    return storage.isInWatchlist(currentUser.id, movieId);
  }, [currentUser]);

  const updateProgress = useCallback((movieId: string, progress: number) => {
    if (!currentUser) return;
    storage.updateProgress(currentUser.id, movieId, progress);
    const updatedUser = storage.getUserById(currentUser.id);
    if (updatedUser) setCurrentUser(updatedUser);
  }, [currentUser]);

  // Theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    storage.setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, [theme]);

  // Toast
  const showToast = useCallback((message: string, type: ToastType['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      adminLogin,
      register,
      logout,
      updateCurrentUser,
      toggleWatchlist,
      isInWatchlist,
      updateProgress,
      theme,
      toggleTheme,
      toasts,
      showToast,
      removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
