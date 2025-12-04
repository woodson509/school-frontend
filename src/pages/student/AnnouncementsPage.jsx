/**
 * Student Announcements Page
 * School announcements and news
 */

import { useState, useEffect } from 'react';
import {
  Bell,
  Pin,
  Calendar,
  User,
  ChevronRight,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';

const { announcementAPI } = api;

const StudentAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementAPI.getAll();
      if (res.success) {
        // Transform API data to match component expectations
        const transformed = res.data.map(a => ({
          id: a.id,
          title: a.title,
          content: a.content,
          author: a.created_by_name || 'Administration',
          date: new Date(a.created_at).toLocaleDateString(),
          priority: a.priority,
          pinned: a.is_pinned,
          category: 'Vie scolaire', // Default category as it's not in DB yet
          read: true, // Default to read for now
        }));
        setAnnouncements(transformed);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const pinnedAnnouncements = announcements.filter(a => a.pinned);
  const regularAnnouncements = announcements.filter(a => !a.pinned);

  const filteredAnnouncements = (filter === 'all'
    ? regularAnnouncements
    : regularAnnouncements.filter(a => a.priority === filter)
  );

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Info className="w-5 h-5 text-orange-500" />;
      default: return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-blue-100 text-blue-700',
    };
    const labels = { high: 'Important', medium: 'Moyen', low: 'Info' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority] || styles.medium}`}>
        {labels[priority] || labels.medium}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Annonces</h1>
          <p className="text-gray-500">Restez informé des actualités de l'école</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'high' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
          >
            Importantes
          </button>
        </div>
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Pin className="w-5 h-5 text-orange-500" />
            Épinglées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedAnnouncements.map(announcement => (
              <div
                key={announcement.id}
                className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-l-emerald-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(announcement.priority)}
                    <span className="text-xs text-gray-500">{announcement.category}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{announcement.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {announcement.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {announcement.date}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Toutes les annonces</h2>
        {filteredAnnouncements.map(announcement => (
          <div
            key={announcement.id}
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getPriorityIcon(announcement.priority)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                  {getPriorityBadge(announcement.priority)}
                </div>
                <p className="text-gray-600 mb-3">{announcement.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {announcement.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {announcement.date}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {announcement.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune annonce trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncementsPage;
