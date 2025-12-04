/**
 * Teacher Announcements Page
 * Create and manage announcements
 */

import { useState, useEffect } from 'react';
import { Bell, Plus, Edit, Trash2, Pin, Send, Users, Calendar, Loader2 } from 'lucide-react';
import api from '../../services/api';

const { announcementAPI } = api;

const TeacherAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Annonces</h1>
        {/* Future: Add Create Button for Teachers */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total annonces</p>
          <p className="text-2xl font-bold text-gray-800">{announcements.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Publiées</p>
          <p className="text-2xl font-bold text-green-600">{announcements.filter(a => a.is_published).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Épinglées</p>
          <p className="text-2xl font-bold text-yellow-600">{announcements.filter(a => a.is_pinned).length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune annonce pour le moment</p>
          </div>
        ) : (
          announcements.map(announcement => (
            <div key={announcement.id} className={`bg-white rounded-xl shadow-sm p-6 ${announcement.is_pinned ? 'border-l-4 border-l-yellow-500' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {announcement.is_pinned && <Pin className="w-5 h-5 text-yellow-500" />}
                  <div>
                    <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        {announcement.target_audience === 'all' ? 'Tous' : announcement.target_audience}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${announcement.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {announcement.is_published ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{announcement.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherAnnouncementsPage;
