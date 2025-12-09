/**
 * Teacher Courses Page
 * Manage courses taught by the teacher
 */

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { courseAPI } from '../../services/api';

const TeacherCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user?.id) return;

        const response = await courseAPI.getAll({ teacher_id: user.id });
        if (response.success) {
          // Transform backend data to match UI needs
          // Note: Backend might not return all extended analytics yet, so we use fallbacks
          const mappedCourses = response.data.map(course => ({
            id: course.id,
            name: course.title,
            code: course.code,
            class: course.class_name || 'N/A',
            students: course.student_count || 0, // Assuming api returns this or we default to 0
            lessonsCompleted: course.completed_lessons || 0,
            totalLessons: course.total_lessons || 12, // Default or real
            nextLesson: course.next_lesson_title || 'Non planifié',
            schedule: course.schedule_summary || 'Horaire non défini',
            averageScore: course.average_score ? parseFloat(course.average_score).toFixed(1) : '-',
            color: getRandomColor(course.id), // Helper for color
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

    fetchCourses();
  }, [user]);

  // Helper to generate consistent colors based on string
  const getRandomColor = (id) => {
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];
    // Simple hash
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
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
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
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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

                {/* Progress */}
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
                        width: `${(course.lessonsCompleted / course.totalLessons) * 100}%`,
                        backgroundColor: course.color,
                      }}
                    />
                  </div>
                </div>

                {/* Next Lesson */}
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-xs text-gray-400 mb-1">Prochaine leçon</p>
                  <p className="text-sm font-medium text-gray-800">{course.nextLesson}</p>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  {course.schedule}
                </div>

                {/* Average Score */}
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <span className="text-sm text-indigo-700">Moyenne classe</span>
                  <span className="font-bold text-indigo-600">{course.averageScore !== '-' ? `${course.averageScore}/20` : '-'}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <FileText className="w-4 h-4" />
                    Contenu
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Users className="w-4 h-4" />
                    Élèves
                  </button>
                  <button className="flex items-center justify-center p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesPage;
