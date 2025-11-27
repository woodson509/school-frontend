/**
 * Users Management Page for Admin
 * Allows creating and managing teachers and students for the school
 */

import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    Edit,
    Trash2,
    Filter,
    Download,
    Mail,
    Shield,
    School,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { userAPI } from '../../services/api';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAll();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        // Filter out superadmins and agents if they appear, though backend should handle this
        const isRelevantRole = ['teacher', 'student', 'admin'].includes(user.role);
        return matchesSearch && matchesRole && isRelevantRole;
    });

    const handleDelete = async (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await userAPI.delete(id);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Erreur lors de la suppression de l\'utilisateur');
            }
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-700',
            teacher: 'bg-blue-100 text-blue-700',
            student: 'bg-green-100 text-green-700',
        };
        const labels = {
            admin: 'Administrateur',
            teacher: 'Enseignant',
            student: 'Étudiant',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
                {labels[role] || role}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="teacher">Enseignants</option>
                        <option value="student">Étudiants</option>
                        <option value="admin">Administrateurs</option>
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        Exporter
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                        Nouvel utilisateur
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                            <p className="text-sm text-gray-500">Total utilisateurs</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">
                                {users.filter(u => u.role === 'student').length}
                            </p>
                            <p className="text-sm text-gray-500">Étudiants</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">
                                {users.filter(u => u.role === 'teacher').length}
                            </p>
                            <p className="text-sm text-gray-500">Enseignants</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date d'ajout</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                                            {user.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{user.full_name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {user.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => { setEditingUser(user); setShowModal(true); }}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                            title="Modifier"
                                        >
                                            <Edit className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <UserModal
                    user={editingUser}
                    onClose={() => { setShowModal(false); setEditingUser(null); }}
                    onSave={async (data) => {
                        try {
                            if (editingUser) {
                                await userAPI.update(editingUser.id, data);
                            } else {
                                await userAPI.create(data);
                            }
                            fetchUsers(); // Refresh list
                            setShowModal(false);
                            setEditingUser(null);
                        } catch (error) {
                            console.error('Error saving user:', error);
                            alert('Erreur lors de l\'enregistrement de l\'utilisateur');
                        }
                    }}
                />
            )}
        </div>
    );
};

const UserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        password: '', // Only for new users or password reset
        role: user?.role || 'student',
    });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {!user && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required={!user}
                                minLength={6}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={user && user.role === 'admin'} // Prevent changing admin role to something else if needed, or allow it.
                        >
                            <option value="student">Étudiant</option>
                            <option value="teacher">Enseignant</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Annuler
                        </button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            {user ? 'Mettre à jour' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsersPage;
