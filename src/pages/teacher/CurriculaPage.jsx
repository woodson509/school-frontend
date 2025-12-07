/**
 * Teacher Curricula Page
 * View academic programs and curricula
 */

import { useState, useEffect } from 'react';
import {
    Layers,
    Search,
    Eye,
    BookOpen,
    CheckCircle,
    Users
} from 'lucide-react';
import { curriculumAPI } from '../../services/api';

const TeacherCurriculaPage = () => {
    const [curricula, setCurricula] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCurriculum, setSelectedCurriculum] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCurricula();
    }, []);

    const fetchCurricula = async () => {
        try {
            setLoading(true);
            const response = await curriculumAPI.getAll();
            if (response.success) {
                setCurricula(response.data);
            }
        } catch (error) {
            console.error('Error fetching curricula:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCurricula = curricula.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openViewModal = (curriculum) => {
        setSelectedCurriculum(curriculum);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Programmes Scolaires</h1>
                    <p className="text-gray-500">Consultez les programmes et cursus</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un programme..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64"
                    />
                </div>
            </div>

            {/* Curricula List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCurricula.map((curriculum) => (
                    <div
                        key={curriculum.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className={`h-2 ${curriculum.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                            {curriculum.code}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${curriculum.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {curriculum.status === 'active' ? 'Actif' : 'Brouillon'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">{curriculum.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{curriculum.level}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openViewModal(curriculum)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                        title="Voir détails"
                                    >
                                        <Eye className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{curriculum.description}</p>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-800">{curriculum.duration || '-'}</p>
                                    <p className="text-xs text-gray-500">Durée</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-800">{curriculum.subjects_count || 0}</p>
                                    <p className="text-xs text-gray-500">Matières</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-800">{curriculum.total_credits || 0}</p>
                                    <p className="text-xs text-gray-500">Crédits</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View Modal */}
            {showModal && selectedCurriculum && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {selectedCurriculum.name}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Code</p>
                                    <p className="font-medium">{selectedCurriculum.code}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Niveau</p>
                                    <p className="font-medium">{selectedCurriculum.level}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Durée</p>
                                    <p className="font-medium">{selectedCurriculum.duration || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Crédits</p>
                                    <p className="font-medium">{selectedCurriculum.total_credits || 0}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="text-gray-700 mt-1">{selectedCurriculum.description || 'Aucune description'}</p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherCurriculaPage;
