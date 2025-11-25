/**
 * Student Dashboard Page
 * Overview of student's academic life
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
} from 'lucide-react';

const StudentDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);

  useEffect(() => {
    // Simulated data
    setTimeout(() => {
      setStats({
        coursesEnrolled: 8,
        coursesCompleted: 3,
        averageGrade: 15.2,
        attendanceRate: 94,
        streak: 12,
        rank: 5,
        totalStudents: 32,
      });

      setUpcomingExams([
        { id: 1, title: 'Mathématiques - Contrôle', date: '2024-12-18', time: '08:00', course: 'MATH-301' },
        { id: 2, title: 'Physique - TP noté', date: '2024-12-19', time: '10:00', course: 'PHY-201' },
        { id: 3, title: 'Français - Dissertation', date: '2024-12-20', time: '14:00', course: 'FR-101' },
      ]);

      setRecentGrades([
        { id: 1, subject: 'Anglais', exam: 'Quiz vocabulaire', grade: 18, max: 20, date: '2024-12-14' },
        { id: 2, subject: 'Histoire', exam: 'Contrôle chapitres 3-4', grade: 14, max: 20, date: '2024-12-12' },
        { id: 3, subject: 'Mathématiques', exam: 'Devoir maison', grade: 16, max: 20, date: '2024-12-10' },
      ]);

      setTodaySchedule([
        { id: 1, time: '08:00 - 09:00', subject: 'Mathématiques', room: 'A101', teacher: 'M. Dupont', status: 'completed' },
        { id: 2, time: '09:00 - 10:00', subject: 'Français', room: 'A101', teacher: 'Mme Martin', status: 'completed' },
        { id: 3, time: '10:00 - 11:00', subject: 'Physique', room: 'Labo 1', teacher: 'M. Bernard', status: 'current' },
        { id: 4, time: '11:00 - 12:00', subject: 'Anglais', room: 'A101', teacher: 'Mme Petit', status: 'upcoming' },
        { id: 5, time: '14:00 - 15:00', subject: 'Histoire', room: 'A102', teacher: 'M. Robert', status: 'upcoming' },
      ]);

      setPendingAssignments([
        { id: 1, title: 'Exercices chapitre 5', course: 'Mathématiques', dueDate: '2024-12-17', priority: 'high' },
        { id: 2, title: 'Compte-rendu TP', course: 'Physique', dueDate: '2024-12-18', priority: 'medium' },
        { id: 3, title: 'Lecture pages 45-60', course: 'Français', dueDate: '2024-12-19', priority: 'low' },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  const getGradeColor = (grade, max) => {
    const percentage = (grade / max) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-orange-100 text-orange-700 border-orange-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[priority];
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Bonne journée ! 🎓</h1>
            <p className="text-emerald-100">
              Tu as 3 cours aujourd'hui et 2 devoirs à rendre cette semaine.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="font-semibold">{stats.streak} jours</span>
            </div>
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
              <p className="text-2xl font-bold text-gray-800">{stats.attendanceRate}%</p>
              <p className="text-xs text-gray-500">Présence</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.rank}/{stats.totalStudents}</p>
              <p className="text-xs text-gray-500">Classement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Emploi du temps aujourd'hui</h3>
            <Link to="/schedule" className="text-sm text-emerald-600 hover:text-emerald-700">
              Voir tout
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {todaySchedule.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-3 rounded-lg ${item.status === 'current'
                    ? 'bg-emerald-50 border border-emerald-200'
                    : item.status === 'completed'
                      ? 'bg-gray-50 opacity-60'
                      : 'bg-gray-50'
                  }`}
              >
                <div className="text-center min-w-[80px]">
                  <p className="text-sm font-medium text-gray-800">{item.time.split(' - ')[0]}</p>
                  <p className="text-xs text-gray-500">{item.time.split(' - ')[1]}</p>
                </div>
                <div className={`w-1 h-12 rounded-full ${item.status === 'current' ? 'bg-emerald-500' :
                    item.status === 'completed' ? 'bg-gray-300' : 'bg-gray-200'
                  }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.subject}</p>
                  <p className="text-sm text-gray-500">{item.teacher} • {item.room}</p>
                </div>
                {item.status === 'current' && (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    En cours
                  </span>
                )}
                {item.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Devoirs à rendre</h3>
            <Link to="/assignments" className="text-sm text-emerald-600 hover:text-emerald-700">
              Voir tout
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {pendingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`p-3 rounded-lg border ${getPriorityColor(assignment.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800 text-sm">{assignment.title}</h4>
                  {assignment.priority === 'high' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-1">{assignment.course}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {assignment.dueDate}
                </div>
              </div>
            ))}
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
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex flex-col items-center justify-center">
                  <span className="text-xs text-red-600 font-medium">
                    {new Date(exam.date).toLocaleDateString('fr-FR', { day: 'numeric' })}
                  </span>
                  <span className="text-xs text-red-600">
                    {new Date(exam.date).toLocaleDateString('fr-FR', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{exam.title}</p>
                  <p className="text-sm text-gray-500">{exam.time} • {exam.course}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
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
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getGradeColor(grade.grade, grade.max)}`}>
                  <span className="font-bold">{grade.grade}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{grade.subject}</p>
                  <p className="text-sm text-gray-500">{grade.exam}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">/{grade.max}</p>
                  <p className="text-xs text-gray-500">{grade.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/practice"
            className="flex flex-col items-center gap-2 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <Target className="w-8 h-8 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">S'entraîner</span>
          </Link>
          <Link
            to="/planner"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Planifier</span>
          </Link>
          <Link
            to="/resources"
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <BookOpen className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Ressources</span>
          </Link>
          <Link
            to="/messages"
            className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
          >
            <FileText className="w-8 h-8 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Messages</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
