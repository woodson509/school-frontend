/**
 * Roles & Permissions Page
 * Manage user roles and access permissions
 * Connected to backend API
 */

import { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Users,
  Eye,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { roleAPI, permissionAPI } from '../../services/api';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await roleAPI.getAll();
      if (response.success) {
        setRoles(response.data);
      } else {
        setError('Failed to fetch roles');
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await permissionAPI.getAll();
      if (response.success) {
        setPermissions(response.data);
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
    }
  };

  const handleViewPermissions = async (role) => {
    try {
      const response = await roleAPI.getById(role.id);
      if (response.success) {
        setSelectedRole(response.data);
      }
    } catch (err) {
      console.error('Error fetching role permissions:', err);
      alert('Erreur lors du chargement des permissions');
    }
  };

  const handleDelete = async (role) => {
    if (role.is_system) {
      alert('Impossible de supprimer un rôle système');
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer le rôle "${role.name}" ?`)) return;

    try {
      const response = await roleAPI.delete(role.id);
      if (response.success) {
        fetchRoles();
      } else {
        alert(response.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleSaveRole = async (roleData) => {
    try {
      let response;
      if (editingRole) {
        response = await roleAPI.update(editingRole.id, roleData);
      } else {
        response = await roleAPI.create(roleData);
      }

      if (response.success) {
        fetchRoles();
        setShowModal(false);
        setEditingRole(null);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert('Erreur: ' + err.message);
      throw err;
    }
  };

  const handleUpdatePermissions = async (roleId, selectedPermissionIds) => {
    try {
      const response = await roleAPI.updatePermissions(roleId, selectedPermissionIds);
      if (response.success) {
        setShowPermissionsModal(false);
        setSelectedRole(null);
        fetchRoles();
        alert('Permissions mises à jour avec succès');
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  // Group permissions by module
  const permissionGroups = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {});

  const hasPermission = (role, permissionCode) => {
    if (!role.permissions) return false;
    return role.permissions.some(p => p.code === permissionCode);
  };

  if (loading && roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Gérer les rôles et permissions</h2>
          <p className="text-sm text-gray-500">Définissez les droits d'accès pour chaque type d'utilisateur</p>
        </div>
        <button
          onClick={() => { setEditingRole(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau rôle
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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
                    onClick={() => handleViewPermissions(role)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Voir les permissions"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  {!role.is_system && (
                    <>
                      <button
                        onClick={() => { setEditingRole(role); setShowModal(true); }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(role)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{role.description}</p>

              {role.is_system && (
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Rôle système
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{role.user_count || 0} utilisateurs</span>
                </div>
                <span className="text-sm text-gray-500">
                  {role.permission_count || 0} permissions
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Detail Modal */}
      {selectedRole && (
        <PermissionsModal
          role={selectedRole}
          allPermissions={permissions}
          permissionGroups={permissionGroups}
          onClose={() => setSelectedRole(null)}
          onUpdate={handleUpdatePermissions}
        />
      )}

      {/* Create/Edit Role Modal */}
      {showModal && (
        <RoleFormModal
          role={editingRole}
          onClose={() => { setShowModal(false); setEditingRole(null); }}
          onSave={handleSaveRole}
        />
      )}
    </div>
  );
};

// Permissions Modal Component
const PermissionsModal = ({ role, allPermissions, permissionGroups, onClose, onUpdate }) => {
  const [selectedPermissions, setSelectedPermissions] = useState(
    role.permissions?.map(p => p.id) || []
  );

  const togglePermission = (permId) => {
    setSelectedPermissions(prev =>
      prev.includes(permId)
        ? prev.filter(id => id !== permId)
        : [...prev, permId]
    );
  };

  const handleSave = () => {
    onUpdate(role.id, selectedPermissions);
  };

  const hasPermission = (permId) => selectedPermissions.includes(permId);

  const isReadOnly = role.code === 'superadmin';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${role.color}20` }}
            >
              <Shield className="w-6 h-6" style={{ color: role.color }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{role.name}</h3>
              <p className="text-sm text-gray-500">{role.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isReadOnly && (
            <div className="mb-4 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
              ⚠️ Les permissions du SuperAdmin ne peuvent pas être modifiées
            </div>
          )}

          <div className="space-y-6">
            {Object.entries(permissionGroups).map(([module, perms]) => (
              <div key={module} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-700 capitalize">
                  {module}
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {perms.map((perm) => (
                    <label
                      key={perm.id}
                      className={`flex items-center gap-2 p-2 rounded hover:bg-gray-50 ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={hasPermission(perm.id)}
                        onChange={() => !isReadOnly && togglePermission(perm.id)}
                        disabled={isReadOnly}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700 capitalize">{perm.action}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Fermer
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enregistrer les permissions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Role Form Modal Component
const RoleFormModal = ({ role, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    code: role?.code || '',
    description: role?.description || '',
    color: role?.color || '#6366F1',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {role ? 'Modifier le rôle' : 'Nouveau rôle'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du rôle</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ex: manager"
              required
              disabled={!!role}
            />
            {role && (
              <p className="text-xs text-gray-500 mt-1">Le code ne peut pas être modifié</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (role ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolesPage;
