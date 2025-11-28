/**
 * Users Management Page for Admin
 * Allows creating and managing teachers and students for the school with extended fields
 */

import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    Edit,
    Trash2,
    Download,
    Mail,
    Phone as PhoneIcon,
    GraduationCap,
    Briefcase,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Award,
    Shield
} from 'lucide-react';
import { userAPI, classAPI } from '../../services/api';
import UserFormModal from '../../components/admin/UserFormModal';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersResponse, classesResponse] = await Promise.all([
                userAPI.getAll(),
                classAPI.getAll()
            ]);

            if (usersResponse.success) {
                setUsers(usersResponse.data);
            }
            if (classesResponse.success) {
                setClasses(classesResponse.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.student_id_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        let matchesStatus = true;
        if (statusFilter === 'active') {
            matchesStatus = user.is_active !== false;
        } else if (statusFilter === 'inactive') {
            matchesStatus = user.is_active === false;
        }

        // Filter out superadmins and agents
        const isRelevantRole = ['teacher', 'student', 'admin'].includes(user.role);

        return matchesSearch && matchesRole && matchesStatus && isRelevantRole;
    });

    const handleSave = async (data) => {
        try {
            if (editingUser) {
                await userAPI.update(editingUser.id, data);
            } else {
                await userAPI.create(data);
            }
            fetchData();
            setShowModal(false);
            setEditingUser(null);
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Erreur lors de l\'enregistrement: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await userAPI.delete(id);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Erreur lors de la suppression');
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
        const icons = {
            admin: Shield,
            teacher: Briefcase,
            student: GraduationCap,
        };
        const Icon = icons[role] || Users;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
                <Icon className="w-3 h-3" />
                {labels[role] || role}
            </span>
        );
    };

    const getStatusBadge = (user) => {
        if (user.is_active === false) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <XCircle className="w-3 h-3" />
                    Inactif
                </span>
            );
        }

        if (user.role === 'student' && user.enrollment_status) {
            const statusMap = {
                active: { label: 'Actif', color: 'bg-green-100 text-green-700', icon: CheckCircle },
                suspended: { label: 'Suspendu', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
                graduated: { label: 'Diplômé', color: 'bg-blue-100 text-blue-700', icon: Award },
                withdrawn: { label: 'Retiré', color: 'bg-gray-100 text-gray-700', icon: XCircle },
                transferred: { label: 'Transféré', color: 'bg-purple-100 text-purple-700', icon: Clock },
            };
            const status = statusMap[user.enrollment_status] || statusMap.active;
            const Icon = status.icon;

            return (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    <Icon className="w-3 h-3" />
                    {status.label}
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3" />
                Actif
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
                            placeholder="Rechercher (nom, email, matricule)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-80"
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
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="inactive">Inactifs</option>
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        Exporter
                    </button>
                    <button
                        onClick={() => { setEditingUser(null); setShowModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                        Nouvel utilisateur
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{filteredUsers.length}</p>
                            <p className="text-sm text-gray-500">Total</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-green-600" />
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
                            <Briefcase className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">
                                {users.filter(u => u.role === 'teacher').length}
                            </p>
                            <p className="text-sm text-gray-500">Enseignants</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">
                                {users.filter(u => u.is_active !== false).length}
                            </p>
                            <p className="text-sm text-gray-500">Actifs</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Info</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {user.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{user.full_name}</p>
                                                {user.student_id_number && (
                                                    <p className="text-xs text-gray-500">ID: {user.student_id_number}</p>
                                                )}
                                                {user.employee_id && (
                                                    <p className="text-xs text-gray-500">EMP: {user.employee_id}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                    <td className="px-6 py-4">{getStatusBadge(user)}</td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="truncate max-w-[200px]">{user.email}</span>
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                                                    {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.role === 'student' && user.class_name && (
                                            <div className="flex items-center gap-1">
                                                <GraduationCap className="w-4 h-4 text-gray-400" />
                                                {user.class_name}
                                            </div>
                                        )}
                                        {user.role === 'teacher' && user.specialization && (
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                {user.specialization}
                                            </div>
                                        )}
                                        {user.role === 'admin' && user.position && (
                                            <div className="flex items-center gap-1">
                                                <Shield className="w-4 h-4 text-gray-400" />
                                                {user.position === 'director' && 'Directeur'}
                                                {user.position === 'vice_director' && 'Dir. Adjoint'}
                                                {user.position === 'coordinator' && 'Coordinateur'}
                                                {user.position === 'secretary' && 'Secrétaire'}
                                                {user.position === 'other' && 'Autre'}
                                            </div>
                                        )}
                                        {user.scholarship_status && user.scholarship_status !== 'none' && (
                                            <div className="flex items-center gap-1 text-yellow-600 mt-1">
                                                <Award className="w-4 h-4" />
                                                Bourse {user.scholarship_percentage}%
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setEditingUser(user); setShowModal(true); }}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Aucun utilisateur trouvé</p>
                        <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos filtres ou créez un nouvel utilisateur</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <UserFormModal
                    user={editingUser}
                    classes={classes}
                    onClose={() => { setShowModal(false); setEditingUser(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default UsersPage;
