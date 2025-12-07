/**
 * Student Competencies Page
 * View competency evaluations
 */

import { useState, useEffect } from 'react';
import {
    Target,
    CheckCircle,
    AlertCircle,
    TrendingUp
} from 'lucide-react';
import api from '../../services/api';

const { competencyAPI, subjectAPI } = api;

const StudentCompetenciesPage = () => {
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
            // In a real scenario, we would fetch evaluations for the current student
            // For now, we'll fetch the framework and simulate evaluations or use an endpoint if available
            const [compRes, subRes] = await Promise.all([
                competencyAPI.getCompetencies(),
                subjectAPI.getAll()
            ]);

            if (compRes.success) {
                // Mocking evaluation status for demo purposes if not available
                const compsWithStatus = compRes.data.map(c => ({
                    ...c,
                    status: Math.random() > 0.3 ? 'acquired' : Math.random() > 0.5 ? 'in_progress' : 'not_acquired',
                    score: Math.floor(Math.random() * 100)
                }));
                setCompetencies(compsWithStatus);
            }
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'acquired': return 'text-green-600 bg-green-100';
            case 'in_progress': return 'text-blue-600 bg-blue-100';
            case 'not_acquired': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'acquired': return 'Acquis';
            case 'in_progress': return 'En cours';
            case 'not_acquired': return 'Non acquis';
            default: return 'Non évalué';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mes Compétences</h1>
                    <p className="text-gray-500">Suivi de votre progression par compétence</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="">Toutes les matières</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredCompetencies.map((comp) => (
                        <div key={comp.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-mono text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {comp.code}
                                        </span>
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                            {comp.subject_name}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{comp.name}</h3>
                                    <p className="text-gray-600 text-sm">{comp.description}</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(comp.status)}`}>
                                            {getStatusLabel(comp.status)}
                                        </div>
                                    </div>
                                    {/* Progress bar simulation */}
                                    <div className="w-32 hidden md:block">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500">Maîtrise</span>
                                            <span className="font-medium text-gray-700">{comp.score}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${comp.score >= 70 ? 'bg-green-500' : comp.score >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}
                                                style={{ width: `${comp.score}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentCompetenciesPage;
