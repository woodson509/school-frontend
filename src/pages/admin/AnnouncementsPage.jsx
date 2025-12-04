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
  CheckCircle,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';

const { announcementAPI } = api;

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementAPI.getAll();
      if (res.success) {
        setAnnouncements(res.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority] || styles.medium}`}>
        {labels[priority] || labels.medium}
      </span>
    );
  };

  const getStatusBadge = (isPublished) => {
    return isPublished ? (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Publié
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        Brouillon
      </span>
    );
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await announcementAPI.delete(id);
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const togglePin = async (announcement) => {
    try {
      await announcementAPI.update(announcement.id, { is_pinned: !announcement.is_pinned });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
          onClick={() => { setEditingAnnouncement(null); setShowModal(true); }}
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
                {announcements.filter(a => a.is_published).length}
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
                {announcements.filter(a => a.is_pinned).length}
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
              <p className="text-2xl font-bold text-gray-800">0</p>
              <p className="text-sm text-gray-500">Vues totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {/* Pinned */}
        {filteredAnnouncements.filter(a => a.is_pinned).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Annonces épinglées</h3>
            {filteredAnnouncements.filter(a => a.is_pinned).map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onEdit={() => { setEditingAnnouncement(announcement); setShowModal(true); }}
                onDelete={() => handleDelete(announcement.id)}
                onTogglePin={() => togglePin(announcement)}
                getPriorityBadge={getPriorityBadge}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        )}

        {/* Regular */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Toutes les annonces</h3>
          {filteredAnnouncements.filter(a => !a.is_pinned).map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onEdit={() => { setEditingAnnouncement(announcement); setShowModal(true); }}
              onDelete={() => handleDelete(announcement.id)}
              onTogglePin={() => togglePin(announcement)}
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
          onSave={async (data) => {
            try {
              if (editingAnnouncement) {
                await announcementAPI.update(editingAnnouncement.id, data);
              } else {
                await announcementAPI.create(data);
              }
              fetchAnnouncements();
              setShowModal(false);
              setEditingAnnouncement(null);
            } catch (error) {
              console.error('Error saving announcement:', error);
            }
          }}
        />
      )}
    </div>
  );
};

const AnnouncementCard = ({ announcement, onEdit, onDelete, onTogglePin, getPriorityBadge, getStatusBadge }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 ${announcement.is_pinned ? 'border-l-4 border-orange-500' : ''}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-gray-800 text-lg">{announcement.title}</h3>
          {announcement.is_pinned && <Pin className="w-4 h-4 text-orange-500" />}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>
        <div className="flex flex-wrap items-center gap-3">
          {getPriorityBadge(announcement.priority)}
          {getStatusBadge(announcement.is_published)}
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            {announcement.target_audience === 'all' ? 'Tous' : announcement.target_audience}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {new Date(announcement.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={onTogglePin}
          className={`p-2 rounded-lg ${announcement.is_pinned ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-400'}`}
          title={announcement.is_pinned ? 'Désépingler' : 'Épingler'}
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
    target_audience: announcement?.target_audience || 'all',
    priority: announcement?.priority || 'medium',
    is_published: announcement?.is_published ?? true,
    is_pinned: announcement?.is_pinned || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {announcement ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous</option>
                <option value="students">Étudiants</option>
                <option value="teachers">Professeurs</option>
                <option value="parents">Parents</option>
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
                value={formData.is_published ? 'published' : 'draft'}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.value === 'published' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publier</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinned"
              checked={formData.is_pinned}
              onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="pinned" className="text-sm text-gray-700">Épingler cette annonce</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {announcement ? 'Mettre à jour' : 'Publier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
