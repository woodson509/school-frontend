/**
 * Backup Management Page
 * Manage system backups and restore
 */

import { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  HardDrive,
  Cloud,
  RefreshCw,
  Trash2,
  Calendar,
  Settings,
} from 'lucide-react';

const BackupPage = () => {
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const backups = [
    { id: 1, name: 'backup_2024-12-15_23-00.sql', date: '2024-12-15 23:00', size: '245 MB', type: 'auto', status: 'completed', storage: 'local' },
    { id: 2, name: 'backup_2024-12-14_23-00.sql', date: '2024-12-14 23:00', size: '243 MB', type: 'auto', status: 'completed', storage: 'cloud' },
    { id: 3, name: 'backup_2024-12-13_23-00.sql', date: '2024-12-13 23:00', size: '241 MB', type: 'auto', status: 'completed', storage: 'local' },
    { id: 4, name: 'backup_manual_2024-12-12.sql', date: '2024-12-12 14:30', size: '240 MB', type: 'manual', status: 'completed', storage: 'cloud' },
    { id: 5, name: 'backup_2024-12-11_23-00.sql', date: '2024-12-11 23:00', size: '238 MB', type: 'auto', status: 'completed', storage: 'local' },
  ];

  const storageStats = {
    local: { used: 1.2, total: 10, unit: 'GB' },
    cloud: { used: 3.5, total: 50, unit: 'GB' },
  };

  const handleBackup = () => {
    setBackupInProgress(true);
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupInProgress(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
      // Delete backup
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                En cours... {backupProgress}%
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
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Restaurer</h3>
              <p className="text-sm text-gray-500">Restaurer depuis une sauvegarde</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            Sélectionner un fichier
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Planification</h3>
              <p className="text-sm text-gray-500">Configurer les sauvegardes auto</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            Configurer
          </button>
        </div>
      </div>

      {/* Backup Progress */}
      {backupInProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="font-medium text-blue-800">Sauvegarde en cours...</span>
            </div>
            <span className="text-blue-600">{backupProgress}%</span>
          </div>
          <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${backupProgress}%` }}
            />
          </div>
          <p className="text-sm text-blue-600 mt-2">
            Veuillez ne pas fermer cette page pendant la sauvegarde.
          </p>
        </div>
      )}

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <HardDrive className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Stockage local</h3>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{storageStats.local.used} {storageStats.local.unit} utilisés</span>
              <span className="text-gray-500">{storageStats.local.total} {storageStats.local.unit}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(storageStats.local.used / storageStats.local.total) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {storageStats.local.total - storageStats.local.used} {storageStats.local.unit} disponibles
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cloud className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Stockage cloud</h3>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{storageStats.cloud.used} {storageStats.cloud.unit} utilisés</span>
              <span className="text-gray-500">{storageStats.cloud.total} {storageStats.cloud.unit}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${(storageStats.cloud.used / storageStats.cloud.total) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {storageStats.cloud.total - storageStats.cloud.used} {storageStats.cloud.unit} disponibles
          </p>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Configuration des sauvegardes automatiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Heure d'exécution</label>
            <input
              type="time"
              defaultValue="23:00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rétention (jours)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">Sauvegarde sur le cloud</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">Notification par email</span>
          </label>
        </div>
      </div>

      {/* Backups List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Historique des sauvegardes</h3>
          <span className="text-sm text-gray-500">{backups.length} sauvegardes</span>
        </div>
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
                <td className="px-6 py-4 text-sm text-gray-600">{backup.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{backup.size}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    backup.type === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
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
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Télécharger">
                      <Download className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Restaurer">
                      <Upload className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(backup.id)}
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
      </div>
    </div>
  );
};

export default BackupPage;
