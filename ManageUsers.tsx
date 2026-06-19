import { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User } from 'lucide-react';
import { User as UserType } from '../../types';
import * as storage from '../../utils/storage';
import { useApp } from '../../context/AppContext';
import { Pagination } from '../../components/SharedUI';

export default function ManageUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useApp();
  const itemsPerPage = 8;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(storage.getUsers());
  };

  const filteredUsers = searchQuery
    ? users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : users;

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user?.isAdmin) {
      showToast('Cannot delete admin user', 'error');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      storage.deleteUser(id);
      loadUsers();
      showToast('User deleted', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Users Management</h2>
        <p className="text-gray-500 text-sm">{users.length} total users</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          placeholder="Search users..."
          className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedUsers.map(user => (
          <div key={user.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 ${
              user.isAdmin
                ? 'bg-gradient-to-br from-red-500 to-orange-500'
                : 'bg-gradient-to-br from-blue-500 to-purple-500'
            }`}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white font-medium text-sm truncate">{user.username}</p>
                {user.isAdmin && (
                  <span className="flex items-center gap-1 bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {user.watchlist.length} watchlist</span>
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {!user.isAdmin && (
              <button
                onClick={() => handleDelete(user.id)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
                title="Delete user"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">No users found</div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
