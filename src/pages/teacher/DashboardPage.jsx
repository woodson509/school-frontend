/**
 * Teacher Dashboard Page
 * Overview with stats, today's schedule, pending tasks
 */

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

const TeacherDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const data = {
      stats: {
        totalStudents: 156,
        totalClasses: 5,
        pendingGrading: 24,
        averageClassScore: 14.2,
      },
      todaySchedule: [
        { id: 1, time: '08:00 - 09:30', subject: 'Mathématiques', class: '6ème A', room: 'Salle 101', status: 'completed' },
        { id: 2, time: '09:45 - 11:15', subject: 'Mathématiques', class: '5ème B', room: 'Salle 102', status: 'current' },
        { id: 3, time: '13:30 - 15:00', subject: 'Mathématiques', class: '4ème A', room: 'Salle 101', status: 'upcoming' },
      ],
      pendingTasks: [
        { id: 1, type: 'grading', title: 'Corriger contrôle 6ème A', count: 32, deadline: 'Aujourd\'hui', priority: 'high' },
        { id: 2, type: 'grading', title: 'Corriger devoirs 5ème B', count: 28, deadline: 'Demain', priority: 'medium' },
        { id: 3, type: 'attendance', title: 'Saisir présences 4ème A', deadline: 'Aujourd\'hui', priority: 'high' },
        { id: 4, type: 'report', title: 'Rédiger bulletins T1', count: 156, deadline: '20/12', priority: 'medium' },
      ],
      recentSubmissions: [
        { id: 1, student: 'Jean Pierre', class: '6ème A', assignment: 'Exercices Ch.5', date: '14/12 10:30' },
        { id: 2, student: 'Marie Claire', class: '6ème A', assignment: 'Exercices Ch.5', date: '14/12 09:15' },
        { id: 3, student: 'Paul Martin', class: '5ème B', assignment: 'TP Géométrie', date: '13/12 18:45' },
      ],
      classPerformance: [
        { class: '6ème A', average: 15.2, trend: 'up', students: 32 },
        { class: '5ème B', average: 13.8, trend: 'down', students: 28 },
        { class: '4ème A', average: 14.5, trend: 'up', students: 30 },
        { class: '3ème C', average: 12.9, trend: 'stable', students: 34 },
        { class: '2nde D', average: 14.1, trend: 'up', students: 32 },
      ],
      upcomingExams: [
        { id: 1, title: 'Contrôle Ch.6', class: '6ème A', date: '18/12', type: 'Contrôle' },
        { id: 2, title: 'DS Trimestriel', class: '5ème B', date: '20/12', type: 'DS' },
      ],
    };

    setTimeout(() => {
      setDashboardData(data);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { stats, todaySchedule, pendingTasks, recentSubmissions, classPerformance, upcomingExams } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
              <p className="text-sm text-gray-500">Élèves total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClasses}</p>
              <p className="text-sm text-gray-500">Classes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
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
              <p className="text-2xl font-bold text-gray-800">{stats.averageClassScore}/20</p>
              <p className="text-sm text-gray-500">Moyenne générale</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Emploi du temps aujourd'hui</h3>
            <a href="/teacher/schedule" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Voir tout <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-3">
            {todaySchedule.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  item.status === 'current'
                    ? 'border-indigo-500 bg-indigo-50'
                    : item.status === 'completed'
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className={`w-1 h-12 rounded-full ${
                  item.status === 'current' ? 'bg-indigo-500' :
                  item.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{item.subject}</span>
                    {item.status === 'current' && (
                      <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                        En cours
                      </span>
                    )}
                    {item.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{item.class} • {item.room}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Tâches en attente</h3>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
              {pendingTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  task.priority === 'high' ? 'bg-red-500' : 'bg-orange-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.count && (
                      <span className="text-xs text-gray-500">{task.count} copies</span>
                    )}
                    <span className={`text-xs ${
                      task.deadline === 'Aujourd\'hui' ? 'text-red-600 font-medium' : 'text-gray-500'
                    }`}>
                      {task.deadline}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Performance par classe</h3>
            <a href="/teacher/class-analytics" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Détails <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {classPerformance.map((cls, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 font-medium text-gray-800">{cls.class}</div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${(cls.average / 20) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 w-24">
                  <span className="font-bold text-indigo-600">{cls.average}</span>
                  {cls.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                  {cls.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                </div>
                <span className="text-sm text-gray-500 w-16">{cls.students} élèves</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Upcoming */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">Actions rapides</h3>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/teacher/attendance"
                className="flex flex-col items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <CheckCircle className="w-6 h-6" />
                <span className="text-xs">Faire l'appel</span>
              </a>
              <a
                href="/teacher/grading"
                className="flex flex-col items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <FileText className="w-6 h-6" />
                <span className="text-xs">Corriger</span>
              </a>
              <a
                href="/teacher/assignments"
                className="flex flex-col items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ClipboardList className="w-6 h-6" />
                <span className="text-xs">Nouveau devoir</span>
              </a>
              <a
                href="/teacher/grades"
                className="flex flex-col items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-xs">Saisir notes</span>
              </a>
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Examens à venir</h3>
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-indigo-600">{exam.date.split('/')[0]}</span>
                    <span className="text-xs text-indigo-400">Déc</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{exam.title}</p>
                    <p className="text-sm text-gray-500">{exam.class}</p>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {exam.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Soumissions récentes</h3>
          <a href="/teacher/grading" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            Voir tout <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">Élève</th>
                <th className="pb-3 font-medium">Classe</th>
                <th className="pb-3 font-medium">Devoir</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-medium">
                        {submission.student.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-800">{submission.student}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-600">{submission.class}</td>
                  <td className="py-3 text-gray-600">{submission.assignment}</td>
                  <td className="py-3 text-gray-500">{submission.date}</td>
                  <td className="py-3">
                    <button className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200">
                      Corriger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
