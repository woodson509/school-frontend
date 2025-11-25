/**
 * Import/Export Page
 * Import and export data in various formats
 */

import { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  File,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  BookOpen,
  Award,
  Building2,
  Trash2,
} from 'lucide-react';

const ImportExportPage = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const exportOptions = [
    { id: 'users', label: 'Utilisateurs', icon: Users, description: 'Tous les utilisateurs du système', formats: ['CSV', 'Excel', 'JSON'] },
    { id: 'students', label: 'Étudiants', icon: Users, description: 'Liste des étudiants avec détails', formats: ['CSV', 'Excel'] },
    { id: 'teachers', label: 'Professeurs', icon: Users, description: 'Liste des professeurs', formats: ['CSV', 'Excel'] },
    { id: 'courses', label: 'Cours', icon: BookOpen, description: 'Tous les cours et programmes', formats: ['CSV', 'Excel', 'JSON'] },
    { id: 'grades', label: 'Notes', icon: Award, description: 'Notes et résultats des examens', formats: ['CSV', 'Excel'] },
    { id: 'schools', label: 'Écoles', icon: Building2, description: 'Informations des écoles', formats: ['CSV', 'Excel', 'JSON'] },
  ];

  const importTemplates = [
    { id: 'users', label: 'Utilisateurs', description: 'Importer des utilisateurs en masse', fields: ['email', 'full_name', 'role', 'school_id'] },
    { id: 'students', label: 'Étudiants', description: 'Importer des étudiants', fields: ['email', 'full_name', 'class', 'parent_email'] },
    { id: 'grades', label: 'Notes', description: 'Importer des notes', fields: ['student_email', 'course_code', 'exam_id', 'score'] },
    { id: 'courses', label: 'Cours', description: 'Importer des cours', fields: ['title', 'code', 'credits', 'teacher_email'] },
  ];

  const recentExports = [
    { id: 1, name: 'users_export_2024-12-15.csv', type: 'Utilisateurs', date: '2024-12-15 14:30', size: '2.4 MB', status: 'completed' },
    { id: 2, name: 'grades_q3_2024.xlsx', type: 'Notes', date: '2024-12-14 10:15', size: '1.8 MB', status: 'completed' },
    { id: 3, name: 'students_all.csv', type: 'Étudiants', date: '2024-12-13 16:45', size: '856 KB', status: 'completed' },
  ];

  const recentImports = [
    { id: 1, name: 'new_students_batch.csv', type: 'Étudiants', date: '2024-12-15 09:00', records: 150, status: 'completed', errors: 0 },
    { id: 2, name: 'grades_update.xlsx', type: 'Notes', date: '2024-12-14 11:30', records: 480, status: 'completed', errors: 3 },
    { id: 3, name: 'teachers_2024.csv', type: 'Professeurs', date: '2024-12-12 14:00', records: 25, status: 'completed', errors: 0 },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImporting(true);
      setImportProgress(0);
      const interval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setImporting(false);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('import')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'import'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="w-5 h-5" />
              Importer
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'export'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Download className="w-5 h-5" />
              Exporter
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              {/* Upload Zone */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Glissez-déposez votre fichier ici
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    ou cliquez pour sélectionner un fichier
                  </p>
                  <p className="text-xs text-gray-400">
                    Formats supportés: CSV, Excel (.xlsx, .xls), JSON
                  </p>
                </label>
              </div>

              {/* Import Progress */}
              {importing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800">Import en cours...</span>
                    <span className="text-blue-600">{importProgress}%</span>
                  </div>
                  <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Import Templates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Modèles d'import</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importTemplates.map(template => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">{template.label}</h4>
                          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Colonnes: {template.fields.join(', ')}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Télécharger
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Imports */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Imports récents</h3>
                <div className="space-y-3">
                  {recentImports.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <FileSpreadsheet className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.type} • {item.records} enregistrements</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{item.date}</p>
                          {item.errors > 0 ? (
                            <p className="text-xs text-orange-600">{item.errors} erreurs</p>
                          ) : (
                            <p className="text-xs text-green-600">Sans erreurs</p>
                          )}
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              {/* Export Options */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Données à exporter</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exportOptions.map(option => (
                    <div key={option.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <option.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{option.label}</h4>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {option.formats.map(format => (
                          <button
                            key={format}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
                          >
                            {format}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Options d'export</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Période</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Toutes les données</option>
                      <option>Cette année</option>
                      <option>Ce trimestre</option>
                      <option>Ce mois</option>
                      <option>Personnalisé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">École</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Toutes les écoles</option>
                      <option>École Saint-Jean</option>
                      <option>Lycée National</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Format de date</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Recent Exports */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Exports récents</h3>
                <div className="space-y-3">
                  {recentExports.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <File className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.type} • {item.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{item.date}</span>
                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                          <Download className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExportPage;
