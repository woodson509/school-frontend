/**
 * Courses Management Page for Admin
 * Full CRUD for courses
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { courseAPI, userAPI } from '../../services/api';
import CourseFormModal from '../../components/admin/CourseFormModal';

const CoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, teachersRes] = await Promise.all([
        courseAPI.getAll(),
        userAPI.getAll({ role: 'teacher' }) // Fetch teachers for the dropdown
      ]);

      if (coursesRes.success) {
        // Map API data to frontend format
        const mappedCourses = coursesRes.data.map(course => ({
          ...course,
          teacher: course.teacher_name || 'Non assigné',
          school: course.school_name || 'Non assigné',
          status: course.is_active ? 'active' : 'inactive',
          students: 0, // TODO: Fetch real student count
          lessons: 0 // TODO: Fetch real lesson count
        }));
        setCourses(mappedCourses);
      }

      if (teachersRes.success) {
        setTeachers(teachersRes.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await userAPI.getAll({ role: 'teacher' });
      if (response.success) {
        setTeachers(response.data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.code.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.teacher.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || course.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        await courseAPI.delete(id);
        setCourses(courses.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Erreur lors de la suppression du cours');
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await courseAPI.update(id, { is_active: newStatus === 'active' });
      setCourses(courses.map(c =>
        c.id === id ? { ...c, status: newStatus, is_active: newStatus === 'active' } : c
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      inactive: 'bg-red-100 text-red-800'
    };
    const labels = {
      active: 'Actif',
      draft: 'Brouillon',
      inactive: 'Inactif'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status] || status}
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des cours</h1>
        <button
          onClick={() => { setEditingCourse(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau cours
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total cours</p>
              <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Étudiants inscrits</p>
              <p className="text-2xl font-bold text-gray-800">
                {courses.reduce((acc, curr) => acc + (parseInt(curr.students) || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Leçons total</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cours</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Professeur</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Étudiants</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{course.code}</span>
                        <span>•</span>
                        <span>{course.lessons || 0} leçons</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      {course.teacher?.charAt(0) || '?'}
                    </div>
                    <span className="text-sm text-gray-600">{course.teacher || 'Non assigné'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-gray-600">{course.students || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(course.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Voir"
                    >
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
                      onClick={() => toggleStatus(course.id, course.status)}
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
        <CourseFormModal
          course={editingCourse}
          teachers={teachers}
          onClose={() => { setShowModal(false); setEditingCourse(null); }}
          onSave={async (data) => {
            try {
              if (editingCourse) {
                await courseAPI.update(editingCourse.id, {
                  ...data,
                  is_active: data.status === 'active'
                });
              } else {
                // Get current user's school_id (assuming it's stored in localStorage or context)
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                await courseAPI.create({
                  ...data,
                  school_id: user.school_id,
                  is_active: data.status === 'active'
                });
              }
              fetchData(); // Refresh list
              setShowModal(false);
              setEditingCourse(null);
            } catch (error) {
              console.error('Error saving course:', error);
              alert('Erreur lors de l\'enregistrement du cours');
            }
          }}
        />
      )}
    </div>
  );
};

export default CoursesPage;
