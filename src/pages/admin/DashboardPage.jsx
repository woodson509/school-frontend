/**
 * Admin Dashboard Page - École
 * Overview of school statistics and quick actions
 * Connected to backend API
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  UserCheck,
  Calendar,
  AlertCircle,
  ArrowRight,
  Activity,
  Clock,
  GraduationCap,
  Loader,
} from 'lucide-react';
import { dashboardAPI } from '../../services/api';

const AdminDashboardPage = () => {
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
      const response = await dashboardAPI.getAdmin();

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Impossible de charger le tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
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
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const { school_info, users_count, courses_stats, exams_stats, classes_stats, recent_activity, upcoming_exams } = dashboardData;

  const statCards = [
    {
      title: 'Étudiants',
      value: parseInt(users_count.students) || 0,
      change: '+8%',
      icon: UserCheck,
      color: 'blue',
      link: '/users',
    },
    {
      title: 'Enseignants',
      value: parseInt(users_count.teachers) || 0,
      change: users_count.teachers > 0 ? `+${users_count.teachers}` : '0',
      icon: Users,
      color: 'green',
      link: '/users',
    },
    {
      title: 'Cours Actifs',
      value: parseInt(courses_stats.active_courses) || 0,
      change: courses_stats.total_courses > 0 ? `${courses_stats.total_courses} total` : '0',
      icon: BookOpen,
      color: 'purple',
      link: '/courses',
    },
    {
      title: 'Examens',
      value: parseInt(exams_stats.total_exams) || 0,
      change: `${parseInt(exams_stats.upcoming_exams) || 0} à venir`,
      icon: FileText,
      color: 'orange',
      link: '/exams',
    },
    {
      title: 'Classes',
      value: parseInt(classes_stats.total_classes) || 0,
      change: classes_stats.total_classes > 0 ? `Actives` : 'Aucune',
      icon: GraduationCap,
      color: 'indigo',
      link: '/classes',
    },
    {
      title: 'Examens Actifs',
      value: parseInt(exams_stats.active_exams) || 0,
      change: 'En cours',
      icon: Clock,
      color: 'emerald',
      link: '/exams',
    },
  ];

  const quickActions = [
    { label: 'Ajouter cours', icon: BookOpen, path: '/courses', color: 'blue' },
    { label: 'Créer examen', icon: FileText, path: '/exams', color: 'green' },
    { label: 'Gérer classes', icon: GraduationCap, path: '/classes', color: 'purple' },
    { label: 'Voir calendrier', icon: Calendar, path: '/calendar', color: 'orange' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">🏫 {school_info.name}</h1>
        <p className="text-blue-100">
          Gérez votre école efficacement. Voici un aperçu des activités pédagogiques.
        </p>
        {school_info.subscription_status && (
          <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
            <span>Abonnement : {school_info.subscription_status}</span>
            {school_info.subscription_end_date && (
              <span className="text-blue-100">jusqu'au {formatDate(school_info.subscription_end_date)}</span>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} onClick={() => navigate(stat.link)} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <action.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Activité récente</h3>
            <button
              onClick={() => navigate('/logs')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recent_activity && recent_activity.length > 0 ? (
              recent_activity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.user_email || 'Système'}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {getTimeAgo(activity.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Aucune activité récente</p>
            )}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Examens à venir</h3>
            <button
              onClick={() => navigate('/exams')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {upcoming_exams && upcoming_exams.length > 0 ? (
              upcoming_exams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{exam.title}</p>
                      <p className="text-sm text-gray-500">{exam.course_name || exam.course_code || 'Cours'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{formatDate(exam.exam_date)}</p>
                    <p className="text-sm text-gray-500">{exam.student_count || 0} étudiants</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Aucun examen à venir</p>
            )}
          </div>
        </div>
      </div>

      {/* School Info Summary */}
      {school_info && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Informations de l'école</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-700">
                <li>• Capacité maximum : {school_info.max_students} étudiants, {school_info.max_teachers} enseignants</li>
                <li>• Utilisation actuelle : {users_count.students}/{school_info.max_students} étudiants, {users_count.teachers}/{school_info.max_teachers} enseignants</li>
                {school_info.email && <li>• Contact : {school_info.email}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon: Icon, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-sm text-blue-600">
          <TrendingUp className="w-4 h-4" />
          {change}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
};

export default AdminDashboardPage;
