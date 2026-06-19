import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Category } from '../../types';
import * as storage from '../../utils/storage';
import { useApp } from '../../context/AppContext';

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('🎬');
  const { showToast } = useApp();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(storage.getCategories());
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    if (categories.find(c => c.name.toLowerCase() === newName.toLowerCase())) {
      showToast('Category already exists', 'error');
      return;
    }
    storage.addCategory({
      id: `cat-${Date.now()}`,
      name: newName.trim(),
      icon: newIcon,
    });
    loadCategories();
    setNewName('');
    setNewIcon('🎬');
    setShowForm(false);
    showToast('Category added', 'success');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this category?')) {
      storage.deleteCategory(id);
      loadCategories();
      showToast('Category deleted', 'success');
    }
  };

  const commonIcons = ['🎬', '⚔️', '😂', '🎭', '🚀', '👻', '🔪', '❤️', '🎨', '📷', '🧙', '🔍', '🗺️', '🎵', '🏀', '🏆', '🌍', '🔮', '🎪', '🦸'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Categories</h2>
          <p className="text-gray-500 text-sm">{categories.length} total categories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between group hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-white font-medium text-sm">{cat.name}</span>
            </div>
            <button
              onClick={() => handleDelete(cat.id)}
              className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">No categories yet</div>
      )}

      {/* Add Category Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white">Add Category</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Category Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  placeholder="e.g. Action, Comedy..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {commonIcons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewIcon(icon)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                        newIcon === icon ? 'bg-red-600 scale-110' : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-2">
                  <span className="text-xl">{newIcon}</span>
                  <span className="text-white text-sm">{newName || 'Preview'}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
