/**
 * Student Study Planner Page
 * Plan study sessions and track goals
 */

import { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Trash2,
  Edit,
  BookOpen,
  Flame,
  TrendingUp,
  Award,
} from 'lucide-react';

const StudentPlannerPage = () => {
  const [goals, setGoals] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    // Sample data
    setGoals([
      { id: 1, title: 'Réviser les intégrales', subject: 'Mathématiques', deadline: '2024-12-18', progress: 70, completed: false },
      { id: 2, title: 'Lire chapitres 5-6', subject: 'Français', deadline: '2024-12-19', progress: 100, completed: true },
      { id: 3, title: 'Préparer exposé', subject: 'Histoire', deadline: '2024-12-20', progress: 30, completed: false },
      { id: 4, title: 'Exercices Python', subject: 'Informatique', deadline: '2024-12-17', progress: 50, completed: false },
    ]);

    setSessions([
      { id: 1, subject: 'Mathématiques', topic: 'Intégrales définies', date: '2024-12-15', startTime: '14:00', duration: 90, completed: true },
      { id: 2, subject: 'Physique', topic: 'Optique', date: '2024-12-15', startTime: '16:00', duration: 60, completed: false },
      { id: 3, subject: 'Français', topic: 'Dissertation', date: '2024-12-16', startTime: '09:00', duration: 120, completed: false },
      { id: 4, subject: 'Informatique', topic: 'Algorithmes', date: '2024-12-16', startTime: '14:00', duration: 90, completed: false },
    ]);
  }, []);

  const todaySessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const upcomingSessions = sessions.filter(s => s.date > new Date().toISOString().split('T')[0]);

  const toggleGoalComplete = (id) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...g, completed: !g.completed, progress: g.completed ? g.progress : 100 } : g
    ));
  };

  const toggleSessionComplete = (id) => {
    setSessions(sessions.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };

  const stats = {
    streak: 12,
    totalHours: 45,
    goalsCompleted: goals.filter(g => g.completed).length,
    sessionsThisWeek: 8,
  };

  const subjectColors = {
    'Mathématiques': '#3B82F6',
    'Physique': '#8B5CF6',
    'Français': '#EF4444',
    'Informatique': '#6366F1',
    'Histoire': '#EC4899',
    'Anglais': '#F59E0B',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Planificateur d'études</h1>
          <p className="text-gray-500">Organisez vos révisions et atteignez vos objectifs</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Target className="w-4 h-4" />
            Nouvel objectif
          </button>
          <button
            onClick={() => setShowSessionModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Planifier session
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8" />
            <div>
              <p className="text-3xl font-bold">{stats.streak}</p>
              <p className="text-sm opacity-90">jours de suite</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalHours}h</p>
              <p className="text-xs text-gray-500">ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.goalsCompleted}/{goals.length}</p>
              <p className="text-xs text-gray-500">objectifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.sessionsThisWeek}</p>
              <p className="text-xs text-gray-500">sessions/semaine</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Sessions */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'today' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500'
                }`}
              >
                Aujourd'hui ({todaySessions.length})
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'upcoming' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500'
                }`}
              >
                À venir ({upcomingSessions.length})
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {(activeTab === 'today' ? todaySessions : upcomingSessions).map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  session.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleSessionComplete(session.id)}
                      className="mt-1"
                    >
                      {session.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subjectColors[session.subject] || '#6B7280' }}
                        />
                        <span className="font-medium text-gray-800">{session.subject}</span>
                      </div>
                      <p className={`text-sm ${session.completed ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                        {session.topic}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.startTime}
                        </span>
                        <span>{session.duration} min</span>
                        {activeTab === 'upcoming' && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {session.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(activeTab === 'today' ? todaySessions : upcomingSessions).length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune session planifiée</p>
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="mt-2 text-emerald-600 text-sm font-medium hover:text-emerald-700"
                >
                  + Ajouter une session
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Mes objectifs</h3>
            <button
              onClick={() => setShowGoalModal(true)}
              className="text-emerald-600 text-sm font-medium hover:text-emerald-700"
            >
              + Ajouter
            </button>
          </div>
          <div className="p-4 space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`p-4 rounded-xl border transition-all ${
                  goal.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleGoalComplete(goal.id)}>
                      {goal.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </button>
                    <div>
                      <p className={`font-medium ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {goal.title}
                      </p>
                      <p className="text-sm text-gray-500">{goal.subject}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    new Date(goal.deadline) < new Date() && !goal.completed
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {goal.deadline}
                  </span>
                </div>
                <div className="ml-8">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Progression</span>
                    <span className="font-medium text-gray-700">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        goal.completed ? 'bg-green-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pomodoro Timer Widget */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">🍅 Technique Pomodoro</h3>
            <p className="text-emerald-100">
              Étudiez pendant 25 minutes, puis faites une pause de 5 minutes
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors">
            Démarrer un Pomodoro
          </button>
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Nouvel objectif</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: Réviser les intégrales"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option>Mathématiques</option>
                  <option>Physique</option>
                  <option>Français</option>
                  <option>Informatique</option>
                  <option>Histoire</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date limite</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Planifier une session</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option>Mathématiques</option>
                  <option>Physique</option>
                  <option>Français</option>
                  <option>Informatique</option>
                  <option>Histoire</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: Chapitre 5 - Intégrales"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option value="30">30 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="90">1h30</option>
                  <option value="120">2 heures</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Planifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPlannerPage;
