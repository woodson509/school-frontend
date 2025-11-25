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
} from 'lucide-react';

const SuperAdminDashboardPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSchools: 12,
        totalUsers: 1250,
        totalAgents: 8,
        totalRevenue: 145600,
        activeSales: 23,
        pendingSales: 5,
    });

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 500);
    }, []);

    const statCards = [
        {
            title: 'Écoles Actives',
            value: stats.totalSchools,
            change: '+2',
            trend: 'up',
            icon: School,
            color: 'blue',
            link: '/schools',
        },
        {
            title: 'Total Utilisateurs',
            value: stats.totalUsers.toLocaleString(),
            change: '+12%',
            trend: 'up',
            icon: Users,
            color: 'green',
            link: '/users',
        },
        {
            title: 'Agents Commerciaux',
            value: stats.totalAgents,
            change: '+1',
            trend: 'up',
            icon: UserCog,
            color: 'purple',
            link: '/agents',
        },
        {
            title: 'Revenus Totaux',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            change: '+18%',
            trend: 'up',
            icon: DollarSign,
            color: 'emerald',
            link: '/sales',
        },
        {
            title: 'Ventes Actives',
            value: stats.activeSales,
            change: '+7',
            trend: 'up',
            icon: TrendingUp,
            color: 'indigo',
            link: '/sales',
        },
        {
            title: 'Ventes en Attente',
            value: stats.pendingSales,
            change: '-2',
            trend: 'down',
            icon: AlertCircle,
            color: 'orange',
            link: '/sales',
        },
    ];

    const recentActivities = [
        { id: 1, action: 'Nouvelle école inscrite', user: 'École Saint-Jean', time: 'Il y a 2h', type: 'school' },
        { id: 2, action: 'Vente complétée', user: 'Agent Martin', time: 'Il y a 4h', type: 'sale' },
        { id: 3, action: 'Nouvel agent ajouté', user: 'Marie Dupont', time: 'Il y a 1j', type: 'agent' },
        { id: 4, action: 'Sauvegarde système', user: 'Système', time: 'Il y a 1j', type: 'system' },
        { id: 5, action: 'Mise à jour des permissions', user: 'SuperAdmin', time: 'Il y a 2j', type: 'role' },
    ];

    const quickActions = [
        { label: 'Ajouter école', icon: School, path: '/schools/create', color: 'blue' },
        { label: 'Ajouter utilisateur', icon: Users, path: '/users/create', color: 'green' },
        { label: 'Ajouter agent', icon: UserCog, path: '/agents/create', color: 'purple' },
        { label: 'Voir rapports', icon: Database, path: '/reports', color: 'orange' },
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
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Tableau de bord SuperAdmin</h1>
                <p className="text-indigo-100">
                    Gestion globale du système multi-écoles. Vue d'ensemble et contrôle total.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} onClick={() => navigate(stat.link)} />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(action.path)}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-${action.color}-500 hover:bg-${action.color}-50 transition-all group`}
                        >
                            <div className={`w-12 h-12 rounded-full bg-${action.color}-100 flex items-center justify-center group-hover:bg-${action.color}-200 transition-colors`}>
                                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Activité récente</h3>
                        <button
                            onClick={() => navigate('/logs')}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            Voir tout <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Activity className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                                    <p className="text-sm text-gray-500">{activity.user}</p>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">État du système</h3>
                        <button
                            onClick={() => navigate('/backup')}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            Sauvegarde <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-green-900">Système opérationnel</span>
                            </div>
                            <Server className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Database className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Dernière sauvegarde</p>
                                    <p className="text-xs text-blue-700">Hier à 23:00</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium text-purple-900">Sécurité</p>
                                    <p className="text-xs text-purple-700">Tous les systèmes protégés</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-orange-800">Rappels importants</h4>
                        <ul className="mt-2 space-y-1 text-sm text-orange-700">
                            <li>• 5 ventes en attente de validation</li>
                            <li>• Renouvellement de licence pour 2 écoles le mois prochain</li>
                            <li>• Sauvegarde automatique programmée ce soir à 23h</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ title, value, change, trend, icon: Icon, color, onClick }) => {
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
            className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {change}
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
        </div>
    );
};

export default SuperAdminDashboardPage;
