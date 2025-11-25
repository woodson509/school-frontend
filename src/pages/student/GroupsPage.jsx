/**
 * Student Groups Page
 * Study groups and collaboration
 */

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Video,
  MessageCircle,
  UserPlus,
  Crown,
  ChevronRight,
} from 'lucide-react';

const StudentGroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-groups');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const sampleGroups = [
      { id: 1, name: 'Groupe Maths Terminale', subject: 'Mathématiques', members: 8, maxMembers: 10, nextMeeting: '2024-12-16 14:00', location: 'Bibliothèque', isOnline: false, isOwner: true, color: '#3B82F6', description: 'Révision bac maths' },
      { id: 2, name: 'Python Study Group', subject: 'Informatique', members: 5, maxMembers: 8, nextMeeting: '2024-12-17 10:00', location: 'Discord', isOnline: true, isOwner: false, color: '#6366F1', description: 'Apprentissage Python ensemble' },
      { id: 3, name: 'Dissertation Squad', subject: 'Français', members: 4, maxMembers: 6, nextMeeting: '2024-12-18 16:00', location: 'Salle 201', isOnline: false, isOwner: false, color: '#EF4444', description: 'Préparation dissertations' },
    ];

    const discoverGroups = [
      { id: 4, name: 'Physique Quantique Club', subject: 'Physique', members: 6, maxMembers: 12, nextMeeting: '2024-12-19 15:00', location: 'Zoom', isOnline: true, color: '#8B5CF6', description: 'Exploration de la physique quantique' },
      { id: 5, name: 'Histoire du XXème siècle', subject: 'Histoire', members: 3, maxMembers: 8, nextMeeting: '2024-12-20 11:00', location: 'CDI', isOnline: false, color: '#EC4899', description: 'Fiches et révisions histoire' },
      { id: 6, name: 'English Conversation', subject: 'Anglais', members: 7, maxMembers: 10, nextMeeting: '2024-12-16 17:00', location: 'Google Meet', isOnline: true, color: '#F59E0B', description: 'Pratique orale en anglais' },
    ];
    
    setTimeout(() => {
      setGroups(activeTab === 'my-groups' ? sampleGroups : discoverGroups);
      setLoading(false);
    }, 500);
  }, [activeTab]);

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
          <h1 className="text-2xl font-bold text-gray-800">Groupes d'étude</h1>
          <p className="text-gray-500">Collaborez et révisez ensemble</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          Créer un groupe
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('my-groups')}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === 'my-groups'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Mes groupes
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === 'discover'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Découvrir
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un groupe..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">3</p>
              <p className="text-xs text-gray-500">Mes groupes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">2</p>
              <p className="text-xs text-gray-500">Réunions cette semaine</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">12h</p>
              <p className="text-xs text-gray-500">Temps d'étude en groupe</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">45</p>
              <p className="text-xs text-gray-500">Messages échangés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-2" style={{ backgroundColor: group.color }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${group.color}20` }}
                >
                  <Users className="w-6 h-6" style={{ color: group.color }} />
                </div>
                {group.isOwner && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    <Crown className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-gray-800 mb-1">{group.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{group.subject}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{group.description}</p>

              {/* Members */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(group.members, 4))].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                      style={{ backgroundColor: `hsl(${i * 60}, 70%, 60%)` }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {group.members > 4 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      +{group.members - 4}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {group.members}/{group.maxMembers} membres
                </span>
              </div>

              {/* Next Meeting */}
              {group.nextMeeting && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Prochaine réunion</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{group.nextMeeting.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{group.nextMeeting.split(' ')[1]}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {group.isOnline ? (
                        <Video className="w-4 h-4 text-blue-500" />
                      ) : (
                        <MapPin className="w-4 h-4 text-gray-400" />
                      )}
                      <span>{group.location}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {activeTab === 'my-groups' ? (
                  <>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{ backgroundColor: `${group.color}10`, color: group.color }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    <UserPlus className="w-4 h-4" />
                    Rejoindre
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Créer un groupe</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du groupe</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: Groupe révision maths"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option>Mathématiques</option>
                  <option>Physique</option>
                  <option>Français</option>
                  <option>Informatique</option>
                  <option>Histoire</option>
                  <option>Anglais</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Décrivez l'objectif du groupe..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre max de membres</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option>4</option>
                  <option>6</option>
                  <option>8</option>
                  <option>10</option>
                  <option>12</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGroupsPage;
