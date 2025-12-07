/**
 * Agent Dashboard Page
 * Overview of sales performance
 */

import { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    Users,
    Award,
    Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AgentDashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalSales: 0,
        totalRevenue: 0,
        commissionEarned: 0,
        recentSales: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            setStats({
                totalSales: 12,
                totalRevenue: 450000,
                commissionEarned: 45000,
                recentSales: [
                    { id: 1, student: 'Jean Pierre', amount: 25000, date: '2023-11-20', status: 'completed' },
                    { id: 2, student: 'Marie Curie', amount: 25000, date: '2023-11-18', status: 'completed' },
                    { id: 3, student: 'Albert Einstein', amount: 25000, date: '2023-11-15', status: 'pending' },
                ]
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
                    <p className="text-gray-500">Bienvenue, {user?.name}</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-medium flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>Code Agent: {user?.agent_code || 'AGT-001'}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Ventes</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalSales}</h3>
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> +2 cette semaine
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Revenus Générés</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalRevenue.toLocaleString()} HTG</h3>
                    <p className="text-sm text-gray-500 mt-1">Depuis le début</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Award className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Commissions</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.commissionEarned.toLocaleString()} HTG</h3>
                    <p className="text-sm text-purple-600 mt-1">Disponible pour retrait</p>
                </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Ventes Récentes</h2>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Voir tout</button>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {stats.recentSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs mr-3">
                                            {sale.student.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{sale.student}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {sale.amount.toLocaleString()} HTG
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(sale.date).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {sale.status === 'completed' ? 'Complété' : 'En attente'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentDashboardPage;
