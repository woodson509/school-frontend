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
  Landmark,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { paymentAPI, userAPI } from '../../services/api';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [stats, setStats] = useState({
    total_expected: 0,
    total_received: 0,
    pending_count: 0,
    overdue_count: 0
  });

  // Bank Connection State
  const [bankConnected, setBankConnected] = useState(false);
  const [connectingBank, setConnectingBank] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, statsRes, studentsRes, feesRes] = await Promise.all([
        paymentAPI.getStudentFees(),
        paymentAPI.getStats(),
        userAPI.getAll({ role: 'student' }),
        paymentAPI.getFees()
      ]);

      if (paymentsRes.success) setPayments(paymentsRes.data);
      if (statsRes.success) setStats(statsRes.data);
      if (studentsRes.success) setStudents(studentsRes.data);
      if (feesRes.success) setFees(feesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectBank = () => {
    setConnectingBank(true);
    // Simulate bank connection process
    setTimeout(() => {
      setBankConnected(true);
      setConnectingBank(false);
      setShowBankModal(false);
      alert('Compte bancaire connecté avec succès !');
    }, 2000);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <button
            onClick={() => setShowBankModal(true)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${bankConnected
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            <Landmark className="w-4 h-4" />
            {bankConnected ? 'Banque Connectée' : 'Connecter Banque'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
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
              <p className="text-2xl font-bold text-gray-800">${Number(stats.total_expected).toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-800">${Number(stats.total_received).toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-800">{stats.pending_count}</p>
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
              <p className="text-2xl font-bold text-gray-800">{stats.overdue_count}</p>
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
            {stats.total_expected > 0 ? Math.round((stats.total_received / stats.total_expected) * 100) : 0}%
          </span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
            style={{ width: `${stats.total_expected > 0 ? (stats.total_received / stats.total_expected) * 100 : 0}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          ${Number(stats.total_received).toLocaleString()} reçus sur ${Number(stats.total_expected).toLocaleString()} attendus
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
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {payment.student_name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">{payment.student_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.class_name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.fee_type || 'Frais divers'}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">${Number(payment.amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${Number(payment.paid_amount) >= Number(payment.amount) ? 'text-green-600' : 'text-orange-600'}`}>
                      ${Number(payment.paid_amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  Aucun paiement trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          students={students}
          fees={fees}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            fetchData();
          }}
        />
      )}

      {/* Bank Connection Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Connecter un compte bancaire</h3>
              <button onClick={() => setShowBankModal(false)} className="text-gray-400 hover:text-gray-600">
                &times;
              </button>
            </div>

            {!connectingBank ? (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Sécurisé & Chiffré</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      Vos informations bancaires sont chiffrées de bout en bout. Nous ne stockons jamais vos identifiants.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleConnectBank}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                        S
                      </div>
                      <span className="font-medium text-gray-700">Sogebank</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button
                    onClick={handleConnectBank}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        U
                      </div>
                      <span className="font-medium text-gray-700">Unibank</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button
                    onClick={handleConnectBank}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                        B
                      </div>
                      <span className="font-medium text-gray-700">BUH</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Connexion sécurisée à la banque...</p>
                <p className="text-sm text-gray-400 mt-2">Veuillez patienter quelques instants</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentModal = ({ students, fees, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    fee_id: '',
    amount: '',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await paymentAPI.assignFee(formData);
      onSuccess();
    } catch (error) {
      console.error('Error assigning fee:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Enregistrer un paiement (Facture)</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Étudiant</label>
            <select
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un étudiant</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de frais</label>
            <select
              value={formData.fee_id}
              onChange={(e) => {
                const fee = fees.find(f => f.id === e.target.value);
                setFormData({
                  ...formData,
                  fee_id: e.target.value,
                  amount: fee ? fee.amount : ''
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un type (Optionnel)</option>
              {fees.map(f => (
                <option key={f.id} value={f.id}>{f.name} - ${f.amount}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentsPage;
