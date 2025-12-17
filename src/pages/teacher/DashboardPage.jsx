/**
 * Teacher Dashboard Page
 * Connected to backend API - Overview with real stats, schedule, pending tasks
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  FileText,
  TrendingUp,
  Award,
  Bell,
  BarChart3,
  Target,
  Loader,
  RefreshCw,
} from 'lucide-react';
import { dashboardAPI } from '../../services/api';

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
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
      const response = await dashboardAPI.getTeacher();

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (err) {
      console.error('Teacher dashboard error:', err);
      setError('Impossible de charger le tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-indigo-600" />
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

  const { courses, exams_last_30_days, students, upcoming_exams, grading_needed } = dashboardData;

  // Stats based on backend data
  const stats = {
    totalStudents: students?.total || 0,
    totalCourses: courses?.total || 0,
    activeCourses: courses?.active || 0,
    pendingGrading: exams_last_30_days?.pending_grading || 0,
    averageScore: exams_last_30_days?.average_score || '0.00',
    totalExams: exams_last_30_days?.total_exams || 0,
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">📚 Tableau de Bord Enseignant</h1>
        <p className="text-indigo-100">
          Bienvenue ! Voici un aperçu de vos activités pédagogiques.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="bg-white rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/students')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
              <p className="text-sm text-gray-500">Mes élèves</p>
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/courses')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.activeCourses}</p>
              <p className="text-sm text-gray-500">Cours actifs ({stats.totalCourses} total)</p>
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/grades')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingGrading}</p>
              <p className="text-sm text-gray-500">À corriger</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.averageScore}/20</p>
              <p className="text-sm text-gray-500">Moyenne des examens</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Exams */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Examens à venir
            </h3>
            <button
              onClick={() => navigate('/exams')}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Voir tout <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {upcoming_exams && upcoming_exams.length > 0 ? (
            <div className="space-y-3">
              {upcoming_exams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-200 transition-all"
                >
                  <div className="w-14 h-14 rounded-lg bg-indigo-100 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">
                      {new Date(exam.start_date).getDate()}
                    </span>
                    <span className="text-xs text-indigo-400">
                      {new Date(exam.start_date).toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{exam.title}</p>
                    <p className="text-sm text-gray-500">{exam.course_title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{exam.duration_minutes} min</p>
                    <p className="text-sm text-gray-500">{exam.total_points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun examen à venir</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">⚡ Actions rapides</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/attendance')}
                className="flex flex-col items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <CheckCircle className="w-6 h-6" />
                <span className="text-xs">Faire l'appel</span>
              </button>
              <button
                onClick={() => navigate('/grades')}
                className="flex flex-col items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <FileText className="w-6 h-6" />
                <span className="text-xs">Saisir notes</span>
              </button>
              <button
                onClick={() => navigate('/exams')}
                className="flex flex-col items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ClipboardList className="w-6 h-6" />
                <span className="text-xs">Créer examen</span>
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="flex flex-col items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-xs">Mes cours</span>
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📊 Statistiques (30j)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Examens créés</span>
                <span className="font-bold text-indigo-600">{stats.totalExams}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tentatives corrigées</span>
                <span className="font-bold text-green-600">{exams_last_30_days?.total_attempts || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">En attente de correction</span>
                <span className={`font-bold ${stats.pendingGrading > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {stats.pendingGrading}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grading Needed */}
      {grading_needed && grading_needed.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Corrections en attente
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                {grading_needed.length}
              </span>
            </h3>
            <button
              onClick={() => navigate('/grades')}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Corriger tout <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">Élève</th>
                  <th className="pb-3 font-medium">Examen</th>
                  <th className="pb-3 font-medium">Cours</th>
                  <th className="pb-3 font-medium">Soumis le</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {grading_needed.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-medium">
                          {item.student_name?.charAt(0) || '?'}
                        </div>
                        <span className="font-medium text-gray-800">{item.student_name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{item.exam_title}</td>
                    <td className="py-3 text-gray-600">{item.course_title}</td>
                    <td className="py-3 text-gray-500">{formatDateTime(item.submitted_at)}</td>
                    <td className="py-3">
                      <button
                        onClick={() => navigate(`/grades`)}
                        className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                      >
                        Corriger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state if no pending grading */}
      {(!grading_needed || grading_needed.length === 0) && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-medium text-green-800">Tout est à jour !</h3>
          <p className="text-green-600 text-sm">Aucune correction en attente.</p>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboardPage;
