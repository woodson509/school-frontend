/**
 * Activity Logs Page
 * View system activity and audit logs
 */

import { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  User,
  Settings,
  FileText,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Eye,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const sampleLogs = [
      { id: 1, action: 'Connexion', user: 'admin@example.com', type: 'auth', ip: '192.168.1.1', details: 'Connexion réussie', timestamp: '2024-12-15 14:32:15' },
      { id: 2, action: 'Création utilisateur', user: 'admin@example.com', type: 'user', ip: '192.168.1.1', details: 'Nouvel étudiant: Jean Pierre', timestamp: '2024-12-15 14:30:00' },
      { id: 3, action: 'Modification cours', user: 'teacher@example.com', type: 'course', ip: '192.168.1.25', details: 'Cours MATH-101 mis à jour', timestamp: '2024-12-15 14:25:30' },
      { id: 4, action: 'Suppression note', user: 'admin@example.com', type: 'grade', ip: '192.168.1.1', details: 'Note supprimée pour Marie Claire', timestamp: '2024-12-15 14:20:00' },
      { id: 5, action: 'Déconnexion', user: 'student@example.com', type: 'auth', ip: '192.168.1.50', details: 'Déconnexion manuelle', timestamp: '2024-12-15 14:15:00' },
      { id: 6, action: 'Export données', user: 'admin@example.com', type: 'system', ip: '192.168.1.1', details: 'Export utilisateurs CSV', timestamp: '2024-12-15 14:10:00' },
      { id: 7, action: 'Modification paramètres', user: 'admin@example.com', type: 'settings', ip: '192.168.1.1', details: 'Fuseau horaire modifié', timestamp: '2024-12-15 14:05:00' },
      { id: 8, action: 'Connexion échouée', user: 'unknown@example.com', type: 'auth', ip: '192.168.1.100', details: 'Mot de passe incorrect (3 tentatives)', timestamp: '2024-12-15 14:00:00' },
      { id: 9, action: 'Publication annonce', user: 'admin@example.com', type: 'announcement', ip: '192.168.1.1', details: 'Annonce: Vacances de Noël', timestamp: '2024-12-15 13:55:00' },
      { id: 10, action: 'Inscription examen', user: 'student@example.com', type: 'exam', ip: '192.168.1.50', details: 'Inscription à MATH-101 Final', timestamp: '2024-12-15 13:50:00' },
      { id: 11, action: 'Paiement enregistré', user: 'admin@example.com', type: 'payment', ip: '192.168.1.1', details: 'Paiement $5000 - Jean Pierre', timestamp: '2024-12-15 13:45:00' },
      { id: 12, action: 'Sauvegarde système', user: 'système', type: 'system', ip: 'localhost', details: 'Sauvegarde automatique réussie', timestamp: '2024-12-15 12:00:00' },
    ];
    
    setTimeout(() => {
      setLogs(sampleLogs);
      setLoading(false);
    }, 500);
  }, []);

  const logTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'auth', label: 'Authentification' },
    { value: 'user', label: 'Utilisateurs' },
    { value: 'course', label: 'Cours' },
    { value: 'grade', label: 'Notes' },
    { value: 'exam', label: 'Examens' },
    { value: 'payment', label: 'Paiements' },
    { value: 'settings', label: 'Paramètres' },
    { value: 'system', label: 'Système' },
    { value: 'announcement', label: 'Annonces' },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTypeIcon = (type) => {
    const icons = {
      auth: LogIn,
      user: User,
      course: FileText,
      grade: Edit,
      exam: FileText,
      payment: FileText,
      settings: Settings,
      system: Settings,
      announcement: FileText,
    };
    const Icon = icons[type] || History;
    return <Icon className="w-4 h-4" />;
  };

  const getTypeBadge = (type) => {
    const styles = {
      auth: 'bg-blue-100 text-blue-700',
      user: 'bg-green-100 text-green-700',
      course: 'bg-purple-100 text-purple-700',
      grade: 'bg-orange-100 text-orange-700',
      exam: 'bg-indigo-100 text-indigo-700',
      payment: 'bg-emerald-100 text-emerald-700',
      settings: 'bg-gray-100 text-gray-700',
      system: 'bg-red-100 text-red-700',
      announcement: 'bg-pink-100 text-pink-700',
    };
    const labels = {
      auth: 'Auth',
      user: 'Utilisateur',
      course: 'Cours',
      grade: 'Note',
      exam: 'Examen',
      payment: 'Paiement',
      settings: 'Paramètres',
      system: 'Système',
      announcement: 'Annonce',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {labels[type]}
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
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {logTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input type="date" className="border-none focus:outline-none text-sm" />
            <span className="text-gray-400">-</span>
            <input type="date" className="border-none focus:outline-none text-sm" />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{logs.length}</p>
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
              <p className="text-xl font-bold text-gray-800">
                {logs.filter(l => l.type === 'auth' && l.action.includes('Connexion') && !l.action.includes('échouée')).length}
              </p>
              <p className="text-sm text-gray-500">Connexions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                {logs.filter(l => l.action.includes('échouée')).length}
              </p>
              <p className="text-sm text-gray-500">Erreurs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Edit className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                {logs.filter(l => l.action.includes('Modification') || l.action.includes('Création')).length}
              </p>
              <p className="text-sm text-gray-500">Modifications</p>
            </div>
          </div>
        </div>
      </div>

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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Détails</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(log.type)}
                    <span className="font-medium text-gray-800">{log.action}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{log.user}</td>
                <td className="px-6 py-4">{getTypeBadge(log.type)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.ip}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
            {Math.min(currentPage * itemsPerPage, filteredLogs.length)} sur{' '}
            {filteredLogs.length} entrées
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
