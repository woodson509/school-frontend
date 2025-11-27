/**
 * Backup Management Page
 * Manage system backups and restore
 * Connected to backend API
 */

import { useState, useEffect } from 'react';
import {
  Database,
  Download,
  Upload,
  CheckCircle,
  HardDrive,
  Cloud,
  RefreshCw,
  Trash2,
  Settings,
  Loader,
  AlertCircle,
} from 'lucide-react';
import { backupAPI } from '../../services/api';

const BackupPage = () => {
  const [backups, setBackups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBackups();
    fetchStats();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await backupAPI.getAll();
      if (response.success) {
        setBackups(response.data);
      }
    } catch (err) {
      console.error('Error fetching backups:', err);
      setError('Erreur lors du chargement des sauvegardes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await backupAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleBackup = async () => {
    try {
      setBackupInProgress(true);
      setError(null);
      const response = await backupAPI.create();

      if (response.success) {
        alert('✅ Sauvegarde créée avec succès !');
        fetchBackups();
        fetchStats();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Backup error:', err);
      alert('❌ Erreur lors de la sauvegarde : ' + err.message);
    } finally {
      setBackupInProgress(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      await backupAPI.download(filename);
    } catch (err) {
      console.error('Download error:', err);
      alert('Erreur lors du téléchargement');
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${filename} ?`)) return;

    try {
      const response = await backupAPI.delete(filename);
      if (response.success) {
        fetchBackups();
        fetchStats();
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Erreur lors de la suppression');
    }
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

  if (loading && backups.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Sauvegarde manuelle</h3>
              <p className="text-sm text-gray-500">Créer une sauvegarde maintenant</p>
            </div>
          </div>
          <button
            onClick={handleBackup}
            disabled={backupInProgress}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {backupInProgress ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                En cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Sauvegarder maintenant
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Information</h3>
              <p className="text-sm text-gray-500">Les sauvegardes sont stockées localement</p>
            </div>
          </div>
          <button
            onClick={fetchBackups}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Backup Progress */}
      {backupInProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="font-medium text-blue-800">Sauvegarde en cours...</span>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            Veuillez patienter, cela peut prendre quelques minutes.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Storage Stats */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <HardDrive className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Stockage local</h3>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{stats.used} {stats.unit} utilisés</span>
              <span className="text-gray-500">{stats.total} {stats.unit}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(stats.used / stats.total) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {(stats.total - stats.used).toFixed(2)} {stats.unit} disponibles · {stats.total_backups} sauvegarde(s)
          </p>
        </div>
      )}

      {/* Backups List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Historique des sauvegardes</h3>
          <span className="text-sm text-gray-500">{backups.length} sauvegarde(s)</span>
        </div>

        {backups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune sauvegarde disponible</p>
            <p className="text-sm mt-1">Créez votre première sauvegarde</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Taille</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stockage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-800">{backup.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(backup.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{backup.size}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${backup.type === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                      {backup.type === 'auto' ? 'Automatique' : 'Manuelle'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {backup.storage === 'cloud' ? (
                        <Cloud className="w-4 h-4 text-green-600" />
                      ) : (
                        <HardDrive className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="text-sm text-gray-600">
                        {backup.storage === 'cloud' ? 'Cloud' : 'Local'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Complète</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDownload(backup.filename)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(backup.filename)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Comment restaurer une sauvegarde ?</h4>
        <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
          <li>Téléchargez le fichier .sql désiré</li>
          <li>Utilisez un outil comme pgAdmin ou psql</li>
          <li>Exécutez : <code className="bg-blue-100 px-1 rounded">psql -U postgres -d school_management -f backup_file.sql</code></li>
        </ol>
      </div>
    </div>
  );
};

export default BackupPage;
