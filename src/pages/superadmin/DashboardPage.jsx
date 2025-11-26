/**
 * SuperAdmin Dashboard Page
 * Overview of global system statistics and management
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    School,
    UserCog,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Server,
    Activity,
    ArrowRight,
    AlertCircle,
    Database,
    Shield,
    Loader,
    Calendar,
    CheckCircle,
    Clock
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const SuperAdminDashboardPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/dashboard/superadmin`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Failed to fetch dashboard data');
                }

                const data = await response.json();
                if (data.success) {
                    setDashboardData(data.data);
                } else {
                    throw new Error(data.message || 'Failed to load data');
                }
            } catch (err) {
                console.error('Dashboard error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin h-12 w-12 text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <p className="font-bold">Erreur de chargement</p>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm underline hover:text-red-800"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (!dashboardData) return null;

    const { schools, users, sales_last_30_days, active_agents, recent_sales, revenue_trend } = dashboardData;

    const statCards = [
        {
            title: 'Écoles Actives',
            value: schools.active,
            total: schools.total,
            subtext: `${schools.trial} en essai`,
            icon: School,
            color: 'blue',
            link: '/schools',
        },
        {
            title: 'Utilisateurs',
            value: users.total.toLocaleString(),
            subtext: `${users.students} étudiants, ${users.teachers} profs`,
            icon: Users,
            color: 'green',
            link: '/users',
        },
        {
            title: 'Agents Actifs',
            value: active_agents,
            subtext: `${users.agents} agents total`,
            icon: UserCog,
            color: 'purple',
            link: '/agents',
        },
        {
            title: 'Revenus (30j)',
            value: `$${sales_last_30_days.completed_revenue.toLocaleString()}`,
            subtext: `$${sales_last_30_days.pending_revenue.toLocaleString()} en attente`,
            icon: DollarSign,
            color: 'emerald',
            link: '/sales',
        },
    ];

    const quickActions = [
        { label: 'Ajouter école', icon: School, path: '/schools/create', color: 'blue' },
        { label: 'Ajouter utilisateur', icon: Users, path: '/users/create', color: 'green' },
        { label: 'Ajouter agent', icon: UserCog, path: '/agents/create', color: 'purple' },
        { label: 'Voir rapports', icon: Database, path: '/reports', color: 'orange' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-2">Tableau de bord SuperAdmin</h1>
                <p className="text-indigo-100">
                    Vue d'ensemble en temps réel de la plateforme EDIKA.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} onClick={() => navigate(stat.link)} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Sales */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Dernières Ventes</h3>
                        <button
                            onClick={() => navigate('/sales')}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            Voir tout <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-3 pl-2">Date</th>
                                    <th className="pb-3">Agent</th>
                                    <th className="pb-3">École</th>
                                    <th className="pb-3">Montant</th>
                                    <th className="pb-3">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recent_sales.length > 0 ? (
                                    recent_sales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 pl-2 text-sm text-gray-600">
                                                {new Date(sale.sale_date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 text-sm font-medium text-gray-800">
                                                {sale.agent_name}
                                            </td>
                                            <td className="py-3 text-sm text-gray-600">
                                                {sale.school_name || 'N/A'}
                                            </td>
                                            <td className="py-3 text-sm font-medium text-gray-800">
                                                ${parseFloat(sale.amount).toLocaleString()}
                                            </td>
                                            <td className="py-3">
                                                <StatusBadge status={sale.payment_status} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-500">
                                            Aucune vente récente
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Revenue Trend & Quick Actions */}
                <div className="space-y-6">
                    {/* Revenue Trend */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendance Revenus</h3>
                        <div className="space-y-4">
                            {revenue_trend.slice(0, 5).map((month, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xs">
                                            {month.month.split('-')[1]}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {month.month}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-800">
                                            ${parseFloat(month.revenue).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {month.sales_count} ventes
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(action.path)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all`}
                                >
                                    <div className={`w-8 h-8 rounded-full bg-${action.color}-100 flex items-center justify-center`}>
                                        <action.icon className={`w-4 h-4 text-${action.color}-600`} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status & Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Server className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800">État du système</h3>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-900">Système opérationnel</span>
                        </div>
                        <span className="text-xs text-green-700 font-mono">v1.0.0</span>
                    </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-orange-800">Alertes Système</h4>
                            <ul className="mt-2 space-y-1 text-sm text-orange-700">
                                {schools.trial > 0 && (
                                    <li>• {schools.trial} écoles en période d'essai</li>
                                )}
                                {sales_last_30_days.pending_revenue > 0 && (
                                    <li>• ${sales_last_30_days.pending_revenue.toLocaleString()} de revenus en attente</li>
                                )}
                                <li>• Sauvegarde automatique à 23h00</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ title, value, subtext, icon: Icon, color, onClick }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
        indigo: 'bg-indigo-100 text-indigo-600',
        emerald: 'bg-emerald-100 text-emerald-600',
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-gray-200"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        completed: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        failed: 'bg-red-100 text-red-700',
    };

    const labels = {
        completed: 'Payé',
        pending: 'En attente',
        failed: 'Échoué',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {labels[status] || status}
        </span>
    );
};

export default SuperAdminDashboardPage;
