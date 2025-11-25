/**
 * Teacher Announcements Page
 * Create and manage announcements
 */

import { useState } from 'react';
import { Bell, Plus, Edit, Trash2, Pin, Send, Users, Calendar } from 'lucide-react';

const TeacherAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Examens de fin de trimestre', content: 'Les examens auront lieu du 16 au 20 décembre. Consultez le calendrier.', target: 'Toutes les classes', date: '2024-12-10', pinned: true, status: 'published' },
    { id: 2, title: 'Réunion parents-professeurs', content: 'La réunion aura lieu le 20 décembre à 18h. Présence obligatoire.', target: '6ème A', date: '2024-12-08', pinned: false, status: 'published' },
    { id: 3, title: 'Nouveau chapitre', content: 'Nous commencerons le chapitre sur les fonctions exponentielles lundi prochain.', target: '5ème B', date: '2024-12-05', pinned: false, status: 'draft' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Mes annonces</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Nouvelle annonce
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total annonces</p>
          <p className="text-2xl font-bold text-gray-800">{announcements.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Publiées</p>
          <p className="text-2xl font-bold text-green-600">{announcements.filter(a => a.status === 'published').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Brouillons</p>
          <p className="text-2xl font-bold text-gray-600">{announcements.filter(a => a.status === 'draft').length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.map(announcement => (
          <div key={announcement.id} className={`bg-white rounded-xl shadow-sm p-6 ${announcement.pinned ? 'border-l-4 border-l-yellow-500' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {announcement.pinned && <Pin className="w-5 h-5 text-yellow-500" />}
                <div>
                  <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      {announcement.target}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {announcement.date}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      announcement.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {announcement.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <p className="text-gray-700">{announcement.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherAnnouncementsPage;
