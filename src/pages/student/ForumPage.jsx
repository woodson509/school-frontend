/**
 * Student Forum Page
 * Discussion forums for students
 */

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  Eye,
  Clock,
  User,
  Tag,
  ChevronRight,
  Filter,
  TrendingUp,
  CheckCircle,
  Pin,
} from 'lucide-react';

const StudentForumPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);

  const categories = [
    { id: 'math', name: 'Mathématiques', color: '#3B82F6', icon: '📐' },
    { id: 'physics', name: 'Physique', color: '#8B5CF6', icon: '⚛️' },
    { id: 'french', name: 'Français', color: '#EF4444', icon: '📚' },
    { id: 'cs', name: 'Informatique', color: '#6366F1', icon: '💻' },
    { id: 'general', name: 'Général', color: '#10B981', icon: '💬' },
    { id: 'help', name: 'Entraide', color: '#F59E0B', icon: '🤝' },
  ];

  useEffect(() => {
    const sampleTopics = [
      { id: 1, title: 'Comment résoudre les équations différentielles ?', category: 'math', author: 'Marie L.', avatar: 'M', replies: 12, views: 156, likes: 8, createdAt: '2024-12-15', lastReply: 'il y a 2h', solved: true, pinned: true },
      { id: 2, title: 'Besoin d\'aide pour le TP optique', category: 'physics', author: 'Thomas B.', avatar: 'T', replies: 5, views: 89, likes: 3, createdAt: '2024-12-14', lastReply: 'il y a 5h', solved: false, pinned: false },
      { id: 3, title: 'Ressources pour le bac de français', category: 'french', author: 'Sophie D.', avatar: 'S', replies: 23, views: 345, likes: 15, createdAt: '2024-12-13', lastReply: 'il y a 1j', solved: false, pinned: true },
      { id: 4, title: 'Python : erreur "list index out of range"', category: 'cs', author: 'Lucas M.', avatar: 'L', replies: 8, views: 112, likes: 5, createdAt: '2024-12-12', lastReply: 'il y a 3h', solved: true, pinned: false },
      { id: 5, title: 'Groupe de révision pour les partiels', category: 'general', author: 'Emma P.', avatar: 'E', replies: 34, views: 567, likes: 28, createdAt: '2024-12-11', lastReply: 'il y a 30min', solved: false, pinned: false },
      { id: 6, title: 'Quelqu\'un peut m\'expliquer les intégrales ?', category: 'help', author: 'Hugo R.', avatar: 'H', replies: 7, views: 78, likes: 4, createdAt: '2024-12-10', lastReply: 'il y a 6h', solved: true, pinned: false },
    ];
    
    setTimeout(() => {
      setTopics(sampleTopics);
      setLoading(false);
    }, 500);
  }, []);

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedTopics = filteredTopics.filter(t => t.pinned);
  const regularTopics = filteredTopics.filter(t => !t.pinned);

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || { name: 'Autre', color: '#6B7280', icon: '📌' };
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
          <h1 className="text-2xl font-bold text-gray-800">Forum</h1>
          <p className="text-gray-500">Échangez avec vos camarades</p>
        </div>
        <button
          onClick={() => setShowNewTopicModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau sujet
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tous
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedCategory === cat.id 
                ? 'text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un sujet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{topics.length}</p>
              <p className="text-xs text-gray-500">Sujets</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {topics.filter(t => t.solved).length}
              </p>
              <p className="text-xs text-gray-500">Résolus</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {topics.reduce((acc, t) => acc + t.replies, 0)}
              </p>
              <p className="text-xs text-gray-500">Réponses</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {topics.reduce((acc, t) => acc + t.views, 0)}
              </p>
              <p className="text-xs text-gray-500">Vues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Topics */}
      {pinnedTopics.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Pin className="w-4 h-4 text-orange-500" />
            Sujets épinglés
          </h3>
          {pinnedTopics.map(topic => {
            const category = getCategoryInfo(topic.category);
            return (
              <div key={topic.id} className="bg-orange-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                    {topic.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800">{topic.title}</h4>
                          {topic.solved && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Résolu
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span style={{ color: category.color }}>{category.icon} {category.name}</span>
                          <span>par {topic.author}</span>
                          <span>• {topic.lastReply}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{topic.replies}</span>
                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{topic.views}</span>
                        <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />{topic.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Regular Topics */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Discussions récentes</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {regularTopics.map(topic => {
            const category = getCategoryInfo(topic.category);
            return (
              <div key={topic.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` }}
                  >
                    {topic.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-800">{topic.title}</h4>
                          {topic.solved && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Résolu
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span style={{ color: category.color }}>{category.icon} {category.name}</span>
                          <span>par {topic.author}</span>
                          <span>• {topic.lastReply}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{topic.replies}</span>
                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{topic.views}</span>
                        <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />{topic.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Nouveau sujet</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Votre question ou sujet..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Décrivez votre question en détail..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentForumPage;
