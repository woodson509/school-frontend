/**
 * Teacher Profile Page
 * Personal profile and settings
 */

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, Lock, Bell } from 'lucide-react';

const TeacherProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const [profile, setProfile] = useState({
    firstName: 'Marc',
    lastName: 'Dupont',
    email: 'marc.dupont@school.ht',
    phone: '+509 1234-5678',
    subject: 'Mathématiques',
    department: 'Sciences',
    employeeId: 'PROF-2024-001',
    joinDate: '2016-09-01',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
            MD
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-blue-100">Professeur de {profile.subject}</p>
            <p className="text-sm text-blue-100 mt-1">{profile.employeeId}</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {isEditing ? 'Enregistrer' : 'Modifier'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-4 font-medium ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-4 font-medium ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Sécurité
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-4 font-medium ${activeTab === 'notifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Notifications
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={profile.firstName}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={profile.lastName}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Mettre à jour
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Notifications par email</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Nouveaux messages</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
