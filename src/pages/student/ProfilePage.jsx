/**
 * Student Profile Page
 * Personal information and settings
 */

import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit,
  Save,
  Lock,
  Bell,
  Shield,
  Globe,
  Moon,
} from 'lucide-react';

const StudentProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState({
    firstName: 'Jean',
    lastName: 'Pierre',
    email: 'jean.pierre@example.com',
    phone: '+509 1234-5678',
    address: 'Port-au-Prince, Haïti',
    birthDate: '2008-05-15',
    class: '6ème A',
    studentId: 'STU-2024-001',
    enrolledDate: '2024-09-01',
    parentName: 'Marie Pierre',
    parentEmail: 'marie.pierre@example.com',
    parentPhone: '+509 9876-5432',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    grades: true,
    assignments: true,
    announcements: true,
    messages: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'light',
    emailDigest: 'daily',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
              JP
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-emerald-100">{profile.class} • {profile.studentId}</p>
            <p className="text-sm text-emerald-100 mt-1">{profile.email}</p>
          </div>
          <div className="md:ml-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isEditing 
                  ? 'bg-white text-emerald-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Modifier
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'personal'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4 inline-block mr-2" />
              Informations
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'notifications'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bell className="w-4 h-4 inline-block mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'security'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="w-4 h-4 inline-block mr-2" />
              Sécurité
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'preferences'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe className="w-4 h-4 inline-block mr-2" />
              Préférences
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Informations personnelles</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nom</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={profile.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Adresse</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profile.address}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date de naissance</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={profile.birthDate}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Informations scolaires</h3>
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">N° étudiant</span>
                    <span className="font-medium">{profile.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Classe</span>
                    <span className="font-medium">{profile.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Inscrit depuis</span>
                    <span className="font-medium">{profile.enrolledDate}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800 mt-6">Contact parent/tuteur</h3>
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Nom</span>
                    <p className="font-medium">{profile.parentName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <p className="font-medium">{profile.parentEmail}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Téléphone</span>
                    <p className="font-medium">{profile.parentPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="max-w-lg space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Canaux de notification</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>Notifications par email</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      className="w-5 h-5 text-emerald-600 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <span>Notifications push</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                      className="w-5 h-5 text-emerald-600 rounded"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Types de notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'grades', label: 'Nouvelles notes' },
                    { key: 'assignments', label: 'Devoirs à rendre' },
                    { key: 'announcements', label: 'Annonces' },
                    { key: 'messages', label: 'Messages' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <span>{item.label}</span>
                      <input
                        type="checkbox"
                        checked={notifications[item.key]}
                        onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                        className="w-5 h-5 text-emerald-600 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="max-w-lg space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Changer le mot de passe</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Mettre à jour
                  </button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Dernières connexions</h4>
                <div className="space-y-2 text-sm text-yellow-700">
                  <div className="flex justify-between">
                    <span>Chrome - Windows</span>
                    <span>Aujourd'hui, 08:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safari - iPhone</span>
                    <span>Hier, 19:45</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="max-w-lg space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ht">Kreyòl Ayisyen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer ${
                    preferences.theme === 'light' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={preferences.theme === 'light'}
                      onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                      className="sr-only"
                    />
                    <Globe className="w-5 h-5" />
                    Clair
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer ${
                    preferences.theme === 'dark' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={preferences.theme === 'dark'}
                      onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                      className="sr-only"
                    />
                    <Moon className="w-5 h-5" />
                    Sombre
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Résumé par email
                </label>
                <select
                  value={preferences.emailDigest}
                  onChange={(e) => setPreferences({...preferences, emailDigest: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="never">Jamais</option>
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                </select>
              </div>

              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Enregistrer les préférences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
