/**
 * Teacher Competencies Page
 * View competency framework and manage evaluations
 */

import { useState, useEffect } from 'react';
import {
    Search,
    AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const { competencyAPI, subjectAPI } = api;

const TeacherCompetenciesPage = () => {
    const [activeTab, setActiveTab] = useState('framework'); // framework, evaluations

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Compétences</h1>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('framework')}
                    className={`pb-2 px-4 font-medium text-sm transition-colors ${activeTab === 'framework'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Référentiel
                </button>
                <button
                    onClick={() => setActiveTab('evaluations')}
                    className={`pb-2 px-4 font-medium text-sm transition-colors ${activeTab === 'evaluations'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
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
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Toutes les matières</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compétence</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matière</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCompetencies.map((comp) => (
                            <tr key={comp.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-indigo-600">{comp.code}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{comp.name}</div>
                                    <div className="text-sm text-gray-500">{comp.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.subject_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default TeacherCompetenciesPage;
