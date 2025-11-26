/**
 * Sales Management Page
 * Track and manage school enrollment sales
 */

import { useState, useEffect } from 'react';
import {
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { agentAPI } from '../../services/api';

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    commissions: 0
  });

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await agentAPI.getSales();
      if (response.success) {
        setSales(response.data);
        calculateStats(response.data);
      } else {
        setError('Failed to fetch sales data');
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err.message || 'An error occurred while fetching sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const calculateStats = (salesData) => {
    const newStats = {
      total: salesData.reduce((acc, s) => acc + parseFloat(s.amount || 0), 0),
      paid: salesData
        .filter(s => s.payment_status === 'completed')
        .reduce((acc, s) => acc + parseFloat(s.amount || 0), 0),
      pending: salesData
        .filter(s => s.payment_status === 'pending')
        .reduce((acc, s) => acc + parseFloat(s.amount || 0), 0),
      commissions: salesData
        .filter(s => s.payment_status === 'completed')
        .reduce((acc, s) => acc + parseFloat(s.commission || 0), 0),
    };
    setStats(newStats);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!confirm(`Êtes-vous sûr de vouloir changer le statut à "${newStatus}" ?`)) return;

    try {
      const response = await agentAPI.updateSaleStatus(id, newStatus);
      if (response.success) {
        // Refresh data
        fetchSales();
      } else {
        alert('Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Erreur: ' + err.message);
    }
  };

  const filteredSales = sales.filter(sale => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (sale.agent_name?.toLowerCase() || '').includes(searchLower) ||
      (sale.school_name?.toLowerCase() || '').includes(searchLower) ||
      (sale.agent_code?.toLowerCase() || '').includes(searchLower);

    const matchesStatus = statusFilter === 'all' || sale.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      failed: 'bg-red-100 text-red-700',
    };
    const icons = {
      completed: CheckCircle,
      pending: Clock,
      failed: XCircle,
    };
    const labels = {
      completed: 'Payé',
      pending: 'En attente',
      failed: 'Échoué',
    };

    // Fallback for unknown status
    const safeStatus = styles[status] ? status : 'pending';
    const Icon = icons[safeStatus];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[safeStatus]}`}>
        <Icon className="w-3 h-3" />
        {labels[safeStatus] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3 text-red-700">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher agent, école..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Payé</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">${stats.total.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total ventes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">${stats.paid.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Payé</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">${stats.pending.toLocaleString()}</p>
              <p className="text-sm text-gray-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">${stats.commissions.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Commissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Agent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">École</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Commission</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colspan="8" className="px-6 py-8 text-center text-gray-500">
                    Aucune vente trouvée
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{sale.agent_name}</p>
                        <p className="text-xs text-gray-500">{sale.agent_code}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.school_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="capitalize">{sale.subscription_type}</span>
                      <span className="text-xs text-gray-400 ml-1">({sale.subscription_months} mois)</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      ${parseFloat(sale.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">
                      ${parseFloat(sale.commission).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(sale.payment_status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sale.payment_status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(sale.id, 'completed')}
                              className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                              title="Marquer comme payé"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(sale.id, 'failed')}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                              title="Marquer comme échoué"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {sale.payment_status !== 'pending' && (
                          <span className="text-xs text-gray-400 italic">Aucune action</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
