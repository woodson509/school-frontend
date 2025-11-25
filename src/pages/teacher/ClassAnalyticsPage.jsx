/**
 * Teacher Class Analytics Page
 * Detailed analytics and insights about class performance
 * INNOVATIVE: Data visualization and AI-powered insights
 */

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  AlertCircle,
  Target,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  BookOpen,
  Clock,
  CheckCircle,
} from 'lucide-react';

const TeacherClassAnalyticsPage = () => {
  const [selectedClass, setSelectedClass] = useState('6A');
  const [period, setPeriod] = useState('trimestre');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const analyticsData = {
      overview: {
        average: 15.2,
        previousAverage: 14.5,
        mediane: 15.5,
        highest: 19,
        lowest: 8,
        passRate: 87.5,
        attendance: 94,
        assignmentCompletion: 92,
      },
      distribution: [
        { range: '0-5', count: 0, percentage: 0 },
        { range: '6-8', count: 2, percentage: 6.25 },
        { range: '9-10', count: 2, percentage: 6.25 },
        { range: '11-12', count: 4, percentage: 12.5 },
        { range: '13-14', count: 6, percentage: 18.75 },
        { range: '15-16', count: 10, percentage: 31.25 },
        { range: '17-18', count: 6, percentage: 18.75 },
        { range: '19-20', count: 2, percentage: 6.25 },
      ],
      topStudents: [
        { name: 'Jean Pierre', average: 18.5, trend: 'up', improvement: 1.2 },
        { name: 'Marie Claire', average: 17.8, trend: 'up', improvement: 0.5 },
        { name: 'Paul Martin', average: 17.2, trend: 'stable', improvement: 0 },
        { name: 'Alice Dupont', average: 16.9, trend: 'up', improvement: 0.8 },
        { name: 'Hugo Bernard', average: 16.5, trend: 'down', improvement: -0.3 },
      ],
      needsAttention: [
        { name: 'Sophie Durand', average: 9.2, issue: 'Difficultés en algèbre', absences: 5 },
        { name: 'Lucas Petit', average: 10.5, issue: 'Participation faible', absences: 3 },
        { name: 'Emma Moreau', average: 11.0, issue: 'Devoirs non rendus', absences: 2 },
      ],
      monthlyProgress: [
        { month: 'Sep', average: 13.5, attendance: 96 },
        { month: 'Oct', average: 14.2, attendance: 94 },
        { month: 'Nov', average: 14.8, attendance: 93 },
        { month: 'Déc', average: 15.2, attendance: 94 },
      ],
      byTopic: [
        { topic: 'Algèbre', average: 14.5, difficulty: 'medium' },
        { topic: 'Géométrie', average: 15.8, difficulty: 'easy' },
        { topic: 'Fonctions', average: 13.2, difficulty: 'hard' },
        { topic: 'Statistiques', average: 16.2, difficulty: 'easy' },
        { topic: 'Probabilités', average: 14.0, difficulty: 'medium' },
      ],
      insights: [
        { type: 'positive', text: 'La moyenne de classe a augmenté de 0.7 points ce trimestre.' },
        { type: 'warning', text: '3 élèves nécessitent un suivi personnalisé (moyenne < 12).' },
        { type: 'positive', text: 'Le chapitre "Géométrie" est bien maîtrisé (15.8 de moyenne).' },
        { type: 'suggestion', text: 'Considérez des exercices supplémentaires sur les "Fonctions".' },
      ],
    };

    setTimeout(() => {
      setData(analyticsData);
      setLoading(false);
    }, 500);
  }, [selectedClass, period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { overview, distribution, topStudents, needsAttention, monthlyProgress, byTopic, insights } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analyse de classe</h1>
          <p className="text-gray-500">Statistiques détaillées et tendances</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="6A">6ème A</option>
            <option value="5B">5ème B</option>
            <option value="4A">4ème A</option>
            <option value="3C">3ème C</option>
            <option value="2D">2nde D</option>
          </select>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="trimestre">Ce trimestre</option>
            <option value="annee">Année complète</option>
            <option value="mois">Ce mois</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-5 text-white">
          <p className="text-indigo-200 text-sm mb-1">Moyenne classe</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">{overview.average}</p>
            <div className="flex items-center text-green-300 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+{(overview.average - overview.previousAverage).toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Taux de réussite</p>
          <p className="text-3xl font-bold text-green-600">{overview.passRate}%</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Assiduité</p>
          <p className="text-3xl font-bold text-blue-600">{overview.attendance}%</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Devoirs rendus</p>
          <p className="text-3xl font-bold text-purple-600">{overview.assignmentCompletion}%</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Insights automatiques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                insight.type === 'positive' ? 'bg-green-50' :
                insight.type === 'warning' ? 'bg-orange-50' : 'bg-blue-50'
              }`}
            >
              {insight.type === 'positive' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
              {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />}
              {insight.type === 'suggestion' && <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
              <p className="text-sm text-gray-700">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Distribution des notes</h3>
          <div className="space-y-3">
            {distribution.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-12 text-sm text-gray-600">{item.range}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-16 text-sm text-right text-gray-600">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-600">{overview.highest}</p>
              <p className="text-xs text-gray-500">Note max</p>
            </div>
            <div>
              <p className="text-lg font-bold text-indigo-600">{overview.mediane}</p>
              <p className="text-xs text-gray-500">Médiane</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-600">{overview.lowest}</p>
              <p className="text-xs text-gray-500">Note min</p>
            </div>
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Évolution mensuelle</h3>
          <div className="flex items-end justify-around h-48 px-4">
            {monthlyProgress.map((month, i) => {
              const height = ((month.average - 10) / 10) * 100;
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-sm font-medium text-indigo-600">{month.average}</span>
                  <div
                    className="w-12 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t-lg transition-all hover:from-indigo-600 hover:to-purple-500"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-sm text-gray-500">{month.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Students */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Meilleurs élèves
          </h3>
          <div className="space-y-3">
            {topStudents.map((student, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-gray-200 text-gray-700' :
                  i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.average}/20</p>
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  student.trend === 'up' ? 'text-green-600' :
                  student.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {student.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                  {student.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                  {student.improvement !== 0 && (
                    <span>{student.improvement > 0 ? '+' : ''}{student.improvement}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            À surveiller
          </h3>
          <div className="space-y-3">
            {needsAttention.map((student, i) => (
              <div key={i} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">{student.name}</p>
                  <span className="text-sm font-semibold text-orange-600">{student.average}/20</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{student.issue}</p>
                <p className="text-xs text-gray-500">{student.absences} absences</p>
              </div>
            ))}
          </div>
          <a
            href="/teacher/student-progress"
            className="block mt-4 text-center text-sm text-indigo-600 hover:text-indigo-700"
          >
            Voir le suivi individuel →
          </a>
        </div>

        {/* Performance by Topic */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Par chapitre
          </h3>
          <div className="space-y-3">
            {byTopic.map((topic, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{topic.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      topic.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      topic.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {topic.difficulty === 'easy' ? 'Facile' : topic.difficulty === 'hard' ? 'Difficile' : 'Moyen'}
                    </span>
                    <span className="font-medium text-gray-800">{topic.average}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      topic.average >= 15 ? 'bg-green-500' :
                      topic.average >= 12 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(topic.average / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherClassAnalyticsPage;
