/**
 * Student Resources Page
 * Access course materials and documents
 */

import { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Video,
  Image,
  Download,
  Search,
  Filter,
  Eye,
  BookOpen,
  File,
  Music,
  ChevronRight,
  FolderOpen,
  ArrowLeft,
} from 'lucide-react';

const StudentResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    const sampleResources = [
      // Folders
      { id: 1, name: 'Mathématiques', type: 'folder', color: '#3B82F6', itemCount: 12, updatedAt: '2024-12-15' },
      { id: 2, name: 'Physique', type: 'folder', color: '#8B5CF6', itemCount: 8, updatedAt: '2024-12-14' },
      { id: 3, name: 'Français', type: 'folder', color: '#EF4444', itemCount: 15, updatedAt: '2024-12-13' },
      { id: 4, name: 'Informatique', type: 'folder', color: '#6366F1', itemCount: 20, updatedAt: '2024-12-12' },
      { id: 5, name: 'Histoire', type: 'folder', color: '#EC4899', itemCount: 6, updatedAt: '2024-12-10' },
      // Files
      { id: 6, name: 'Programme année scolaire.pdf', type: 'pdf', size: '2.4 MB', course: 'Général', updatedAt: '2024-12-01' },
      { id: 7, name: 'Règlement intérieur.pdf', type: 'pdf', size: '1.1 MB', course: 'Général', updatedAt: '2024-09-01' },
    ];

    setTimeout(() => {
      setResources(sampleResources);
      setLoading(false);
    }, 500);
  }, []);

  const folderContents = {
    1: [ // Mathématiques
      { id: 101, name: 'Chapitre 1 - Limites', type: 'folder', itemCount: 5 },
      { id: 102, name: 'Chapitre 2 - Dérivées', type: 'folder', itemCount: 4 },
      { id: 103, name: 'Chapitre 3 - Intégrales', type: 'folder', itemCount: 6 },
      { id: 104, name: 'Formulaire complet.pdf', type: 'pdf', size: '3.2 MB' },
      { id: 105, name: 'Exercices corrigés.pdf', type: 'pdf', size: '5.8 MB' },
      { id: 106, name: 'Vidéo - Introduction aux intégrales.mp4', type: 'video', size: '145 MB', duration: '25:30' },
    ],
    2: [ // Physique
      { id: 201, name: 'TP1 - Optique.pdf', type: 'pdf', size: '1.5 MB' },
      { id: 202, name: 'Cours Mécanique.pdf', type: 'pdf', size: '4.2 MB' },
      { id: 203, name: 'Simulation optique.html', type: 'link', url: 'https://phet.colorado.edu' },
      { id: 204, name: 'Expérience lumière.mp4', type: 'video', size: '89 MB', duration: '12:45' },
    ],
  };

  const getFileIcon = (type) => {
    const icons = {
      folder: Folder,
      pdf: FileText,
      video: Video,
      image: Image,
      audio: Music,
      link: BookOpen,
    };
    return icons[type] || File;
  };

  const getFileColor = (type) => {
    const colors = {
      folder: '#F59E0B',
      pdf: '#EF4444',
      video: '#8B5CF6',
      image: '#10B981',
      audio: '#EC4899',
      link: '#3B82F6',
    };
    return colors[type] || '#6B7280';
  };

  const openFolder = (folder) => {
    setCurrentFolder(folder.id);
    setBreadcrumb([...breadcrumb, { id: folder.id, name: folder.name }]);
  };

  const goBack = () => {
    if (breadcrumb.length > 0) {
      const newBreadcrumb = [...breadcrumb];
      newBreadcrumb.pop();
      setBreadcrumb(newBreadcrumb);
      setCurrentFolder(newBreadcrumb.length > 0 ? newBreadcrumb[newBreadcrumb.length - 1].id : null);
    }
  };

  const goToBreadcrumb = (index) => {
    if (index === -1) {
      setBreadcrumb([]);
      setCurrentFolder(null);
    } else {
      const newBreadcrumb = breadcrumb.slice(0, index + 1);
      setBreadcrumb(newBreadcrumb);
      setCurrentFolder(newBreadcrumb[newBreadcrumb.length - 1].id);
    }
  };

  const currentResources = currentFolder ? (folderContents[currentFolder] || []) : resources;

  const filteredResources = currentResources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || r.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ressources</h1>
          <p className="text-gray-500">Documents de cours et supports pédagogiques</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 w-64"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tous types</option>
            <option value="folder">Dossiers</option>
            <option value="pdf">PDF</option>
            <option value="video">Vidéos</option>
            <option value="image">Images</option>
          </select>
        </div>
      </div>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => goToBreadcrumb(-1)}
            className="text-emerald-600 hover:underline"
          >
            Accueil
          </button>
          {breadcrumb.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => goToBreadcrumb(index)}
                className={`${
                  index === breadcrumb.length - 1
                    ? 'text-gray-800 font-medium'
                    : 'text-emerald-600 hover:underline'
                }`}
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Folder className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">5</p>
              <p className="text-xs text-gray-500">Dossiers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">48</p>
              <p className="text-xs text-gray-500">Documents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-xs text-gray-500">Vidéos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">156 MB</p>
              <p className="text-xs text-gray-500">Téléchargés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">
            {currentFolder ? breadcrumb[breadcrumb.length - 1]?.name : 'Tous les fichiers'}
          </h3>
        </div>
        <div className="p-4">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun fichier trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredResources.map((resource) => {
                const IconComponent = getFileIcon(resource.type);
                const color = resource.type === 'folder' ? (resource.color || '#F59E0B') : getFileColor(resource.type);
                
                return (
                  <div
                    key={resource.id}
                    onClick={() => resource.type === 'folder' && openFolder(resource)}
                    className={`p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all text-center ${
                      resource.type === 'folder' ? 'cursor-pointer' : ''
                    }`}
                  >
                    <div
                      className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <IconComponent className="w-8 h-8" style={{ color }} />
                    </div>
                    <p className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                      {resource.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {resource.type === 'folder' 
                        ? `${resource.itemCount} éléments`
                        : resource.size
                      }
                    </p>
                    {resource.type !== 'folder' && (
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentResourcesPage;
