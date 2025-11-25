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
} from 'lucide-react';

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const sampleSales = [
      { id: 1, agent: 'Sophie Laurent', school: 'École Saint-Jean', student: 'Pierre Jean', amount: 5000, commission: 500, date: '2024-12-01', status: 'paid' },
      { id: 2, agent: 'Jean-Marc Pierre', school: 'Lycée National', student: 'Marie Claire', amount: 4500, commission: 540, date: '2024-12-02', status: 'paid' },
      { id: 3, agent: 'Sophie Laurent', school: 'Collège Moderne', student: 'Paul Martin', amount: 5500, commission: 550, date: '2024-12-03', status: 'pending' },
      { id: 4, agent: 'Marie Dubois', school: 'École Saint-Jean', student: 'Louis Bernard', amount: 5000, commission: 500, date: '2024-12-04', status: 'pending' },
      { id: 5, agent: 'Jean-Marc Pierre', school: 'Lycée National', student: 'Emma Petit', amount: 4500, commission: 540, date: '2024-12-05', status: 'cancelled' },
      { id: 6, agent: 'Sophie Laurent', school: 'Collège Moderne', student: 'Lucas Robert', amount: 5500, commission: 550, date: '2024-12-06', status: 'paid' },
    ];
    
    setTimeout(() => {
      setSales(sampleSales);
      setLoading(false);
    }, 500);
  }, []);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    const icons = {
      paid: CheckCircle,
      pending: Clock,
      cancelled: XCircle,
    };
    const labels = {
      paid: 'Payé',
      pending: 'En attente',
      cancelled: 'Annulé',
    };
    const Icon = icons[status];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {labels[status]}
      </span>
    );
  };

  const stats = {
    total: sales.reduce((acc, s) => acc + s.amount, 0),
    paid: sales.filter(s => s.status === 'paid').reduce((acc, s) => acc + s.amount, 0),
    pending: sales.filter(s => s.status === 'pending').reduce((acc, s) => acc + s.amount, 0),
    commissions: sales.filter(s => s.status === 'paid').reduce((acc, s) => acc + s.commission, 0),
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
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
            <option value="paid">Payé</option>
            <option value="pending">En attente</option>
            <option value="cancelled">Annulé</option>
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
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Agent</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">École</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Étudiant</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Montant</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Commission</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">#{sale.id.toString().padStart(4, '0')}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{sale.agent}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{sale.school}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{sale.student}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">${sale.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-green-600">${sale.commission}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {sale.date}
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(sale.status)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    {sale.status === 'pending' && (
                      <>
                        <button className="p-2 hover:bg-green-50 rounded-lg" title="Marquer payé">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg" title="Annuler">
                          <XCircle className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;
