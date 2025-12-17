/**
 * Competencies Management Page - Évaluation par Compétences
 * Système pédagogique d'évaluation des compétences des élèves
 */

import { useState, useEffect } from 'react';
import {
    Award,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    Users,
    BookOpen,
    Target,
    TrendingUp,
    Save,
    X
} from 'lucide-react';
import api from '../../services/api';

const { competencyAPI, subjectAPI, classAPI, userAPI } = api;

const CompetenciesPage = () => {
    const [activeTab, setActiveTab] = useState('evaluations'); // evaluations first (more useful)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">🎯 Évaluation par Compétences</h1>
                <p className="text-gray-500 mt-1">Suivez la maîtrise des compétences de chaque élève</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('evaluations')}
                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'evaluations'
                            ? 'bg-white shadow-sm text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    📊 Évaluations
                </button>
                <button
                    onClick={() => setActiveTab('framework')}
                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'framework'
                            ? 'bg-white shadow-sm text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    📋 Référentiel
                </button>
            </div>

            {activeTab === 'evaluations' ? <CompetencyEvaluations /> : <CompetencyFramework />}
        </div>
    );
};

// Main Evaluations View
const CompetencyEvaluations = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [competencies, setCompetencies] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [pendingChanges, setPendingChanges] = useState({});

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedClass && selectedSubject) {
            fetchEvaluationData();
        }
    }, [selectedClass, selectedSubject]);

    const fetchInitialData = async () => {
        try {
            const [classesRes, subjectsRes] = await Promise.all([
                classAPI.getAll(),
                subjectAPI.getAll()
            ]);
            if (classesRes.success) setClasses(classesRes.data);
            if (subjectsRes.success) setSubjects(subjectsRes.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchEvaluationData = async () => {
        try {
            setLoading(true);
            const [studentsRes, competenciesRes, evaluationsRes] = await Promise.all([
                userAPI.getAll({ role: 'student', class_id: selectedClass }),
                competencyAPI.getCompetencies({ subject_id: selectedSubject }),
                competencyAPI.getEvaluations({ class_id: selectedClass, subject_id: selectedSubject })
            ]);

            if (studentsRes.success) setStudents(studentsRes.data);
            if (competenciesRes.success) setCompetencies(competenciesRes.data);
            if (evaluationsRes.success) setEvaluations(evaluationsRes.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get evaluation status for a student/competency pair
    const getEvaluation = (studentId, competencyId) => {
        // Check pending changes first
        const key = `${studentId}-${competencyId}`;
        if (pendingChanges[key] !== undefined) {
            return pendingChanges[key];
        }
        // Then check existing evaluations
        const existing = evaluations.find(e => e.student_id === studentId && e.competency_id === competencyId);
        return existing?.level || null;
    };

    const handleLevelChange = (studentId, competencyId, level) => {
        const key = `${studentId}-${competencyId}`;
        setPendingChanges(prev => ({ ...prev, [key]: level }));
    };

    const saveEvaluations = async () => {
        if (Object.keys(pendingChanges).length === 0) return;

        try {
            setSaving(true);
            const updates = Object.entries(pendingChanges).map(([key, level]) => {
                const [student_id, competency_id] = key.split('-');
                return { student_id, competency_id, level };
            });

            await competencyAPI.bulkEvaluate({ evaluations: updates });
            await fetchEvaluationData();
            setPendingChanges({});
            setEditMode(false);
            alert('Évaluations enregistrées avec succès !');
        } catch (error) {
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setSaving(false);
        }
    };

    // Level options with colors
    const levels = [
        { value: 'acquired', label: 'Acquis', icon: '✅', color: 'bg-green-100 text-green-700 border-green-300' },
        { value: 'in_progress', label: 'En cours', icon: '🔄', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
        { value: 'not_acquired', label: 'Non acquis', icon: '❌', color: 'bg-red-100 text-red-700 border-red-300' },
        { value: 'not_evaluated', label: 'Non évalué', icon: '⚪', color: 'bg-gray-100 text-gray-500 border-gray-300' }
    ];

    const getLevelInfo = (level) => levels.find(l => l.value === level) || levels[3];

    // Statistics
    const stats = {
        totalStudents: students.length,
        totalCompetencies: competencies.length,
        acquiredCount: evaluations.filter(e => e.level === 'acquired').length,
        inProgressCount: evaluations.filter(e => e.level === 'in_progress').length,
        notAcquiredCount: evaluations.filter(e => e.level === 'not_acquired').length
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Users className="w-4 h-4 inline mr-2" />
                            Classe
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                        >
                            <option value="">Sélectionner une classe</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Matière
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                        >
                            <option value="">Sélectionner une matière</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            {selectedClass && selectedSubject && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                            <Users className="w-4 h-4" />
                            Élèves
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{stats.totalStudents}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                            <Target className="w-4 h-4" />
                            Compétences
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{stats.totalCompetencies}</div>
                    </div>
                    <div className="bg-green-50 rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                            ✅ Acquis
                        </div>
                        <div className="text-2xl font-bold text-green-700">{stats.acquiredCount}</div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-yellow-600 text-sm mb-1">
                            🔄 En cours
                        </div>
                        <div className="text-2xl font-bold text-yellow-700">{stats.inProgressCount}</div>
                    </div>
                    <div className="bg-red-50 rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-red-500 text-sm mb-1">
                            ❌ Non acquis
                        </div>
                        <div className="text-2xl font-bold text-red-600">{stats.notAcquiredCount}</div>
                    </div>
                </div>
            )}

            {/* Evaluation Grid */}
            {selectedClass && selectedSubject && !loading && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-600 to-purple-700">
                        <h3 className="font-semibold text-white text-lg">
                            🎯 Grille d'évaluation
                        </h3>
                        <div className="flex gap-2">
                            {editMode ? (
                                <>
                                    <button
                                        onClick={() => { setPendingChanges({}); setEditMode(false); }}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
                                    >
                                        <X className="w-4 h-4" />
                                        Annuler
                                    </button>
                                    <button
                                        onClick={saveEvaluations}
                                        disabled={saving || Object.keys(pendingChanges).length === 0}
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Enregistrement...' : `Enregistrer (${Object.keys(pendingChanges).length})`}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-gray-100"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Modifier
                                </button>
                            )}
                        </div>
                    </div>

                    {competencies.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Aucune compétence définie pour cette matière</p>
                            <p className="text-sm mt-2">Allez dans l'onglet "Référentiel" pour créer des compétences</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase sticky left-0 bg-gray-50 z-10">
                                            Élève
                                        </th>
                                        {competencies.map(comp => (
                                            <th key={comp.id} className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                                                <div title={comp.description}>{comp.code}</div>
                                                <div className="font-normal text-gray-400 text-[10px] max-w-[80px] truncate">{comp.name}</div>
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase bg-purple-50">
                                            Taux
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map(student => {
                                        const studentEvals = competencies.map(comp => getEvaluation(student.id, comp.id));
                                        const acquiredCount = studentEvals.filter(e => e === 'acquired').length;
                                        const rate = competencies.length > 0 ? ((acquiredCount / competencies.length) * 100).toFixed(0) : 0;

                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 sticky left-0 bg-white z-10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                                            {student.full_name?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="font-medium text-gray-800">{student.full_name}</span>
                                                    </div>
                                                </td>
                                                {competencies.map(comp => {
                                                    const level = getEvaluation(student.id, comp.id);
                                                    const levelInfo = getLevelInfo(level);

                                                    return (
                                                        <td key={comp.id} className="px-2 py-2 text-center">
                                                            {editMode ? (
                                                                <select
                                                                    value={level || 'not_evaluated'}
                                                                    onChange={(e) => handleLevelChange(student.id, comp.id, e.target.value)}
                                                                    className={`w-full px-2 py-1 text-xs rounded border ${getLevelInfo(level || 'not_evaluated').color}`}
                                                                >
                                                                    {levels.map(l => (
                                                                        <option key={l.value} value={l.value}>{l.icon} {l.label}</option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <span className={`inline-block px-2 py-1 rounded text-sm ${levelInfo.color}`} title={levelInfo.label}>
                                                                    {levelInfo.icon}
                                                                </span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                                <td className="px-4 py-3 text-center bg-purple-50">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${parseInt(rate) >= 80 ? 'bg-green-100 text-green-700' :
                                                            parseInt(rate) >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                        }`}>
                                                        {rate}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            )}

            {/* Instructions */}
            {(!selectedClass || !selectedSubject) && (
                <div className="bg-purple-50 rounded-xl p-8 text-center">
                    <Target className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-lg font-medium text-purple-800 mb-2">Sélectionnez une classe et une matière</h3>
                    <p className="text-purple-600">
                        Pour évaluer les compétences des élèves, choisissez d'abord une classe et une matière.
                    </p>
                </div>
            )}

            {/* Legend */}
            {selectedClass && selectedSubject && competencies.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Légende</h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                        {levels.map(l => (
                            <span key={l.value} className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded flex items-center justify-center ${l.color}`}>{l.icon}</span>
                                {l.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Competency Framework Management
const CompetencyFramework = () => {
    const [competencies, setCompetencies] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingComp, setEditingComp] = useState(null);
    const [filterSubject, setFilterSubject] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [compRes, subRes] = await Promise.all([
                competencyAPI.getCompetencies(),
                subjectAPI.getAll()
            ]);
            if (compRes.success) setCompetencies(compRes.data);
            if (subRes.success) setSubjects(subRes.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette compétence ?')) {
            try {
                await competencyAPI.deleteCompetency(id);
                fetchData();
            } catch (error) {
                alert('Impossible de supprimer (peut-être utilisée dans des évaluations)');
            }
        }
    };

    const filteredCompetencies = filterSubject
        ? competencies.filter(c => c.subject_id === filterSubject)
        : competencies;

    // Group by subject
    const groupedBySubject = filteredCompetencies.reduce((acc, comp) => {
        const subjectName = comp.subject_name || 'Sans matière';
        if (!acc[subjectName]) acc[subjectName] = [];
        acc[subjectName].push(comp);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <select
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">Toutes les matières</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => { setEditingComp(null); setShowModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        <Plus className="w-4 h-4" />
                        Nouvelle Compétence
                    </button>
                </div>
            </div>

            {/* Competencies by Subject */}
            {Object.entries(groupedBySubject).map(([subjectName, comps]) => (
                <div key={subjectName} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-purple-600" />
                            {subjectName}
                            <span className="text-sm font-normal text-gray-500">({comps.length} compétences)</span>
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {comps.map(comp => (
                            <div key={comp.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <span className="font-bold text-purple-700">{comp.code}</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{comp.name}</div>
                                        <div className="text-sm text-gray-500">{comp.description}</div>
                                        {comp.category && (
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                {comp.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingComp(comp); setShowModal(true); }}
                                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(comp.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {filteredCompetencies.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Aucune compétence trouvée</p>
                    <p className="text-sm text-gray-400 mt-2">Cliquez sur "Nouvelle Compétence" pour en créer une</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <CompetencyModal
                    competency={editingComp}
                    subjects={subjects}
                    onClose={() => { setShowModal(false); setEditingComp(null); }}
                    onSuccess={() => { setShowModal(false); setEditingComp(null); fetchData(); }}
                />
            )}
        </div>
    );
};

// Competency Modal
const CompetencyModal = ({ competency, subjects, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        code: competency?.code || '',
        name: competency?.name || '',
        description: competency?.description || '',
        subject_id: competency?.subject_id || '',
        category: competency?.category || ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (competency?.id) {
                await competencyAPI.updateCompetency(competency.id, formData);
            } else {
                await competencyAPI.createCompetency(formData);
            }
            onSuccess();
        } catch (error) {
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                        {competency ? 'Modifier la compétence' : 'Nouvelle compétence'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="M1, F2, etc."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Ex: Calcul, Lecture..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la compétence *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Ex: Résoudre des équations du 1er degré"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            rows="2"
                            placeholder="Description détaillée de la compétence..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Matière *</label>
                        <select
                            value={formData.subject_id}
                            onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        >
                            <option value="">Sélectionner une matière</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={saving}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            disabled={saving}
                        >
                            {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompetenciesPage;
