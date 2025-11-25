/**
 * Roles & Permissions Page
 * Manage user roles and access permissions
 */

import { useState } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Users,
  Lock,
  Unlock,
  Eye,
} from 'lucide-react';

const RolesPage = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Administrateur',
      code: 'admin',
      description: 'Accès complet au système',
      users: 5,
      color: '#EF4444',
      permissions: ['all'],
    },
    {
      id: 2,
      name: 'Professeur',
      code: 'teacher',
      description: 'Gestion des cours et notes',
      users: 45,
      color: '#3B82F6',
      permissions: ['courses.view', 'courses.edit', 'grades.view', 'grades.edit', 'attendance.view', 'attendance.edit', 'students.view'],
    },
    {
      id: 3,
      name: 'Étudiant',
      code: 'student',
      description: 'Accès aux cours et examens',
      users: 980,
      color: '#10B981',
      permissions: ['courses.view', 'exams.view', 'grades.view'],
    },
    {
      id: 4,
      name: 'Agent',
      code: 'agent',
      description: 'Gestion des ventes',
      users: 12,
      color: '#8B5CF6',
      permissions: ['sales.view', 'sales.create', 'schools.view'],
    },
    {
      id: 5,
      name: 'Parent',
      code: 'parent',
      description: 'Suivi des enfants',
      users: 320,
      color: '#F59E0B',
      permissions: ['grades.view', 'attendance.view', 'announcements.view'],
    },
  ]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const permissionGroups = [
    {
      name: 'Utilisateurs',
      key: 'users',
      permissions: ['view', 'create', 'edit', 'delete'],
    },
    {
      name: 'Cours',
      key: 'courses',
      permissions: ['view', 'create', 'edit', 'delete'],
    },
    {
      name: 'Examens',
      key: 'exams',
      permissions: ['view', 'create', 'edit', 'delete'],
    },
    {
      name: 'Notes',
      key: 'grades',
      permissions: ['view', 'create', 'edit', 'delete'],
    },
    {
      name: 'Présences',
      key: 'attendance',
      permissions: ['view', 'create', 'edit', 'delete'],
    },
    {
      name: 'Ventes',
      key: 'sales',
      permissions: ['view', 'create', 'edit', 'delete'],
    },
    {
      name: 'Écoles',
      key: 'schools',
      permissions: ['view', 'create', 'edit', 'delete'],
    },
    {
      name: 'Annonces',
      key: 'announcements',
      permissions: ['view', 'create', 'edit', 'delete'],
    },
    {
      name: 'Rapports',
      key: 'reports',
      permissions: ['view', 'export'],
    },
    {
      name: 'Paramètres',
      key: 'settings',
      permissions: ['view', 'edit'],
    },
  ];

  const hasPermission = (role, permission) => {
    if (role.permissions.includes('all')) return true;
    return role.permissions.includes(permission);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Gérer les rôles et permissions</h2>
          <p className="text-sm text-gray-500">Définissez les droits d'accès pour chaque type d'utilisateur</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau rôle
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-2" style={{ backgroundColor: role.color }}></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${role.color}20` }}
                  >
                    <Shield className="w-6 h-6" style={{ color: role.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedRole(role)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  {role.code !== 'admin' && (
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{role.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{role.users} utilisateurs</span>
                </div>
                <span className="text-sm text-gray-500">
                  {role.permissions.includes('all') ? 'Accès complet' : `${role.permissions.length} permissions`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Detail Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${selectedRole.color}20` }}
                >
                  <Shield className="w-6 h-6" style={{ color: selectedRole.color }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedRole.name}</h3>
                  <p className="text-sm text-gray-500">{selectedRole.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Permissions</h4>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Module</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Voir</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Créer</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Modifier</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Supprimer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {permissionGroups.map((group) => (
                      <tr key={group.key}>
                        <td className="px-4 py-3 font-medium text-gray-700">{group.name}</td>
                        {['view', 'create', 'edit', 'delete'].map((action) => (
                          <td key={action} className="px-4 py-3 text-center">
                            {group.permissions.includes(action) ? (
                              hasPermission(selectedRole, `${group.key}.${action}`) ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-300 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedRole(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Modifier les permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Nouveau rôle</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du rôle</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: manager"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                <input
                  type="color"
                  className="w-full h-10 rounded-lg cursor-pointer"
                  defaultValue="#6366F1"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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

export default RolesPage;
