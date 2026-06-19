// Local Storage utility for StreamFlix
import { Movie, User, Category, Activity } from '../types';
import { defaultMovies } from '../data/movies';
import { defaultCategories } from '../data/movies';

const KEYS = {
  MOVIES: 'streamflix_movies',
  USERS: 'streamflix_users',
  CATEGORIES: 'streamflix_categories',
  CURRENT_USER: 'streamflix_current_user',
  THEME: 'streamflix_theme',
  ACTIVITIES: 'streamflix_activities',
  INITIALIZED: 'streamflix_initialized',
};

// Default admin user
const defaultAdmin: User = {
  id: 'admin-001',
  username: 'white',
  email: 'admin@streamflix.com',
  password: 'white subham 123',
  avatar: '👤',
  watchlist: [],
  continueWatching: [],
  isAdmin: true,
  createdAt: new Date().toISOString(),
};

// Initialize database with default data
export function initializeDatabase(): void {
  const initialized = localStorage.getItem(KEYS.INITIALIZED);
  if (!initialized) {
    localStorage.setItem(KEYS.MOVIES, JSON.stringify(defaultMovies));
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(defaultCategories));
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify([]));
    
    const users: User[] = [defaultAdmin];
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  }
}

// ===== MOVIES =====
export function getMovies(): Movie[] {
  const data = localStorage.getItem(KEYS.MOVIES);
  return data ? JSON.parse(data) : defaultMovies;
}

export function getMovieById(id: string): Movie | undefined {
  const movies = getMovies();
  return movies.find(m => m.id === id);
}

export function addMovie(movie: Movie): void {
  const movies = getMovies();
  movies.push(movie);
  localStorage.setItem(KEYS.MOVIES, JSON.stringify(movies));
  addActivity('add_movie', `Added movie: ${movie.title}`);
}

export function updateMovie(updatedMovie: Movie): void {
  const movies = getMovies();
  const index = movies.findIndex(m => m.id === updatedMovie.id);
  if (index !== -1) {
    movies[index] = updatedMovie;
    localStorage.setItem(KEYS.MOVIES, JSON.stringify(movies));
    addActivity('edit_movie', `Updated movie: ${updatedMovie.title}`);
  }
}

export function deleteMovie(id: string): void {
  const movies = getMovies();
  const movie = movies.find(m => m.id === id);
  const filtered = movies.filter(m => m.id !== id);
  localStorage.setItem(KEYS.MOVIES, JSON.stringify(filtered));
  if (movie) {
    addActivity('delete_movie', `Deleted movie: ${movie.title}`);
  }
}

export function searchMovies(query: string): Movie[] {
  const movies = getMovies();
  const q = query.toLowerCase();
  return movies.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.description.toLowerCase().includes(q) ||
    m.genre.some(g => g.toLowerCase().includes(q))
  );
}

// ===== CATEGORIES =====
export function getCategories(): Category[] {
  const data = localStorage.getItem(KEYS.CATEGORIES);
  return data ? JSON.parse(data) : defaultCategories;
}

export function addCategory(category: Category): void {
  const categories = getCategories();
  categories.push(category);
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
}

export function deleteCategory(id: string): void {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(filtered));
}

// ===== USERS =====
export function getUsers(): User[] {
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.id === id);
}

export function registerUser(username: string, email: string, password: string): User | null {
  const users = getUsers();
  if (users.find(u => u.username === username || u.email === email)) {
    return null; // User already exists
  }
  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    email,
    password,
    avatar: '👤',
    watchlist: [],
    continueWatching: [],
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  addActivity('register', `New user registered: ${username}`);
  return newUser;
}

export function loginUser(username: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    addActivity('login', `User logged in: ${username}`);
    return user;
  }
  return null;
}

export function loginAdmin(username: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password && u.isAdmin);
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    addActivity('admin_login', `Admin logged in: ${username}`);
    return user;
  }
  return null;
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export function logoutUser(): void {
  const user = getCurrentUser();
  if (user) {
    addActivity('logout', `User logged out: ${user.username}`);
  }
  localStorage.removeItem(KEYS.CURRENT_USER);
}

export function updateUser(updatedUser: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    // Update current user if it's the same
    const current = getCurrentUser();
    if (current && current.id === updatedUser.id) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    }
  }
}

export function deleteUser(id: string): void {
  const users = getUsers();
  const user = users.find(u => u.id === id);
  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem(KEYS.USERS, JSON.stringify(filtered));
  if (user) {
    addActivity('delete_user', `Deleted user: ${user.username}`);
  }
}

// ===== WATCHLIST =====
export function toggleWatchlist(userId: string, movieId: string): boolean {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return false;
  
  const index = user.watchlist.indexOf(movieId);
  if (index === -1) {
    user.watchlist.push(movieId);
    addActivity('add_watchlist', `Added movie to watchlist`);
  } else {
    user.watchlist.splice(index, 1);
  }
  
  updateUser(user);
  return true;
}

export function isInWatchlist(userId: string, movieId: string): boolean {
  const user = getUserById(userId);
  if (!user) return false;
  return user.watchlist.includes(movieId);
}

// ===== CONTINUE WATCHING =====
export function updateProgress(userId: string, movieId: string, progress: number): void {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  const existing = user.continueWatching.find(cw => cw.movieId === movieId);
  if (existing) {
    existing.progress = progress;
    existing.timestamp = new Date().toISOString();
  } else {
    user.continueWatching.unshift({
      movieId,
      progress,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 10
    if (user.continueWatching.length > 10) {
      user.continueWatching = user.continueWatching.slice(0, 10);
    }
  }
  
  updateUser(user);
}

// ===== THEME =====
export function getTheme(): 'dark' | 'light' {
  const data = localStorage.getItem(KEYS.THEME);
  return (data as 'dark' | 'light') || 'dark';
}

export function setTheme(theme: 'dark' | 'light'): void {
  localStorage.setItem(KEYS.THEME, theme);
}

// ===== ACTIVITIES =====
export function getActivities(): Activity[] {
  const data = localStorage.getItem(KEYS.ACTIVITIES);
  return data ? JSON.parse(data) : [];
}

export function addActivity(action: string, detail: string): void {
  const activities = getActivities();
  activities.unshift({
    id: `activity-${Date.now()}`,
    action,
    detail,
    timestamp: new Date().toISOString(),
  });
  // Keep only last 50
  if (activities.length > 50) {
    activities.length = 50;
  }
  localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(activities));
}

// ===== STATS =====
export function getStats() {
  const movies = getMovies();
  const users = getUsers();
  const activities = getActivities();
  
  return {
    totalMovies: movies.length,
    totalUsers: users.length,
    totalCategories: getCategories().length,
    totalActivities: activities.length,
    avgRating: movies.length > 0 
      ? (movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1) 
      : '0',
    recentActivities: activities.slice(0, 10),
  };
}
