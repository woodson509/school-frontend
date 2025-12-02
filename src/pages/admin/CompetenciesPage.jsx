/**
 * Competencies Management Page
 * Manage competency framework and evaluations
 */

import { useState, useEffect } from 'react';
import {
    Award,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { competencyAPI, subjectAPI } from '../../services/api';

const CompetenciesPage = () => {
    const [activeTab, setActiveTab] = useState('framework'); // framework, evaluations

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Compétences</h1>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('framework')}
                    className={`pb-2 px-4 font-medium text-sm transition-colors ${activeTab === 'framework'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Référentiel
                </button>
                <button
                    onClick={() => setActiveTab('evaluations')}
                    className={`pb-2 px-4 font-medium text-sm transition-colors ${activeTab === 'evaluations'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Évaluations
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                {activeTab === 'framework' ? <CompetencyFramework /> : <CompetencyEvaluations />}
            </div>
        </div>
    );
};

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

    return (
        <div className="space-y-6">
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
                    onClick={() => {
                        setEditingComp(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle Compétence
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compétence</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matière</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCompetencies.map((comp) => (
                            <tr key={comp.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-blue-600">{comp.code}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{comp.name}</div>
                                    <div className="text-sm text-gray-500">{comp.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.subject_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setEditingComp(comp);
                                            setShowModal(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(comp.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <CompetencyModal
                    comp={editingComp}
                    subjects={subjects}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
};

const CompetencyModal = ({ comp, subjects, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        code: comp?.code || '',
        name: comp?.name || '',
        description: comp?.description || '',
        subject_id: comp?.subject_id || '',
        category: comp?.category || '',
        level: comp?.level || 'Primaire'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (comp) {
                await competencyAPI.updateCompetency(comp.id, formData);
            } else {
                await competencyAPI.createCompetency(formData);
            }
            onSuccess();
        } catch (error) {
            alert('Erreur lors de l\'enregistrement');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {comp ? 'Modifier la Compétence' : 'Nouvelle Compétence'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="ex: MATH-C1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="ex: Géométrie"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            rows="3"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CompetencyEvaluations = () => {
    return (
        <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Module d'évaluation en cours de développement.</p>
            <p className="text-sm mt-2">Utilisez la page "Notes" pour l'instant.</p>
        </div>
    );
};

export default CompetenciesPage;
