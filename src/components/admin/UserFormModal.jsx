/**
 * User Form Modal Component
 * Multi-tab form for creating/editing users with all pedagogical fields
 */

import { useState } from 'react';
import { X, User, GraduationCap, Briefcase, Shield, Phone, AlertCircle } from 'lucide-react';

const UserFormModal = ({ user, classes, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        // Basic info
        full_name: user?.full_name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'student',
        phone: user?.phone || '',
        address: user?.address || '',
        date_of_birth: user?.date_of_birth || '',
        gender: user?.gender || '',

        // Student fields
        class_id: user?.class_id || '',
        student_id_number: user?.student_id_number || '',
        enrollment_date: user?.enrollment_date || new Date().toISOString().split('T')[0],
        enrollment_status: user?.enrollment_status || 'active',
        parent_name: user?.parent_name || '',
        parent_phone: user?.parent_phone || '',
        parent_email: user?.parent_email || '',
        emergency_contact_name: user?.emergency_contact_name || '',
        emergency_contact_phone: user?.emergency_contact_phone || '',
        emergency_contact_relationship: user?.emergency_contact_relationship || '',
        medical_notes: user?.medical_notes || '',
        special_needs: user?.special_needs || '',
        transport_method: user?.transport_method || '',
        previous_school: user?.previous_school || '',
        scholarship_status: user?.scholarship_status || 'none',
        scholarship_percentage: user?.scholarship_percentage || 0,

        // Teacher fields
        employee_id: user?.employee_id || '',
        hire_date: user?.hire_date || new Date().toISOString().split('T')[0],
        contract_type: user?.contract_type || 'permanent',
        employment_status: user?.employment_status || 'active',
        specialization: user?.specialization || '',
        years_of_experience: user?.years_of_experience || 0,
        department: user?.department || '',
        office_location: user?.office_location || '',
        max_teaching_hours: user?.max_teaching_hours || 30,
        is_class_teacher: user?.is_class_teacher || false,

        // Admin fields
        position: user?.position || 'coordinator',
        can_approve_expenses: user?.can_approve_expenses || false,
        can_manage_all_classes: user?.can_manage_all_classes || false,
        max_expense_approval_amount: user?.max_expense_approval_amount || 0,

        // Access control
        is_active: user?.is_active !== undefined ? user.is_active : true,
        access_revoked_reason: user?.access_revoked_reason || '',
    });

    const tabs = [
        { id: 0, name: 'Informations de base', icon: User },
        { id: 1, name: 'Pédagogie / Professionnel', icon: formData.role === 'student' ? GraduationCap : Briefcase },
        { id: 2, name: 'Contact & Urgence', icon: Phone },
        { id: 3, name: 'Statut & Accès', icon: Shield },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {user ? `Modification de ${user.full_name}` : 'Créer un nouvel utilisateur pour votre école'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 px-6 flex overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{tab.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Tab 1: Basic Information */}
                        {activeTab === 0 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom complet <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {!user && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mot de passe <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required={!user}
                                            minLength={6}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rôle <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            disabled={user && user.role === 'admin'}
                                        >
                                            <option value="student">Étudiant</option>
                                            <option value="teacher">Enseignant</option>
                                            <option value="admin">Administrateur</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                                        <input
                                            type="date"
                                            value={formData.date_of_birth}
                                            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner...</option>
                                            <option value="M">Masculin</option>
                                            <option value="F">Féminin</option>
                                            <option value="Other">Autre</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Academic/Professional Info */}
                        {activeTab === 1 && (
                            <div className="space-y-4">
                                {formData.role === 'student' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                                                <select
                                                    value={formData.class_id}
                                                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Aucune classe assignée</option>
                                                    {classes.map((cls) => (
                                                        <option key={cls.id} value={cls.id}>
                                                            {cls.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
                                                <input
                                                    type="text"
                                                    value={formData.student_id_number}
                                                    onChange={(e) => setFormData({ ...formData, student_id_number: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Ex: STU-2024-001"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'inscription</label>
                                                <input
                                                    type="date"
                                                    value={formData.enrollment_date}
                                                    onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut d'inscription</label>
                                                <select
                                                    value={formData.enrollment_status}
                                                    onChange={(e) => setFormData({ ...formData, enrollment_status: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="active">Actif</option>
                                                    <option value="suspended">Suspendu</option>
                                                    <option value="graduated">Diplômé</option>
                                                    <option value="withdrawn">Retiré</option>
                                                    <option value="transferred">Transféré</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">École précédente</label>
                                            <input
                                                type="text"
                                                value={formData.previous_school}
                                                onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut de bourse</label>
                                                <select
                                                    value={formData.scholarship_status}
                                                    onChange={(e) => setFormData({ ...formData, scholarship_status: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="none">Aucune</option>
                                                    <option value="partial">Partielle</option>
                                                    <option value="full">Complète</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Pourcentage de bourse (%)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={formData.scholarship_percentage}
                                                    onChange={(e) => setFormData({ ...formData, scholarship_percentage: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    disabled={formData.scholarship_status === 'none'}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes médicales</label>
                                                <textarea
                                                    value={formData.medical_notes}
                                                    onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    rows={2}
                                                    placeholder="Allergies, conditions médicales..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Besoins spéciaux</label>
                                                <textarea
                                                    value={formData.special_needs}
                                                    onChange={(e) => setFormData({ ...formData, special_needs: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    rows={2}
                                                    placeholder="Accommodations nécessaires..."
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Moyen de transport</label>
                                            <input
                                                type="text"
                                                value={formData.transport_method}
                                                onChange={(e) => setFormData({ ...formData, transport_method: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Ex: Bus scolaire, Parent, À pied..."
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.role === 'teacher' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Matricule employé</label>
                                                <input
                                                    type="text"
                                                    value={formData.employee_id}
                                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Ex: EMP-2024-001"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
                                                <input
                                                    type="date"
                                                    value={formData.hire_date}
                                                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                                                <select
                                                    value={formData.contract_type}
                                                    onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="permanent">Permanent</option>
                                                    <option value="temporary">Temporaire</option>
                                                    <option value="part_time">Temps partiel</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut d'emploi</label>
                                                <select
                                                    value={formData.employment_status}
                                                    onChange={(e) => setFormData({ ...formData, employment_status: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="active">Actif</option>
                                                    <option value="on_leave">En congé</option>
                                                    <option value="terminated">Terminé</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialisation</label>
                                                <input
                                                    type="text"
                                                    value={formData.specialization}
                                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Ex: Mathématiques, Sciences, Langues..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.years_of_experience}
                                                    onChange={(e) => setFormData({ ...formData, years_of_experience: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                                                <input
                                                    type="text"
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation bureau</label>
                                                <input
                                                    type="text"
                                                    value={formData.office_location}
                                                    onChange={(e) => setFormData({ ...formData, office_location: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Ex: Bâtiment A, Salle 203"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Heures max par semaine</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="60"
                                                    value={formData.max_teaching_hours}
                                                    onChange={(e) => setFormData({ ...formData, max_teaching_hours: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 pt-8">
                                                <input
                                                    type="checkbox"
                                                    id="is_class_teacher"
                                                    checked={formData.is_class_teacher}
                                                    onChange={(e) => setFormData({ ...formData, is_class_teacher: e.target.checked })}
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                />
                                                <label htmlFor="is_class_teacher" className="text-sm font-medium text-gray-700">
                                                    Tuteur de classe
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {formData.role === 'admin' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Matricule employé</label>
                                                <input
                                                    type="text"
                                                    value={formData.employee_id}
                                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
                                                <input
                                                    type="date"
                                                    value={formData.hire_date}
                                                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
                                                <select
                                                    value={formData.position}
                                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="director">Directeur</option>
                                                    <option value="vice_director">Directeur adjoint</option>
                                                    <option value="coordinator">Coordinateur</option>
                                                    <option value="secretary">Secrétaire</option>
                                                    <option value="other">Autre</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                                                <input
                                                    type="text"
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-700">Permissions</h4>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="can_approve_expenses"
                                                    checked={formData.can_approve_expenses}
                                                    onChange={(e) => setFormData({ ...formData, can_approve_expenses: e.target.checked })}
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                />
                                                <label htmlFor="can_approve_expenses" className="text-sm text-gray-700">
                                                    Peut approuver les dépenses
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="can_manage_all_classes"
                                                    checked={formData.can_manage_all_classes}
                                                    onChange={(e) => setFormData({ ...formData, can_manage_all_classes: e.target.checked })}
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                />
                                                <label htmlFor="can_manage_all_classes" className="text-sm text-gray-700">
                                                    Peut gérer toutes les classes
                                                </label>
                                            </div>
                                            {formData.can_approve_expenses && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Montant max d'approbation (HTG)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="100"
                                                        value={formData.max_expense_approval_amount}
                                                        onChange={(e) => setFormData({ ...formData, max_expense_approval_amount: parseFloat(e.target.value) })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Tab 3: Contact & Emergency */}
                        {activeTab === 2 && formData.role === 'student' && (
                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                                    <h4 className="font-semibold text-blue-900 mb-2">Informations du parent/tuteur</h4>
                                    <p className="text-sm text-blue-700">Ces informations servent à contacter le responsable de l'étudiant</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du parent/tuteur</label>
                                        <input
                                            type="text"
                                            value={formData.parent_name}
                                            onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone parent</label>
                                        <input
                                            type="tel"
                                            value={formData.parent_phone}
                                            onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email parent</label>
                                    <input
                                        type="email"
                                        value={formData.parent_email}
                                        onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded mt-6">
                                    <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Contact d'urgence
                                    </h4>
                                    <p className="text-sm text-red-700">Personne à contacter en cas d'urgence</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom contact urgence</label>
                                        <input
                                            type="text"
                                            value={formData.emergency_contact_name}
                                            onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone urgence</label>
                                        <input
                                            type="tel"
                                            value={formData.emergency_contact_phone}
                                            onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lien de parenté</label>
                                    <input
                                        type="text"
                                        value={formData.emergency_contact_relationship}
                                        onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Oncle, Tante, Ami de la famille..."
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 2 && formData.role !== 'student' && (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <Phone className="w-16 h-16 mb-4 opacity-50" />
                                <p>Les contacts d'urgence ne sont disponibles que pour les étudiants</p>
                            </div>
                        )}

                        {/* Tab 4: Status & Access */}
                        {activeTab === 3 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                    <div>
                                        <label htmlFor="is_active" className="font-medium text-gray-800 cursor-pointer">
                                            Utilisateur actif
                                        </label>
                                        <p className="text-sm text-gray-600">L'utilisateur peut se connecter et utiliser la plateforme</p>
                                    </div>
                                </div>

                                {!formData.is_active && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Raison de désactivation
                                        </label>
                                        <textarea
                                            value={formData.access_revoked_reason}
                                            onChange={(e) => setFormData({ ...formData, access_revoked_reason: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            placeholder="Expliquez pourquoi l'accès est révoqué..."
                                        />
                                    </div>
                                )}

                                <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg mt-4">
                                    <h4 className="font-semibold text-yellow-900 mb-2">Informations importantes</h4>
                                    <ul className="text-sm text-yellow-800 space-y-1">
                                        <li>• Un utilisateur inactif ne peut pas se connecter à la plateforme</li>
                                        <li>• Les données de l'utilisateur restent dans le système</li>
                                        <li>• Vous pouvez réactiver un compte à tout moment</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-6 flex items-center justify-between bg-gray-50">
                        <div className="text-sm text-gray-600">
                            <span className="text-red-500">*</span> Champs obligatoires
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {user ? 'Mettre à jour' : 'Créer l\'utilisateur'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
