// Core type definitions for StreamFlix

export interface Movie {
  id: string;
  title: string;
  description: string;
  rating: number;
  genre: string[];
  releaseYear: number;
  duration: string;
  poster: string;
  backdrop: string;
  videoUrl: string;
  featured: boolean;
  trending: boolean;
  latest: boolean;
  topRated: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  watchlist: string[];
  continueWatching: ContinueWatchingItem[];
  isAdmin: boolean;
  createdAt: string;
}

export interface ContinueWatchingItem {
  movieId: string;
  progress: number; // 0-100 percentage
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Activity {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  userId?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export type ThemeMode = 'dark' | 'light';
