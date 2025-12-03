/**
 * Analytics Dashboard
 * Predictions and scholarship candidates
 */

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Award, DollarSign, Users, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const { analyticsAPI, classAPI } = api;

const AnalyticsDashboard = () => {
    const [scholarshipCandidates, setScholarshipCandidates] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchScholarshipCandidates();
    }, []);

    const fetchScholarshipCandidates = async () => {
        try {
            setLoading(true);
            const res = await analyticsAPI.getScholarshipCandidates();
            if (res.success) setScholarshipCandidates(res.data);
        } catch (error) {
            console.error('Error fetching scholarship candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPredictions = async (studentId) => {
        try {
            const res = await analyticsAPI.getPredictions(studentId);
            if (res.success) {
                setPredictions(res.data);
                setSelectedStudent(studentId);
            }
        } catch (error) {
            console.error('Error fetching predictions:', error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Analytique & Prédictions</h1>

            {/* Scholarship Candidates */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-gray-800">Candidats Bourses d'Excellence</h3>
                </div>

                {loading ? (
                    <div className="text-center py-12">Chargement...</div>
                ) : scholarshipCandidates.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Aucun candidat identifié pour le moment</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Critères</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {scholarshipCandidates.map((candidate) => (
                                    <tr key={candidate.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{candidate.full_name}</div>
                                            <div className="text-sm text-gray-500">{candidate.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{candidate.class_name}</td>
                                        <td className="px-6 py-4">
                                            {candidate.criteria_met && (
                                                <div className="text-sm">
                                                    <span className="font-bold text-green-600">
                                                        {JSON.parse(candidate.criteria_met).average}/20
                                                    </span>
                                                    {JSON.parse(candidate.criteria_met).rank && (
                                                        <span className="ml-2 text-gray-500">
                                                            Rang: {JSON.parse(candidate.criteria_met).rank}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${candidate.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    candidate.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {candidate.status === 'approved' ? 'Approuvé' :
                                                    candidate.status === 'reviewed' ? 'Révisé' : 'Identifié'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => fetchPredictions(candidate.student_id)}
                                                className="text-blue-600 hover:text-blue-900 text-sm"
                                            >
                                                Voir Prédictions
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Predictions Panel */}
            {selectedStudent && predictions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Prédictions de Performance</h3>
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Fermer
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {predictions.map((pred) => (
                                <div key={pred.subject_id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-800">{pred.subject_name}</h4>
                                        {pred.trend === 'up' ? (
                                            <TrendingUp className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {pred.predicted_grade}/20
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Confiance: {pred.confidence_score}%
                                    </div>
                                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600"
                                            style={{ width: `${pred.confidence_score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
