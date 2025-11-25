/**
 * Student Bookmarks Page
 * Saved resources and favorites
 */

import { useState, useEffect } from 'react';
import {
  BookMarked,
  Search,
  Trash2,
  ExternalLink,
  FileText,
  Video,
  Link as LinkIcon,
  BookOpen,
  Star,
  Folder,
  Filter,
} from 'lucide-react';

const StudentBookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const sampleBookmarks = [
      { id: 1, title: 'Formulaire Mathématiques', type: 'pdf', category: 'Mathématiques', url: '/resources/math-formulas.pdf', addedAt: '2024-12-15', color: '#3B82F6' },
      { id: 2, title: 'Vidéo - Intégrales', type: 'video', category: 'Mathématiques', url: '/resources/integrales.mp4', addedAt: '2024-12-14', color: '#3B82F6' },
      { id: 3, title: 'Simulation PhET - Optique', type: 'link', category: 'Physique', url: 'https://phet.colorado.edu', addedAt: '2024-12-13', color: '#8B5CF6' },
      { id: 4, title: 'Cours - Romantisme', type: 'pdf', category: 'Français', url: '/resources/romantisme.pdf', addedAt: '2024-12-12', color: '#EF4444' },
      { id: 5, title: 'Documentation Python', type: 'link', category: 'Informatique', url: 'https://docs.python.org', addedAt: '2024-12-11', color: '#6366F1' },
      { id: 6, title: 'Carte interactive WWII', type: 'link', category: 'Histoire', url: 'https://www.arcgis.com', addedAt: '2024-12-10', color: '#EC4899' },
      { id: 7, title: 'Exercices corrigés', type: 'pdf', category: 'Mathématiques', url: '/resources/exercices.pdf', addedAt: '2024-12-09', color: '#3B82F6' },
      { id: 8, title: 'Tutoriel Git', type: 'video', category: 'Informatique', url: '/resources/git.mp4', addedAt: '2024-12-08', color: '#6366F1' },
    ];
    
    setTimeout(() => {
      setBookmarks(sampleBookmarks);
      setLoading(false);
    }, 500);
  }, []);

  const categories = [...new Set(bookmarks.map(b => b.category))];

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const getTypeIcon = (type) => {
    const icons = { pdf: FileText, video: Video, link: LinkIcon };
    return icons[type] || BookOpen;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes favoris</h1>
          <p className="text-gray-500">{bookmarks.length} éléments sauvegardés</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 w-64"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Toutes les matières</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map(category => {
          const count = bookmarks.filter(b => b.category === category).length;
          const color = bookmarks.find(b => b.category === category)?.color || '#6B7280';
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                selectedCategory === category ? 'ring-2 ring-emerald-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Folder className="w-5 h-5" style={{ color }} />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-gray-800">{count}</p>
                  <p className="text-xs text-gray-500 truncate">{category}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bookmarks List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            {selectedCategory === 'all' ? 'Tous les favoris' : selectedCategory}
          </h3>
          <span className="text-sm text-gray-500">{filteredBookmarks.length} éléments</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <BookMarked className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun favori trouvé</p>
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => {
              const IconComponent = getTypeIcon(bookmark.type);
              return (
                <div key={bookmark.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${bookmark.color}15` }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: bookmark.color }} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{bookmark.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{bookmark.category}</span>
                        <span>•</span>
                        <span>Ajouté le {bookmark.addedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-emerald-600">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentBookmarksPage;
