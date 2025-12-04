/**
 * Analytics Dashboard
 * Comprehensive school analytics with KPIs, charts, and predictions
 */

import { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Award,
    Users,
    AlertCircle,
    BookOpen,
    GraduationCap,
    Calendar,
    BarChart3,
    PieChart as PieChartIcon,
    Target,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import api from '../../services/api';

const { analyticsAPI, classAPI, dashboardAPI } = api;

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsDashboard = () => {
    const [scholarshipCandidates, setScholarshipCandidates] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data for demo - replace with API calls
    const [gradeDistribution] = useState([
        { range: '0-5', count: 2, color: '#ef4444' },
        { range: '6-9', count: 8, color: '#f59e0b' },
        { range: '10-12', count: 25, color: '#fbbf24' },
        { range: '13-15', count: 35, color: '#10b981' },
        { range: '16-18', count: 20, color: '#2563eb' },
        { range: '19-20', count: 10, color: '#8b5cf6' }
    ]);

    const [attendanceData] = useState([
        { month: 'Sep', present: 92, absent: 5, late: 3 },
        { month: 'Oct', present: 88, absent: 8, late: 4 },
        { month: 'Nov', present: 90, absent: 6, late: 4 },
        { month: 'Déc', present: 85, absent: 10, late: 5 }
    ]);

    const [classPerformance] = useState([
        { name: '6ème A', average: 14.2, students: 32 },
        { name: '6ème B', average: 13.8, students: 30 },
        { name: '5ème A', average: 12.5, students: 28 },
        { name: '5ème B', average: 13.1, students: 29 },
        { name: '4ème', average: 11.9, students: 25 },
        { name: '3ème', average: 12.8, students: 27 }
    ]);

    const [subjectPerformance] = useState([
        { subject: 'Mathématiques', average: 12.5, passRate: 72 },
        { subject: 'Français', average: 13.2, passRate: 78 },
        { subject: 'Sciences', average: 14.1, passRate: 85 },
        { subject: 'Histoire-Géo', average: 13.8, passRate: 80 },
        { subject: 'Anglais', average: 11.9, passRate: 68 },
        { subject: 'Créole', average: 15.2, passRate: 92 }
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [candidatesRes, statsRes] = await Promise.all([
                analyticsAPI.getScholarshipCandidates().catch(() => ({ success: false })),
                dashboardAPI?.getStats?.().catch(() => ({ success: false }))
            ]);

            if (candidatesRes.success) setScholarshipCandidates(candidatesRes.data);
            if (statsRes?.success) setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
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

    const kpiCards = [
        {
            title: 'Élèves Inscrits',
            value: stats?.totalStudents || 171,
            icon: Users,
            color: 'bg-blue-500',
            trend: '+12%',
            trendUp: true
        },
        {
            title: 'Moyenne Générale',
            value: '13.2/20',
            icon: Target,
            color: 'bg-green-500',
            trend: '+0.5',
            trendUp: true
        },
        {
            title: 'Taux de Présence',
            value: '89%',
            icon: CheckCircle,
            color: 'bg-emerald-500',
            trend: '-2%',
            trendUp: false
        },
        {
            title: 'Taux de Réussite',
            value: '78%',
            icon: GraduationCap,
            color: 'bg-purple-500',
            trend: '+5%',
            trendUp: true
        }
    ];

    const tabs = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
        { id: 'performance', label: 'Performance', icon: TrendingUp },
        { id: 'attendance', label: 'Présences', icon: Calendar },
        { id: 'scholarships', label: 'Bourses', icon: Award }
    ];

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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Analytique de l'École</h1>
                    <p className="text-gray-500 text-sm mt-1">Tableau de bord des performances et statistiques</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={`${kpi.color} p-3 rounded-lg`}>
                                <kpi.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                {kpi.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {kpi.trend}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-gray-800">{kpi.value}</h3>
                            <p className="text-sm text-gray-500">{kpi.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Grade Distribution */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <PieChartIcon className="w-5 h-5 text-blue-600" />
                                    Distribution des Notes
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={gradeDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="count"
                                                label={({ range, count }) => `${range}: ${count}`}
                                            >
                                                {gradeDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 mt-4">
                                    {gradeDistribution.map((item, index) => (
                                        <div key={index} className="flex items-center gap-1 text-xs">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span>{item.range}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Class Performance */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-green-600" />
                                    Moyenne par Classe
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={classPerformance} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" domain={[0, 20]} />
                                            <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Bar dataKey="average" fill="#2563eb" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Performance Tab */}
                    {activeTab === 'performance' && (
                        <div className="space-y-6">
                            {/* Subject Performance */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-purple-600" />
                                    Performance par Matière
                                </h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={subjectPerformance}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                                            <YAxis yAxisId="left" domain={[0, 20]} />
                                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar yAxisId="left" dataKey="average" name="Moyenne" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                            <Bar yAxisId="right" dataKey="passRate" name="Taux Réussite (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Performance Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-green-700 mb-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-semibold">Meilleures Performances</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-800">Créole</p>
                                    <p className="text-sm text-green-600">Moyenne: 15.2/20 | Réussite: 92%</p>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-yellow-700 mb-2">
                                        <AlertCircle className="w-5 h-5" />
                                        <span className="font-semibold">À Améliorer</span>
                                    </div>
                                    <p className="text-2xl font-bold text-yellow-800">Anglais</p>
                                    <p className="text-sm text-yellow-600">Moyenne: 11.9/20 | Réussite: 68%</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                                        <Target className="w-5 h-5" />
                                        <span className="font-semibold">Objectif Moyen</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-800">14.0/20</p>
                                    <p className="text-sm text-blue-600">Actuel: 13.2/20 | Gap: 0.8 pts</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance Tab */}
                    {activeTab === 'attendance' && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    Évolution de la Présence (%)
                                </h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={attendanceData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip />
                                            <Legend />
                                            <Area type="monotone" dataKey="present" name="Présents" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                            <Area type="monotone" dataKey="late" name="Retards" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                                            <Area type="monotone" dataKey="absent" name="Absents" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Attendance Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-green-800">89%</p>
                                    <p className="text-sm text-green-600">Taux de Présence Moyen</p>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                    <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-yellow-800">4%</p>
                                    <p className="text-sm text-yellow-600">Retards</p>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-red-800">7%</p>
                                    <p className="text-sm text-red-600">Absences</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Scholarships Tab */}
                    {activeTab === 'scholarships' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="w-5 h-5 text-yellow-600" />
                                <h3 className="font-semibold text-gray-800">Candidats Bourses d'Excellence</h3>
                                <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                    {scholarshipCandidates.length} candidat(s)
                                </span>
                            </div>

                            {scholarshipCandidates.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p>Aucun candidat identifié pour le moment</p>
                                    <p className="text-sm mt-2">Les candidats sont identifiés automatiquement avec une moyenne ≥ 16/20</p>
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
                                            {scholarshipCandidates.map((candidate) => {
                                                let criteria = {};
                                                try {
                                                    criteria = JSON.parse(candidate.criteria_met || '{}');
                                                } catch (e) { }

                                                return (
                                                    <tr key={candidate.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">{candidate.full_name}</div>
                                                            <div className="text-sm text-gray-500">{candidate.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">{candidate.class_name}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm">
                                                                <span className="font-bold text-green-600">
                                                                    {criteria.average}/20
                                                                </span>
                                                                {criteria.rank && (
                                                                    <span className="ml-2 text-gray-500">
                                                                        Rang: {criteria.rank}
                                                                    </span>
                                                                )}
                                                            </div>
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
                                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                                            >
                                                                Voir Prédictions
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Predictions Panel */}
                            {selectedStudent && predictions.length > 0 && (
                                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-semibold text-blue-800">Prédictions de Performance</h4>
                                        <button
                                            onClick={() => setSelectedStudent(null)}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Fermer
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {predictions.map((pred) => (
                                            <div key={pred.subject_id} className="bg-white border border-blue-100 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h5 className="font-medium text-gray-800">{pred.subject_name}</h5>
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
                                                        className="h-full bg-blue-600 transition-all"
                                                        style={{ width: `${pred.confidence_score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

