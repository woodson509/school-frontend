/**
 * Classes Management Page
 * Manage school classes and sections
 */

import { useState, useEffect } from 'react';
import {
  School,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { classAPI } from '../../services/api';

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classAPI.getAll();
      if (response.success) {
        // Map API data to frontend format
        const mappedClasses = response.data.map(cls => ({
          ...cls,
          level: cls.grade_level,
          year: cls.school_year,
          teacher: cls.teacher_name || 'Non assigné',
          students: 0, // TODO: Fetch real count
          room: 'Non défini', // Not in DB yet
          schedule: 'Non défini' // Not in DB yet
        }));
        setClasses(mappedClasses);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const levels = ['all', 'Primaire', 'Collège', 'Lycée', 'Université'];

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || cls.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      try {
        await classAPI.delete(id);
        setClasses(classes.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('Erreur lors de la suppression de la classe');
      }
    }
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
              placeholder="Rechercher une classe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les niveaux</option>
            {levels.slice(1).map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle classe
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <School className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{classes.length}</p>
              <p className="text-sm text-gray-500">Classes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {classes.reduce((acc, c) => acc + (c.students || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Étudiants</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">2024-2025</p>
              <p className="text-sm text-gray-500">Année scolaire</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">0</p>
              <p className="text-sm text-gray-500">Moyenne/classe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Classe</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Niveau</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Professeur principal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Salle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Étudiants</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Horaire</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClasses.map((cls) => (
              <tr key={cls.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <School className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-800">{cls.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {cls.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{cls.teacher}</td>
                <td className="px-6 py-4 text-gray-600">{cls.room}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{cls.students || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${cls.schedule === 'Matin' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                    {cls.schedule}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir détails">
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => { setEditingClass(cls); setShowModal(true); }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
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

      {/* Modal */}
      {showModal && (
        <ClassModal
          classData={editingClass}
          onClose={() => { setShowModal(false); setEditingClass(null); }}
          onSave={async (data) => {
            try {
              if (editingClass) {
                await classAPI.update(editingClass.id, {
                  ...data,
                  grade_level: data.level,
                  school_year: data.year
                });
              } else {
                await classAPI.create({
                  ...data,
                  grade_level: data.level,
                  school_year: data.year
                });
              }
              fetchClasses();
              setShowModal(false);
              setEditingClass(null);
            } catch (error) {
              console.error('Error saving class:', error);
              alert('Erreur lors de l\'enregistrement de la classe');
            }
          }}
        />
      )}
    </div>
  );
};

const ClassModal = ({ classData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: classData?.name || '',
    level: classData?.level || 'Collège',
    year: classData?.year || '2024-2025',
    teacher_id: classData?.teacher_id || '',
    room: classData?.room || '',
    schedule: classData?.schedule || 'Matin',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {classData ? 'Modifier la classe' : 'Nouvelle classe'}
        </h3>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la classe</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Primaire">Primaire</option>
                <option value="Collège">Collège</option>
                <option value="Lycée">Lycée</option>
                <option value="Université">Université</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année scolaire</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Note: Teacher selection would ideally fetch teachers from API. */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horaire</label>
              <select
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Matin">Matin</option>
                <option value="Après-midi">Après-midi</option>
                <option value="Journée complète">Journée complète</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {classData ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassesPage;
