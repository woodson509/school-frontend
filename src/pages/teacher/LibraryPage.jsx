/**
 * Teacher Library Page
 * Personal teaching resources library
 */

import { useState } from 'react';
import {
  Folder,
  FileText,
  Video,
  Image,
  File,
  Upload,
  Search,
  Plus,
  Download,
  Share2,
  Star,
  Trash2,
  Edit,
  Filter,
} from 'lucide-react';

const TeacherLibraryPage = () => {
  const [resources, setResources] = useState([
    { id: 1, name: 'Cours Intégrales.pdf', type: 'pdf', folder: 'Calcul', size: '2.4 MB', date: '2024-12-10', favorite: true, downloads: 45, shares: 3 },
    { id: 2, name: 'Exercices corrigés.pdf', type: 'pdf', folder: 'Calcul', size: '1.8 MB', date: '2024-12-08', favorite: false, downloads: 32, shares: 2 },
    { id: 3, name: 'Vidéo Dérivées.mp4', type: 'video', folder: 'Analyse', size: '156 MB', date: '2024-12-05', favorite: true, downloads: 28, shares: 5 },
    { id: 4, name: 'Schémas Géométrie.png', type: 'image', folder: 'Géométrie', size: '4.2 MB', date: '2024-12-03', favorite: false, downloads: 18, shares: 1 },
    { id: 5, name: 'Quiz Probabilités.docx', type: 'doc', folder: 'Statistiques', size: '0.5 MB', date: '2024-12-01', favorite: true, downloads: 41, shares: 4 },
    { id: 6, name: 'TP Python.py', type: 'code', folder: 'Informatique', size: '0.1 MB', date: '2024-11-28', favorite: false, downloads: 22, shares: 1 },
  ]);

  const [folders, setFolders] = useState([
    { id: 1, name: 'Calcul', count: 15, color: '#3B82F6' },
    { id: 2, name: 'Analyse', count: 12, color: '#8B5CF6' },
    { id: 3, name: 'Géométrie', count: 18, color: '#EF4444' },
    { id: 4, name: 'Statistiques', count: 9, color: '#F59E0B' },
    { id: 5, name: 'Informatique', count: 7, color: '#10B981' },
  ]);

  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const getTypeIcon = (type) => {
    const icons = {
      pdf: <FileText className="w-5 h-5 text-red-500" />,
      video: <Video className="w-5 h-5 text-purple-500" />,
      image: <Image className="w-5 h-5 text-green-500" />,
      doc: <FileText className="w-5 h-5 text-blue-500" />,
      code: <File className="w-5 h-5 text-orange-500" />,
    };
    return icons[type] || <File className="w-5 h-5 text-gray-500" />;
  };

  const filteredResources = resources.filter(r => {
    const matchesFolder = selectedFolder === 'all' || r.folder === selectedFolder;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const toggleFavorite = (id) => {
    setResources(resources.map(r => r.id === id ? {...r, favorite: !r.favorite} : r));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ma bibliothèque</h1>
          <p className="text-gray-500">{resources.length} ressources • {folders.length} dossiers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Upload className="w-4 h-4" />
          Importer des fichiers
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total ressources</p>
          <p className="text-2xl font-bold text-gray-800">{resources.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Favoris</p>
          <p className="text-2xl font-bold text-yellow-600">{resources.filter(r => r.favorite).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Téléchargements</p>
          <p className="text-2xl font-bold text-blue-600">{resources.reduce((sum, r) => sum + r.downloads, 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Partages</p>
          <p className="text-2xl font-bold text-green-600">{resources.reduce((sum, r) => sum + r.shares, 0)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Dossiers</h3>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedFolder('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedFolder === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Tous les fichiers
                </span>
                <span className="text-sm">{resources.length}</span>
              </button>
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedFolder === folder.name ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Folder className="w-4 h-4" style={{ color: folder.color }} />
                    {folder.name}
                  </span>
                  <span className="text-sm">{folder.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid/List */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <div key={resource.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      {getTypeIcon(resource.type)}
                    </div>
                    <button
                      onClick={() => toggleFavorite(resource.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Star className={`w-4 h-4 ${resource.favorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">{resource.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span>{resource.size}</span>
                    <span>•</span>
                    <span>{resource.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>↓ {resource.downloads}</span>
                    <span>⤴ {resource.shares}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      Ouvrir
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dossier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredResources.map(resource => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(resource.type)}
                          <span className="font-medium text-gray-800">{resource.name}</span>
                          {resource.favorite && <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{resource.folder}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{resource.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{resource.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Share2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherLibraryPage;
