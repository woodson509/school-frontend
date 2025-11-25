/**
 * Announcements Page
 * Create and manage school announcements
 */

import { useState, useEffect } from 'react';
import {
  Megaphone,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  Pin,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  useEffect(() => {
    const sampleAnnouncements = [
      { id: 1, title: 'Vacances de Noël 2024', content: 'Les vacances de Noël commenceront le 21 décembre...', audience: 'Tous', priority: 'high', status: 'published', pinned: true, date: '2024-12-10', views: 450 },
      { id: 2, title: 'Réunion parents-professeurs', content: 'Une réunion parents-professeurs aura lieu le 15 décembre...', audience: 'Parents', priority: 'medium', status: 'published', pinned: true, date: '2024-12-08', views: 280 },
      { id: 3, title: 'Examens de fin de trimestre', content: 'Les examens de fin de trimestre débuteront le 16 décembre...', audience: 'Étudiants', priority: 'high', status: 'published', pinned: false, date: '2024-12-05', views: 520 },
      { id: 4, title: 'Nouvelle bibliothèque numérique', content: 'Nous sommes heureux d\'annoncer l\'ouverture de notre bibliothèque...', audience: 'Tous', priority: 'low', status: 'published', pinned: false, date: '2024-12-01', views: 180 },
      { id: 5, title: 'Journée sportive', content: 'Une journée sportive sera organisée le 20 décembre...', audience: 'Étudiants', priority: 'medium', status: 'draft', pinned: false, date: '2024-12-12', views: 0 },
      { id: 6, title: 'Changement d\'horaires', content: 'À partir de janvier, les horaires seront modifiés...', audience: 'Tous', priority: 'medium', status: 'scheduled', pinned: false, date: '2024-12-20', views: 0 },
    ];
    
    setTimeout(() => {
      setAnnouncements(sampleAnnouncements);
      setLoading(false);
    }, 500);
  }, []);

  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-green-100 text-green-700',
    };
    const labels = { high: 'Haute', medium: 'Moyenne', low: 'Basse' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-gray-100 text-gray-700',
      scheduled: 'bg-blue-100 text-blue-700',
    };
    const labels = { published: 'Publié', draft: 'Brouillon', scheduled: 'Programmé' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  const togglePin = (id) => {
    setAnnouncements(announcements.map(a =>
      a.id === id ? { ...a, pinned: !a.pinned } : a
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle annonce
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{announcements.length}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {announcements.filter(a => a.status === 'published').length}
              </p>
              <p className="text-sm text-gray-500">Publiées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Pin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {announcements.filter(a => a.pinned).length}
              </p>
              <p className="text-sm text-gray-500">Épinglées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {announcements.reduce((acc, a) => acc + a.views, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Vues totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {/* Pinned */}
        {filteredAnnouncements.filter(a => a.pinned).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Annonces épinglées</h3>
            {filteredAnnouncements.filter(a => a.pinned).map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onEdit={() => { setEditingAnnouncement(announcement); setShowModal(true); }}
                onDelete={() => handleDelete(announcement.id)}
                onTogglePin={() => togglePin(announcement.id)}
                getPriorityBadge={getPriorityBadge}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        )}

        {/* Regular */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Toutes les annonces</h3>
          {filteredAnnouncements.filter(a => !a.pinned).map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onEdit={() => { setEditingAnnouncement(announcement); setShowModal(true); }}
              onDelete={() => handleDelete(announcement.id)}
              onTogglePin={() => togglePin(announcement.id)}
              getPriorityBadge={getPriorityBadge}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AnnouncementModal
          announcement={editingAnnouncement}
          onClose={() => { setShowModal(false); setEditingAnnouncement(null); }}
          onSave={(data) => {
            if (editingAnnouncement) {
              setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? { ...a, ...data } : a));
            } else {
              setAnnouncements([{ ...data, id: Date.now(), views: 0, date: new Date().toISOString().split('T')[0] }, ...announcements]);
            }
            setShowModal(false);
            setEditingAnnouncement(null);
          }}
        />
      )}
    </div>
  );
};

const AnnouncementCard = ({ announcement, onEdit, onDelete, onTogglePin, getPriorityBadge, getStatusBadge }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 ${announcement.pinned ? 'border-l-4 border-orange-500' : ''}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-gray-800 text-lg">{announcement.title}</h3>
          {announcement.pinned && <Pin className="w-4 h-4 text-orange-500" />}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>
        <div className="flex flex-wrap items-center gap-3">
          {getPriorityBadge(announcement.priority)}
          {getStatusBadge(announcement.status)}
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            {announcement.audience}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {announcement.date}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Eye className="w-4 h-4" />
            {announcement.views} vues
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={onTogglePin}
          className={`p-2 rounded-lg ${announcement.pinned ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-400'}`}
          title={announcement.pinned ? 'Désépingler' : 'Épingler'}
        >
          <Pin className="w-4 h-4" />
        </button>
        <button onClick={onEdit} className="p-2 hover:bg-gray-100 rounded-lg">
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
        <button onClick={onDelete} className="p-2 hover:bg-gray-100 rounded-lg">
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  </div>
);

const AnnouncementModal = ({ announcement, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: announcement?.title || '',
    content: announcement?.content || '',
    audience: announcement?.audience || 'Tous',
    priority: announcement?.priority || 'medium',
    status: announcement?.status || 'draft',
    pinned: announcement?.pinned || false,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {announcement ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
        </h3>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tous">Tous</option>
                <option value="Étudiants">Étudiants</option>
                <option value="Professeurs">Professeurs</option>
                <option value="Parents">Parents</option>
                <option value="Personnel">Personnel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publier</option>
                <option value="scheduled">Programmer</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinned"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="pinned" className="text-sm text-gray-700">Épingler cette annonce</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {announcement ? 'Mettre à jour' : 'Publier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
