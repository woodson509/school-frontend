/**
 * Teacher Profile Page
 * Personal profile and settings
 */

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, Lock, Bell, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

const TeacherProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    role: '',
    joinDate: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Use data from context first for immediate display
        if (user) {
          setProfile(prev => ({
            ...prev,
            fullName: user.full_name || '',
            email: user.email || '',
            role: user.role || 'Enseignant',
            // Default values for fields that might not be in the token
            phone: user.phone || '',
            subject: 'Général', // To be fetched if available
            joinDate: new Date(user.created_at).toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
          }));
        }

        // Fetch fresh data from backend
        // Note: We might need a specific endpoint for extended teacher profile details
        // For now, we reuse the auth profile which should give us the basics
        const response = await authAPI.getProfile();
        if (response.success) {
          const userData = response.data;
          setProfile({
            fullName: userData.full_name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            role: userData.role === 'teacher' ? 'Professeur' : userData.role,
            subject: userData.subject || 'Général', // Assuming backend might return this
            joinDate: userData.created_at ? new Date(userData.created_at).toISOString().split('T')[0] : '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // TODO: Implement update profile API call
    console.log('Saving profile:', profile);
    setIsEditing(false);
    // await userAPI.update(user.id, profile);
  };

  if (loading && !profile.fullName) {
    return <div className="flex justify-center p-12"><Loader className="animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
            {profile.fullName.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.fullName}</h1>
            <p className="text-blue-100">{profile.role}</p>
            {/* <p className="text-sm text-blue-100 mt-1">ID: {user?.id?.substring(0,8)}</p> */}
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-50"
                  placeholder="+509 ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'inscription</label>
                <input
                  type="text"
                  value={profile.joinDate}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg" disabled={!isEditing} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg" disabled={!isEditing} />
              </div>
              {isEditing && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Mettre à jour le mot de passe
                </button>
              )}
              {!isEditing && <p className="text-sm text-gray-500 italic">Activez le mode modification pour changer le mot de passe.</p>}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Notifications par email</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked disabled={!isEditing} />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Nouveaux messages</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked disabled={!isEditing} />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
