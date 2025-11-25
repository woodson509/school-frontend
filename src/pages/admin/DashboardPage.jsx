/**
 * Admin Dashboard Page - École
 * Overview of school statistics and quick actions
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Calendar,
  AlertCircle,
  ArrowRight,
  Activity,
  Clock,
  Award,
  GraduationCap,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 245,
    totalTeachers: 18,
    totalCourses: 32,
    totalExams: 12,
    totalClasses: 8,
    activeExams: 3,
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const statCards = [
    {
      title: 'Étudiants',
      value: stats.totalStudents,
      change: '+8%',
      trend: 'up',
      icon: UserCheck,
      color: 'blue',
      link: '/courses',
    },
    {
      title: 'Enseignants',
      value: stats.totalTeachers,
      change: '+2',
      trend: 'up',
      icon: Users,
      color: 'green',
      link: '/courses',
    },
    {
      title: 'Cours Actifs',
      value: stats.totalCourses,
      change: '+5',
      trend: 'up',
      icon: BookOpen,
      color: 'purple',
      link: '/courses',
    },
    {
      title: 'Examens',
      value: stats.totalExams,
      change: '+3',
      trend: 'up',
      icon: FileText,
      color: 'orange',
      link: '/exams',
    },
    {
      title: 'Classes',
      value: stats.totalClasses,
      change: '+1',
      trend: 'up',
      icon: GraduationCap,
      color: 'indigo',
      link: '/classes',
    },
    {
      title: 'Examens Actifs',
      value: stats.activeExams,
      change: '0',
      trend: 'up',
      icon: Clock,
      color: 'emerald',
      link: '/exams',
    },
  ];

  const recentActivities = [
    { id: 1, action: 'Nouvel étudiant inscrit', user: 'Jean Pierre', time: 'Il y a 5 min', type: 'user' },
    { id: 2, action: 'Examen soumis', user: 'Marie Claire', time: 'Il y a 15 min', type: 'exam' },
    { id: 3, action: 'Nouveau cours créé', user: 'Prof. Martin', time: 'Il y a 1h', type: 'course' },
    { id: 4, action: 'Notes publiées', user: 'Prof. Dupont', time: 'Il y a 2h', type: 'grade' },
    { id: 5, action: 'Présence mise à jour', user: 'Admin', time: 'Il y a 3h', type: 'attendance' },
  ];

  const upcomingExams = [
    { id: 1, title: 'Mathématiques - Final', date: '2024-12-20', students: 45, course: 'MATH-101' },
    { id: 2, title: 'Physique - Midterm', date: '2024-12-18', students: 38, course: 'PHY-201' },
    { id: 3, title: 'Informatique - Quiz', date: '2024-12-16', students: 52, course: 'CS-101' },
  ];

  const quickActions = [
    { label: 'Ajouter cours', icon: BookOpen, path: '/courses', color: 'blue' },
    { label: 'Créer examen', icon: FileText, path: '/exams', color: 'green' },
    { label: 'Gérer classes', icon: GraduationCap, path: '/classes', color: 'purple' },
    { label: 'Voir calendrier', icon: Calendar, path: '/calendar', color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner - DISTINCTIVE */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">🏫 Tableau de bord - Administration École</h1>
        <p className="text-blue-100">
          Gérez votre école efficacement. Voici un aperçu des activités pédagogiques.
        </p>
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
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-${action.color}-500 hover:bg-${action.color}-50 transition-all group`}
            >
              <div className={`w-12 h-12 rounded-full bg-${action.color}-100 flex items-center justify-center group-hover:bg-${action.color}-200 transition-colors`}>
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
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
              onClick={() => navigate('/admin/logs')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Examens à venir</h3>
            <button
              onClick={() => navigate('/admin/exams')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{exam.title}</p>
                    <p className="text-sm text-gray-500">{exam.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{exam.date}</p>
                  <p className="text-sm text-gray-500">{exam.students} étudiants</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-orange-800">Rappels importants</h4>
            <ul className="mt-2 space-y-1 text-sm text-orange-700">
              <li>• 3 examens non notés depuis plus de 7 jours</li>
              <li>• 5 demandes d'inscription en attente de validation</li>
              <li>• Sauvegarde automatique programmée ce soir à 23h</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, trend, icon: Icon, color, onClick }) => {
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
        <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
};

export default AdminDashboardPage;
