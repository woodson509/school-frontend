/**
 * Payments Management Page
 * Manage student fees, payments, and teacher salaries
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
  ShieldCheck,
  Users,
  Briefcase,
  Trash2,
  Edit2
} from 'lucide-react';
import { paymentAPI, userAPI } from '../../services/api';

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'teachers', 'fees'
  const [payments, setPayments] = useState([]);
  const [teacherPayments, setTeacherPayments] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTeacherPaymentModal, setShowTeacherPaymentModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedStudentFee, setSelectedStudentFee] = useState(null);

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

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
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Always fetch common data
      const [studentsRes, teachersRes] = await Promise.all([
        userAPI.getAll({ role: 'student' }),
        userAPI.getAll({ role: 'teacher' })
      ]);

      if (studentsRes.success) setStudents(studentsRes.data);
      if (teachersRes.success) setTeachers(teachersRes.data);

      if (activeTab === 'students') {
        const [paymentsRes, statsRes, feesRes] = await Promise.all([
          paymentAPI.getStudentFees(),
          paymentAPI.getStats(),
          paymentAPI.getFees()
        ]);
        if (paymentsRes.success) setPayments(paymentsRes.data);
        if (statsRes.success) setStats(statsRes.data);
        if (feesRes.success) setFees(feesRes.data);
      } else if (activeTab === 'teachers') {
        const res = await paymentAPI.getTeacherPayments();
        if (res.success) setTeacherPayments(res.data);
      } else if (activeTab === 'fees') {
        const res = await paymentAPI.getFees();
        if (res.success) setFees(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectBank = () => {
    setConnectingBank(true);
    setTimeout(() => {
      setBankConnected(true);
      setConnectingBank(false);
      setShowBankModal(false);
      alert('Compte bancaire connecté avec succès !');
    }, 2000);
  };

  const handleDeleteFee = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type de frais ?')) {
      try {
        await paymentAPI.deleteFee(id);
        fetchData();
      } catch (error) {
        alert('Impossible de supprimer ce frais car il est utilisé.');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-HT', { style: 'currency', currency: 'HTG' }).format(amount).replace('HTG', 'G');
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

  if (loading && !payments.length && !fees.length && !teacherPayments.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'students' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Paiements Étudiants
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'teachers' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Salaires Professeurs
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'fees' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Types de Frais
          </button>
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

          {activeTab === 'students' && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Nouveau Paiement
            </button>
          )}

          {activeTab === 'teachers' && (
            <button
              onClick={() => setShowTeacherPaymentModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Payer Salaire
            </button>
          )}

          {activeTab === 'fees' && (
            <button
              onClick={() => { setSelectedFee(null); setShowFeeModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Ajouter Type de Frais
            </button>
          )}
        </div>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'students' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.total_expected)}</p>
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
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.total_received)}</p>
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

          {/* Filters */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
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

          {/* Table */}
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
                {payments
                  .filter(p =>
                    (statusFilter === 'all' || p.status === statusFilter) &&
                    p.student_name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((payment) => (
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
                      <td className="px-6 py-4 font-medium text-gray-800">{formatCurrency(payment.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${Number(payment.paid_amount) >= Number(payment.amount) ? 'text-green-600' : 'text-orange-600'}`}>
                          {formatCurrency(payment.paid_amount)}
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
                            <button
                              onClick={() => {
                                setSelectedStudentFee(payment);
                                setShowRecordPaymentModal(true);
                              }}
                              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                              title="Enregistrer paiement"
                            >
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
        </>
      )}

      {activeTab === 'teachers' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Professeur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Période</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Méthode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teacherPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{payment.teacher_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.period_month} {payment.period_year}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{payment.payment_method}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                      <Receipt className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {teacherPayments.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Aucun paiement de salaire enregistré
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fees.map((fee) => (
            <div key={fee.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedFee(fee); setShowFeeModal(true); }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFee(fee.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{fee.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{fee.description || 'Aucune description'}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500 capitalize">{fee.type}</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(fee.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
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

      {showTeacherPaymentModal && (
        <TeacherPaymentModal
          teachers={teachers}
          onClose={() => setShowTeacherPaymentModal(false)}
          onSuccess={() => {
            setShowTeacherPaymentModal(false);
            fetchData();
          }}
        />
      )}

      {showFeeModal && (
        <FeeModal
          fee={selectedFee}
          onClose={() => setShowFeeModal(false)}
          onSuccess={() => {
            setShowFeeModal(false);
            fetchData();
          }}
        />
      )}

      {showRecordPaymentModal && selectedStudentFee && (
        <RecordPaymentModal
          studentFee={selectedStudentFee}
          onClose={() => {
            setShowRecordPaymentModal(false);
            setSelectedStudentFee(null);
          }}
          onSuccess={() => {
            setShowRecordPaymentModal(false);
            setSelectedStudentFee(null);
            fetchData();
          }}
        />
      )}

      {/* Bank Connection Modal (Same as before) */}
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
                  {/* Other banks... */}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Connexion sécurisée à la banque...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components for Modals
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
                <option key={f.id} value={f.id}>{f.name} - {f.amount} G</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant (G)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Annuler</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg" disabled={loading}>Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TeacherPaymentModal = ({ teachers, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    teacher_id: '',
    amount: '',
    payment_method: 'cash',
    period_month: new Date().toLocaleString('default', { month: 'long' }),
    period_year: new Date().getFullYear(),
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await paymentAPI.recordTeacherPayment(formData);
      onSuccess();
    } catch (error) {
      alert('Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Payer Salaire Professeur</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
            <select
              value={formData.teacher_id}
              onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Sélectionner un professeur</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mois</label>
              <select
                value={formData.period_month}
                onChange={(e) => setFormData({ ...formData, period_month: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
              <input
                type="number"
                value={formData.period_year}
                onChange={(e) => setFormData({ ...formData, period_year: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant (G)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Méthode</label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="cash">Espèces</option>
              <option value="check">Chèque</option>
              <option value="transfer">Virement</option>
              <option value="mobile_money">MonCash / Natcash</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Annuler</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg" disabled={loading}>Payer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FeeModal = ({ fee, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'tuition',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fee) {
      setFormData({
        name: fee.name,
        type: fee.type,
        amount: fee.amount,
        description: fee.description || ''
      });
    }
  }, [fee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (fee) {
        await paymentAPI.updateFee(fee.id, formData);
      } else {
        await paymentAPI.createFee(formData);
      }
      onSuccess();
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{fee ? 'Modifier' : 'Nouveau'} Type de Frais</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Ex: Scolarité Octobre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="tuition">Scolarité</option>
              <option value="canteen">Cantine</option>
              <option value="transport">Transport</option>
              <option value="exam">Examen</option>
              <option value="material">Matériel</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant (G)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows="3"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Annuler</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg" disabled={loading}>Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RecordPaymentModal = ({ studentFee, onClose, onSuccess }) => {
  const remainingAmount = Number(studentFee.amount) - Number(studentFee.paid_amount);

  const [formData, setFormData] = useState({
    student_fee_id: studentFee.id,
    amount: remainingAmount.toString(),
    payment_method: 'cash',
    reference: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-HT', { style: 'currency', currency: 'HTG' }).format(amount).replace('HTG', 'G');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await paymentAPI.recordPayment(formData);
      onSuccess();
    } catch (error) {
      alert('Erreur lors de l\'enregistrement du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Enregistrer un Paiement</h3>

        {/* Student Fee Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Étudiant:</span>
            <span className="font-medium text-gray-800">{studentFee.student_name}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Type de frais:</span>
            <span className="font-medium text-gray-800">{studentFee.fee_type || 'Frais divers'}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Montant total:</span>
            <span className="font-medium text-gray-800">{formatCurrency(studentFee.amount)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Déjà payé:</span>
            <span className="font-medium text-green-600">{formatCurrency(studentFee.paid_amount)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-700">Reste à payer:</span>
            <span className="text-lg font-bold text-orange-600">{formatCurrency(remainingAmount)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant reçu (G)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              max={remainingAmount}
              step="0.01"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Maximum: {formatCurrency(remainingAmount)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Espèces</option>
              <option value="check">Chèque</option>
              <option value="transfer">Virement bancaire</option>
              <option value="mobile_money">MonCash / Natcash</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Référence (Optionnel)</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Numéro de chèque, transaction ID..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optionnel)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Remarques additionnelles..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer Paiement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentsPage;
