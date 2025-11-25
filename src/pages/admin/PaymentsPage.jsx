/**
 * Payments Management Page
 * Manage student fees and payments
 */

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Download,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Receipt,
  Eye,
} from 'lucide-react';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const samplePayments = [
      { id: 1, student: 'Jean Pierre', class: '6ème A', type: 'Frais de scolarité', amount: 5000, paid: 5000, status: 'paid', date: '2024-12-01', method: 'Virement' },
      { id: 2, student: 'Marie Claire', class: '6ème A', type: 'Frais de scolarité', amount: 5000, paid: 3000, status: 'partial', date: '2024-12-05', method: 'Espèces' },
      { id: 3, student: 'Paul Martin', class: '5ème A', type: 'Frais de scolarité', amount: 5500, paid: 0, status: 'pending', date: null, method: null },
      { id: 4, student: 'Sophie Durand', class: '6ème B', type: 'Frais d\'examen', amount: 500, paid: 500, status: 'paid', date: '2024-12-10', method: 'Mobile Money' },
      { id: 5, student: 'Louis Bernard', class: '5ème A', type: 'Frais de scolarité', amount: 5500, paid: 5500, status: 'paid', date: '2024-11-28', method: 'Chèque' },
      { id: 6, student: 'Emma Petit', class: '4ème A', type: 'Frais de transport', amount: 1200, paid: 0, status: 'overdue', date: null, method: null },
      { id: 7, student: 'Lucas Robert', class: '6ème A', type: 'Frais de cantine', amount: 800, paid: 800, status: 'paid', date: '2024-12-08', method: 'Mobile Money' },
      { id: 8, student: 'Chloé Moreau', class: '6ème B', type: 'Frais de scolarité', amount: 5000, paid: 2500, status: 'partial', date: '2024-12-03', method: 'Espèces' },
    ];
    
    setTimeout(() => {
      setPayments(samplePayments);
      setLoading(false);
    }, 500);
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalExpected: payments.reduce((acc, p) => acc + p.amount, 0),
    totalReceived: payments.reduce((acc, p) => acc + p.paid, 0),
    pendingCount: payments.filter(p => p.status === 'pending' || p.status === 'partial').length,
    overdueCount: payments.filter(p => p.status === 'overdue').length,
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      partial: 'bg-orange-100 text-orange-700',
      pending: 'bg-gray-100 text-gray-700',
      overdue: 'bg-red-100 text-red-700',
    };
    const labels = {
      paid: 'Payé',
      partial: 'Partiel',
      pending: 'En attente',
      overdue: 'En retard',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
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
            <option value="partial">Partiel</option>
            <option value="pending">En attente</option>
            <option value="overdue">En retard</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Enregistrer paiement
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">${stats.totalExpected.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total attendu</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">${stats.totalReceived.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total reçu</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingCount}</p>
              <p className="text-sm text-gray-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.overdueCount}</p>
              <p className="text-sm text-gray-500">En retard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression des paiements</span>
          <span className="text-sm text-gray-500">
            {Math.round((stats.totalReceived / stats.totalExpected) * 100)}%
          </span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
            style={{ width: `${(stats.totalReceived / stats.totalExpected) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          ${stats.totalReceived.toLocaleString()} reçus sur ${stats.totalExpected.toLocaleString()} attendus
        </p>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Étudiant</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Classe</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Montant</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Payé</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {payment.student.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">{payment.student}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{payment.class}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{payment.type}</td>
                <td className="px-6 py-4 font-medium text-gray-800">${payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${payment.paid === payment.amount ? 'text-green-600' : 'text-orange-600'}`}>
                    ${payment.paid.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{payment.date || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir détails">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Reçu">
                      <Receipt className="w-4 h-4 text-blue-600" />
                    </button>
                    {payment.status !== 'paid' && (
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Enregistrer paiement">
                        <CreditCard className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Enregistrer un paiement</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Étudiant</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Sélectionner un étudiant</option>
                  {payments.filter(p => p.status !== 'paid').map(p => (
                    <option key={p.id} value={p.id}>{p.student} - {p.class}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="cash">Espèces</option>
                  <option value="transfer">Virement</option>
                  <option value="mobile">Mobile Money</option>
                  <option value="check">Chèque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
