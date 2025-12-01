/**
 * Curricula Management Page
 * Manage academic programs and curricula
 */

import { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Clock,
  Users,
  ChevronRight,
  Copy,
  CheckCircle,
} from 'lucide-react';
import { curriculumAPI } from '../../services/api';

const CurriculaPage = () => {
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);

  useEffect(() => {
    fetchCurricula();
  }, []);

  const fetchCurricula = async () => {
    try {
      setLoading(true);
      const response = await curriculumAPI.getAll();
      if (response.success) {
        setCurricula(response.data);
      }
    } catch (error) {
      console.error('Error fetching curricula:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCurricula = curricula.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      try {
        await curriculumAPI.delete(id);
        setCurricula(curricula.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting curriculum:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedCurriculum) {
        const response = await curriculumAPI.update(selectedCurriculum.id, data);
        if (response.success) {
          setCurricula(curricula.map(c => c.id === selectedCurriculum.id ? response.data : c));
        }
      } else {
        const response = await curriculumAPI.create(data);
        if (response.success) {
          setCurricula([...curricula, response.data]);
        }
      }
      setShowModal(false);
      setSelectedCurriculum(null);
    } catch (error) {
      console.error('Error saving curriculum:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const openEditModal = (curriculum) => {
    setSelectedCurriculum(curriculum);
    setShowModal(true);
  };

  const openNewModal = () => {
    setSelectedCurriculum(null);
    setShowModal(true);
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un programme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau programme
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{curricula.length}</p>
              <p className="text-sm text-gray-500">Programmes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {curricula.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-gray-500">Actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {curricula.reduce((acc, c) => acc + (parseInt(c.subjects_count) || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Matières total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {curricula.reduce((acc, c) => acc + (parseInt(c.classes_count) || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Classes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Curricula List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCurricula.map((curriculum) => (
          <div
            key={curriculum.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className={`h-2 ${curriculum.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {curriculum.code}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${curriculum.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {curriculum.status === 'active' ? 'Actif' : 'Brouillon'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{curriculum.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{curriculum.level}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Dupliquer">
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => openEditModal(curriculum)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(curriculum.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{curriculum.description}</p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">{curriculum.duration || '-'}</p>
                  <p className="text-xs text-gray-500">Durée</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">{curriculum.subjects_count || 0}</p>
                  <p className="text-xs text-gray-500">Matières</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">{curriculum.total_credits || 0}</p>
                  <p className="text-xs text-gray-500">Crédits</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <CurriculumModal
          curriculum={selectedCurriculum}
          onClose={() => { setShowModal(false); setSelectedCurriculum(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const CurriculumModal = ({ curriculum, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: curriculum?.name || '',
    code: curriculum?.code || '',
    level: curriculum?.level || 'Secondaire',
    duration: curriculum?.duration || '',
    total_credits: curriculum?.total_credits || '',
    status: curriculum?.status || 'draft',
    description: curriculum?.description || '',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {curriculum ? 'Modifier le programme' : 'Nouveau programme'}
        </h3>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du programme</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Primaire">Primaire</option>
                <option value="Secondaire">Secondaire</option>
                <option value="Terminale">Terminale</option>
                <option value="Technique">Technique</option>
                <option value="Universitaire">Universitaire</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ex: 3 ans"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total crédits</label>
              <input
                type="number"
                value={formData.total_credits}
                onChange={(e) => setFormData({ ...formData, total_credits: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Brouillon</option>
              <option value="active">Actif</option>
              <option value="archived">Archivé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {curriculum ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurriculaPage;
