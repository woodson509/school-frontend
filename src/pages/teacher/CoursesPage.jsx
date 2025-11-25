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

const TeacherCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const sampleCourses = [
      {
        id: 1,
        name: 'Mathématiques',
        code: 'MATH-6A',
        class: '6ème A',
        students: 32,
        lessonsCompleted: 18,
        totalLessons: 24,
        nextLesson: 'Intégrales - Partie 3',
        schedule: 'Lun 08:00, Mer 10:00, Ven 08:00',
        averageScore: 15.2,
        color: '#3B82F6',
      },
      {
        id: 2,
        name: 'Mathématiques',
        code: 'MATH-5B',
        class: '5ème B',
        students: 28,
        lessonsCompleted: 16,
        totalLessons: 24,
        nextLesson: 'Équations du 2nd degré',
        schedule: 'Mar 09:45, Jeu 13:30',
        averageScore: 13.8,
        color: '#8B5CF6',
      },
      {
        id: 3,
        name: 'Mathématiques',
        code: 'MATH-4A',
        class: '4ème A',
        students: 30,
        lessonsCompleted: 20,
        totalLessons: 24,
        nextLesson: 'Statistiques descriptives',
        schedule: 'Lun 13:30, Mer 08:00',
        averageScore: 14.5,
        color: '#10B981',
      },
      {
        id: 4,
        name: 'Mathématiques',
        code: 'MATH-3C',
        class: '3ème C',
        students: 34,
        lessonsCompleted: 15,
        totalLessons: 24,
        nextLesson: 'Trigonométrie',
        schedule: 'Mar 08:00, Ven 10:00',
        averageScore: 12.9,
        color: '#F59E0B',
      },
      {
        id: 5,
        name: 'Mathématiques',
        code: 'MATH-2D',
        class: '2nde D',
        students: 32,
        lessonsCompleted: 17,
        totalLessons: 24,
        nextLesson: 'Fonctions affines',
        schedule: 'Mer 13:30, Jeu 08:00',
        averageScore: 14.1,
        color: '#EC4899',
      },
    ];

    setTimeout(() => {
      setCourses(sampleCourses);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCourses = courses.filter(course =>
    course.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const averageProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + (c.lessonsCompleted / c.totalLessons) * 100, 0) / courses.length)
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
                <span className="font-bold text-indigo-600">{course.averageScore}/20</span>
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
    </div>
  );
};

export default TeacherCoursesPage;
