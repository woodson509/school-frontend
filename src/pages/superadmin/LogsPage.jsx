/**
 * Activity Logs Page
 * View system activity and audit logs
 * Connected to backend API
 */

import { useState, useEffect } from 'react';
import {
  History,
  Search,
  Download,
  User,
  Settings,
  FileText,
  LogIn,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader,
  RefreshCw,
} from 'lucide-react';
import { logAPI } from '../../services/api';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [currentPage, searchTerm, typeFilter, statusFilter, startDate, endDate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await logAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        type: typeFilter,
        status: statusFilter,
        startDate,
        endDate
      });

      if (response.success) {
        setLogs(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await logAPI.getStats({
        startDate,
        endDate
      });

      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await logAPI.exportCSV({
        search: searchTerm,
        type: typeFilter,
        status: statusFilter,
        startDate,
        endDate
      });
    } catch (err) {
      console.error('Error exporting logs:', err);
      alert('Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  const logTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'auth', label: 'Authentification' },
    { value: 'user', label: 'Utilisateurs' },
    { value: 'course', label: 'Cours' },
    { value: 'grade', label: 'Notes' },
    { value: 'exam', label: 'Examens' },
    { value: 'school', label: 'Écoles' },
    { value: 'role', label: 'Rôles' },
    { value: 'permission', label: 'Permissions' },
  ];

  const statusTypes = [
    { value: 'all', label: 'Tous statuts' },
    { value: 'success', label: 'Succès' },
    { value: 'failed', label: 'Échec' },
    { value: 'error', label: 'Erreur' },
  ];

  const getTypeIcon = (type) => {
    const icons = {
      auth: LogIn,
      user: User,
      settings: Settings,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const getTypeBadge = (type) => {
    const styles = {
      auth: 'bg-blue-100 text-blue-700',
      user: 'bg-green-100 text-green-700',
      course: 'bg-purple-100 text-purple-700',
      grade: 'bg-orange-100 text-orange-700',
      exam: 'bg-indigo-100 text-indigo-700',
      school: 'bg-emerald-100 text-emerald-700',
      role: 'bg-gray-100 text-gray-700',
      permission: 'bg-pink-100 text-pink-700',
    };
    const style = styles[type] || 'bg-gray-100 text-gray-700';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
        {type || 'N/A'}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      error: 'bg-orange-100 text-orange-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {logTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statusTypes.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border-none focus:outline-none text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border-none focus:outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Export...' : 'Exporter CSV'}
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{stats.total_logs || 0}</p>
                <p className="text-sm text-gray-500">Total logs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{stats.successful_actions || 0}</p>
                <p className="text-sm text-gray-500">Succès</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{stats.failed_actions + stats.errors || 0}</p>
                <p className="text-sm text-gray-500">Erreurs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{stats.unique_users || 0}</p>
                <p className="text-sm text-gray-500">Utilisateurs actifs</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Horodatage</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">IP</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(log.created_at)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(log.entity_type)}
                    <span className="font-medium text-gray-800">{log.action}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {log.user_email || 'Système'}
                </td>
                <td className="px-6 py-4">{getTypeBadge(log.entity_type)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.ip_address || 'N/A'}</td>
                <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            Aucun log trouvé
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} sur{' '}
              {pagination.total} entrées
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm">
                Page {pagination.page} sur {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;
