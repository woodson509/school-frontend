/**
 * Student Courses Page
 * View enrolled courses and progress
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  Play,
  Clock,
  CheckCircle,
  Users,
  Star,
  ChevronRight,
  BarChart,
} from 'lucide-react';

const StudentCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const sampleCourses = [
      { id: 1, title: 'Mathématiques Avancées', code: 'MATH-301', teacher: 'M. Dupont', progress: 75, lessons: 24, completedLessons: 18, nextLesson: 'Intégrales définies', color: '#3B82F6', status: 'in_progress' },
      { id: 2, title: 'Physique Quantique', code: 'PHY-201', teacher: 'M. Bernard', progress: 60, lessons: 20, completedLessons: 12, nextLesson: 'Équation de Schrödinger', color: '#8B5CF6', status: 'in_progress' },
      { id: 3, title: 'Littérature Française', code: 'FR-101', teacher: 'Mme Martin', progress: 100, lessons: 18, completedLessons: 18, nextLesson: null, color: '#EF4444', status: 'completed' },
      { id: 4, title: 'Anglais Business', code: 'EN-301', teacher: 'Mme Petit', progress: 45, lessons: 22, completedLessons: 10, nextLesson: 'Business Correspondence', color: '#F59E0B', status: 'in_progress' },
      { id: 5, title: 'Histoire du 20ème siècle', code: 'HIST-202', teacher: 'M. Robert', progress: 30, lessons: 16, completedLessons: 5, nextLesson: 'La Guerre Froide', color: '#EC4899', status: 'in_progress' },
      { id: 6, title: 'Chimie Organique', code: 'CHEM-301', teacher: 'M. Simon', progress: 0, lessons: 26, completedLessons: 0, nextLesson: 'Introduction aux hydrocarbures', color: '#10B981', status: 'not_started' },
      { id: 7, title: 'Informatique', code: 'CS-101', teacher: 'Mme Moreau', progress: 85, lessons: 30, completedLessons: 26, nextLesson: 'Algorithmes de tri', color: '#6366F1', status: 'in_progress' },
      { id: 8, title: 'Biologie Cellulaire', code: 'BIO-201', teacher: 'M. Leroy', progress: 100, lessons: 20, completedLessons: 20, nextLesson: null, color: '#14B8A6', status: 'completed' },
    ];

    setTimeout(() => {
      setCourses(sampleCourses);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || course.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      in_progress: 'bg-blue-100 text-blue-700',
      not_started: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      completed: 'Terminé',
      in_progress: 'En cours',
      not_started: 'Non commencé',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Mes cours</h1>
          <p className="text-gray-500">{courses.length} cours inscrits</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 w-64"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tous</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminés</option>
            <option value="not_started">Non commencés</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
              <p className="text-xs text-gray-500">Total cours</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {courses.filter(c => c.status === 'completed').length}
              </p>
              <p className="text-xs text-gray-500">Terminés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Play className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {courses.filter(c => c.status === 'in_progress').length}
              </p>
              <p className="text-xs text-gray-500">En cours</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BarChart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%
              </p>
              <p className="text-xs text-gray-500">Progression moy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-2" style={{ backgroundColor: course.color }}></div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${course.color}20` }}>
                  <BookOpen className="w-6 h-6" style={{ color: course.color }} />
                </div>
                {getStatusBadge(course.status)}
              </div>

              <h3 className="font-semibold text-gray-800 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{course.teacher} • {course.code}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progression</span>
                  <span className="font-medium" style={{ color: course.color }}>{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {course.completedLessons} / {course.lessons} leçons
                </p>
              </div>

              {/* Next Lesson or Completed */}
              {course.nextLesson ? (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Prochaine leçon</p>
                  <p className="text-sm font-medium text-gray-700">{course.nextLesson}</p>
                </div>
              ) : (
                <div className="bg-green-50 rounded-lg p-3 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-700">Cours terminé !</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/courses/${course.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: course.status === 'completed' ? '#F3F4F6' : `${course.color}10`,
                    color: course.status === 'completed' ? '#6B7280' : course.color
                  }}
                >
                  {course.status === 'completed' ? 'Revoir' : 'Continuer'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCoursesPage;
