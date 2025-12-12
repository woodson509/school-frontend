/**
 * Teacher Courses Page
 * Manage courses taught by the teacher
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  Plus,
  Search,
  Filter,
  BarChart3,
  FileText,
  Settings,
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { courseAPI, classAPI, subjectAPI } from '../../services/api';

const TeacherCoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    class_id: '',
    subject_id: '',
    credits: 0
  });

  const fetchCourses = async () => {
    try {
      if (!user?.id) return;

      const response = await courseAPI.getAll({ teacher_id: user.id });
      if (response.success) {
        const mappedCourses = response.data.map(course => ({
          id: course.id,
          name: course.title,
          code: course.code,
          class: course.class_name || 'N/A',
          students: course.student_count || 0,
          lessonsCompleted: course.completed_lessons || 0,
          totalLessons: course.total_lessons || 0, // Corrected logic: 0 if no lessons
          nextLesson: course.next_lesson_title || 'Non planifié',
          schedule: course.schedule_summary || 'Horaire non défini',
          averageScore: course.average_score ? parseFloat(course.average_score).toFixed(1) : '-',
          color: getRandomColor(course.id),
          description: course.description
        }));
        setCourses(mappedCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  // Fetch classes when modal opens
  // Fetch classes and subjects when modal opens
  useEffect(() => {
    if (isModalOpen && user?.school_id) {
      const fetchData = async () => {
        try {
          const [classesRes, subjectsRes] = await Promise.all([
            classAPI.getAll({ school_id: user.school_id }),
            subjectAPI.getAll()
          ]);

          if (classesRes.success) {
            setAvailableClasses(classesRes.data);
          }
          if (subjectsRes.success) {
            setAvailableSubjects(subjectsRes.data);
          }
        } catch (error) {
          console.error('Error fetching form data:', error);
        }
      };
      fetchData();
    }
  }, [isModalOpen, user?.school_id]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      if (!user?.school_id) {
        alert("Erreur: Vous n'êtes associé à aucune école.");
        return;
      }

      // Convert format for API
      const courseData = {
        ...formData,
        code: formData.code.toUpperCase().trim(), // Ensure uppercase code
        school_id: user.school_id,
        teacher_id: user.id
      };

      // Clean up optional fields
      if (!courseData.class_id) delete courseData.class_id;
      if (!courseData.subject_id) delete courseData.subject_id;
      if (!courseData.credits) delete courseData.credits;

      const response = await courseAPI.create(courseData);

      if (response.success) {
        alert('Cours créé avec succès !');
        setIsModalOpen(false);
        setFormData({
          title: '',
          code: '',
          description: '',
          description: '',
          class_id: '',
          subject_id: '',
          credits: 0
        });
        fetchCourses(); // Refresh list
      }
    } catch (error) {
      console.error('Error creating course:', error);

      // Extract specific validation message if available
      let errorMessage = error.message || 'Validation échouée';
      if (error.response && error.response.data && error.response.data.errors) {
        errorMessage = error.response.data.errors.map(e => e.message).join('\n');
      } else if (error.msg) {
        errorMessage = error.msg;
      }

      alert('Erreur:\n' + errorMessage);
    }
  };

  // Navigation handler
  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const getRandomColor = (id) => {
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];
    let hash = 0;
    const str = String(id);
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredCourses = courses.filter(course =>
    (course.class && course.class.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (course.code && course.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
  const averageProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + ((c.lessonsCompleted || 0) / (c.totalLessons || 1)) * 100, 0) / courses.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes cours</h1>
          <p className="text-gray-500">{courses.length} cours • {totalStudents} élèves</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau contenu
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
              <p className="text-xs text-gray-500">Cours</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
              <p className="text-xs text-gray-500">Élèves total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{averageProgress}%</p>
              <p className="text-xs text-gray-500">Progression moy.</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">12h</p>
              <p className="text-xs text-gray-500">Cette semaine</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Aucun cours trouvé</p>
          {searchTerm && <p className="text-sm text-gray-400 mt-1">Essayez un autre terme de recherche</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">
              {/* Card is now clickable, except for buttons */}
              <div
                className="cursor-pointer"
                onClick={() => handleViewCourse(course.id)}
              >
                <div className="h-2" style={{ backgroundColor: course.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.class} • {course.code}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      {course.students}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Progression</span>
                      <span className="font-medium" style={{ color: course.color }}>
                        {course.lessonsCompleted}/{course.totalLessons} leçons
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${course.totalLessons > 0 ? (course.lessonsCompleted / course.totalLessons) * 100 : 0}%`,
                          backgroundColor: course.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <p className="text-xs text-gray-400 mb-1">Prochaine leçon</p>
                    <p className="text-sm font-medium text-gray-800">{course.nextLesson}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    {course.schedule}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <span className="text-sm text-indigo-700">Moyenne classe</span>
                    <span className="font-bold text-indigo-600">{course.averageScore !== '-' ? `${course.averageScore}/20` : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer - separated from clickable card body */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCourse(course.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Contenu
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCourse(course.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Élèves
                  </button>
                  <button className="flex items-center justify-center p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-[101]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Nouveau cours</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du cours</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ex: Mathématiques"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code du cours</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase"
                  placeholder="ex: MATH-6A"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
                <p className="text-xs text-gray-500 mt-1">Majuscules, chiffres et tirets uniquement</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classe associée</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                >
                  <option value="">Sélectionner une classe (Optionnel)</option>
                  {availableClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matière / Sujet</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                >
                  <option value="">Sélectionner une matière</option>
                  {availableSubjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  placeholder="Description du cours..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Créer le cours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesPage;
