/**
 * Subjects Management Page
 * Manage academic subjects/disciplines
 */

import { useState, useEffect } from 'react';
import {
  BookMarked,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  BookOpen,
  Clock,
  Users,
} from 'lucide-react';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    const sampleSubjects = [
      { id: 1, name: 'Mathématiques', code: 'MATH', description: 'Algèbre, géométrie, analyse', courses: 12, teachers: 5, color: '#3B82F6' },
      { id: 2, name: 'Physique', code: 'PHY', description: 'Mécanique, optique, électricité', courses: 8, teachers: 3, color: '#8B5CF6' },
      { id: 3, name: 'Chimie', code: 'CHEM', description: 'Chimie organique et inorganique', courses: 6, teachers: 2, color: '#10B981' },
      { id: 4, name: 'Informatique', code: 'CS', description: 'Programmation, algorithmique', courses: 15, teachers: 6, color: '#F59E0B' },
      { id: 5, name: 'Français', code: 'FR', description: 'Littérature et grammaire', courses: 10, teachers: 4, color: '#EF4444' },
      { id: 6, name: 'Anglais', code: 'EN', description: 'Langue anglaise', courses: 8, teachers: 3, color: '#6366F1' },
      { id: 7, name: 'Histoire', code: 'HIST', description: 'Histoire mondiale et locale', courses: 5, teachers: 2, color: '#EC4899' },
      { id: 8, name: 'Biologie', code: 'BIO', description: 'Sciences de la vie', courses: 7, teachers: 3, color: '#14B8A6' },
    ];
    
    setTimeout(() => {
      setSubjects(sampleSubjects);
      setLoading(false);
    }, 500);
  }, []);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      setSubjects(subjects.filter(s => s.id !== id));
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une matière..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle matière
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookMarked className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{subjects.length}</p>
              <p className="text-sm text-gray-500">Matières</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {subjects.reduce((acc, s) => acc + s.courses, 0)}
              </p>
              <p className="text-sm text-gray-500">Cours total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {subjects.reduce((acc, s) => acc + s.teachers, 0)}
              </p>
              <p className="text-sm text-gray-500">Professeurs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">156</p>
              <p className="text-sm text-gray-500">Heures/semaine</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="h-2"
              style={{ backgroundColor: subject.color }}
            ></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${subject.color}20` }}
                >
                  <BookMarked className="w-6 h-6" style={{ color: subject.color }} />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingSubject(subject);
                      setShowModal(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-1">{subject.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{subject.code}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{subject.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{subject.courses} cours</span>
                <span className="text-gray-500">{subject.teachers} profs</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <SubjectModal
          subject={editingSubject}
          onClose={() => {
            setShowModal(false);
            setEditingSubject(null);
          }}
          onSave={(data) => {
            if (editingSubject) {
              setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, ...data } : s));
            } else {
              setSubjects([...subjects, { ...data, id: Date.now(), courses: 0, teachers: 0 }]);
            }
            setShowModal(false);
            setEditingSubject(null);
          }}
        />
      )}
    </div>
  );
};

const SubjectModal = ({ subject, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: subject?.name || '',
    code: subject?.code || '',
    description: subject?.description || '',
    color: subject?.color || '#3B82F6',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {subject ? 'Modifier la matière' : 'Nouvelle matière'}
        </h3>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {subject ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectsPage;
