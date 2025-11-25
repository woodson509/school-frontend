/**
 * Courses Management Page for Admin
 * Full CRUD for courses
 */

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const sampleCourses = [
      { id: 1, title: 'Mathématiques Avancées', code: 'MATH-301', teacher: 'M. Dupont', school: 'École Saint-Jean', credits: 4, students: 45, status: 'active', lessons: 24 },
      { id: 2, title: 'Physique Quantique', code: 'PHY-401', teacher: 'M. Bernard', school: 'Lycée National', credits: 4, students: 32, status: 'active', lessons: 20 },
      { id: 3, title: 'Littérature Française', code: 'FR-201', teacher: 'Mme Martin', school: 'École Saint-Jean', credits: 3, students: 38, status: 'active', lessons: 18 },
      { id: 4, title: 'Programmation Python', code: 'CS-101', teacher: 'Mme Moreau', school: 'Institut Technique', credits: 4, students: 52, status: 'active', lessons: 30 },
      { id: 5, title: 'Histoire du 20ème Siècle', code: 'HIST-202', teacher: 'M. Robert', school: 'Collège Central', credits: 3, students: 28, status: 'inactive', lessons: 16 },
      { id: 6, title: 'Anglais Business', code: 'EN-301', teacher: 'Mme Petit', school: 'École Saint-Jean', credits: 2, students: 35, status: 'active', lessons: 22 },
      { id: 7, title: 'Chimie Organique', code: 'CHEM-301', teacher: 'M. Simon', school: 'Lycée National', credits: 4, students: 40, status: 'active', lessons: 26 },
      { id: 8, title: 'Biologie Cellulaire', code: 'BIO-201', teacher: 'M. Leroy', school: 'Collège Central', credits: 3, students: 42, status: 'draft', lessons: 0 },
    ];
    
    setTimeout(() => {
      setCourses(sampleCourses);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'active' ? 'inactive' : 'active' };
      }
      return c;
    }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      draft: 'bg-orange-100 text-orange-700',
    };
    const labels = { active: 'Actif', inactive: 'Inactif', draft: 'Brouillon' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
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
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="draft">Brouillon</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nouveau cours
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
              <p className="text-sm text-gray-500">Total cours</p>
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
                {courses.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-gray-500">Cours actifs</p>
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
                {courses.reduce((acc, c) => acc + c.students, 0)}
              </p>
              <p className="text-sm text-gray-500">Étudiants inscrits</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {courses.reduce((acc, c) => acc + c.lessons, 0)}
              </p>
              <p className="text-sm text-gray-500">Leçons total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Cours</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Professeur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">École</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Crédits</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Étudiants</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{course.title}</p>
                      <p className="text-sm text-gray-500">{course.lessons} leçons</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-mono">
                    {course.code}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{course.teacher}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{course.school}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{course.credits}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{course.students}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(course.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => { setEditingCourse(course); setShowModal(true); }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => toggleStatus(course.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title={course.status === 'active' ? 'Désactiver' : 'Activer'}
                    >
                      {course.status === 'active' ? (
                        <XCircle className="w-4 h-4 text-orange-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
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

      {/* Modal */}
      {showModal && (
        <CourseModal
          course={editingCourse}
          onClose={() => { setShowModal(false); setEditingCourse(null); }}
          onSave={(data) => {
            if (editingCourse) {
              setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...data } : c));
            } else {
              setCourses([...courses, { ...data, id: Date.now(), students: 0, lessons: 0 }]);
            }
            setShowModal(false);
            setEditingCourse(null);
          }}
        />
      )}
    </div>
  );
};

const CourseModal = ({ course, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    code: course?.code || '',
    teacher: course?.teacher || '',
    school: course?.school || '',
    credits: course?.credits || 3,
    status: course?.status || 'draft',
    description: course?.description || '',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {course ? 'Modifier le cours' : 'Nouveau cours'}
        </h3>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre du cours</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Crédits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
            <select
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un professeur</option>
              <option value="M. Dupont">M. Dupont</option>
              <option value="Mme Martin">Mme Martin</option>
              <option value="M. Bernard">M. Bernard</option>
              <option value="Mme Moreau">Mme Moreau</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">École</label>
            <select
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une école</option>
              <option value="École Saint-Jean">École Saint-Jean</option>
              <option value="Lycée National">Lycée National</option>
              <option value="Collège Central">Collège Central</option>
              <option value="Institut Technique">Institut Technique</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Brouillon</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {course ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoursesPage;
