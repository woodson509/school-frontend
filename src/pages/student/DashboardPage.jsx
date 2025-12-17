/**
 * Student Dashboard Page
 * Overview of student's academic life with real data
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  FileText,
  Award,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Play,
  Target,
  Flame,
  Loader,
  RefreshCw,
  ClipboardList
} from 'lucide-react';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.getStudent();

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (err) {
      console.error('Student dashboard error:', err);
      setError('Impossible de charger le tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <p className="text-red-700">{error || 'Données non disponibles'}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      </div>
    );
  }

  const { courses, exams_taken, upcoming_exams, recent_grades, attendance_rate } = dashboardData;

  const stats = {
    coursesEnrolled: parseInt(courses?.total_enrolled || 0),
    activeCourses: parseInt(courses?.active_courses || 0),
    averageGrade: parseFloat(exams_taken?.average_score || 0).toFixed(1),
    attendanceRate: attendance_rate ? parseFloat(attendance_rate).toFixed(1) : 'ABS',
    // streak: 12, // Placeholder
  };

  const getGradeColor = (grade, max) => {
    const percentage = (grade / max) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Bonne journée, {user?.full_name?.split(' ')[0] || 'Étudiant'} ! 🎓</h1>
            <p className="text-emerald-100">
              Tu as {stats.coursesEnrolled} cours inscrits.
              {upcoming_exams?.length > 0 && ` Attention, ${upcoming_exams.length} examen(s) à venir !`}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            {/* Streak feature TBD 
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="font-semibold">{stats.streak} jours</span>
            </div>
             */}
            <Link
              to="/courses"
              className="flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50"
            >
              <Play className="w-4 h-4" />
              Continuer
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.coursesEnrolled}</p>
              <p className="text-xs text-gray-500">Cours inscrits</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.averageGrade}/20</p>
              <p className="text-xs text-gray-500">Moyenne générale</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.attendanceRate === 'ABS' ? '--' : `${stats.attendanceRate}%`}</p>
              <p className="text-xs text-gray-500">Présence</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{exams_taken?.total_attempts || 0}</p>
              <p className="text-xs text-gray-500">Examens passés</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Examens à venir</h3>
            <Link to="/exams" className="text-sm text-emerald-600 hover:text-emerald-700">
              Voir tout
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcoming_exams && upcoming_exams.length > 0 ? (
              upcoming_exams.map((exam) => (
                <div key={exam.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex flex-col items-center justify-center">
                    <span className="text-xs text-red-600 font-medium">
                      {new Date(exam.start_date || exam.date).toLocaleDateString('fr-FR', { day: 'numeric' })}
                    </span>
                    <span className="text-xs text-red-600">
                      {new Date(exam.start_date || exam.date).toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{exam.title}</p>
                    <p className="text-sm text-gray-500">{new Date(exam.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {exam.course_title || exam.course}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">Aucun examen à venir</div>
            )}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Notes récentes</h3>
            <Link to="/grades" className="text-sm text-emerald-600 hover:text-emerald-700">
              Voir tout
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recent_grades && recent_grades.length > 0 ? (
              recent_grades.map((grade) => (
                <div key={grade.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getGradeColor(grade.points_earned || grade.grade || 0, grade.points_possible || grade.max || 20)}`}>
                    <span className="font-bold">{grade.points_earned || grade.grade || '-'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{grade.exam_title || grade.exam}</p>
                    <p className="text-sm text-gray-500">{grade.course_title || grade.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">/{grade.points_possible || grade.max || 20}</p>
                    <p className="text-xs text-gray-500">{new Date(grade.graded_at || grade.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">Aucune note récente</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/assignments"
            className="flex flex-col items-center gap-2 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <ClipboardList className="w-8 h-8 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">Devoirs</span>
          </Link>
          <Link
            to="/schedule"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Emploi du temps</span>
          </Link>
          <Link
            to="/courses"
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <BookOpen className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Mes Cours</span>
          </Link>
          <Link
            to="/exams"
            className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
          >
            <FileText className="w-8 h-8 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Examens</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
