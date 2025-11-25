/**
 * Teacher Feedback Page (INNOVATIVE)
 * Collect and analyze student feedback
 */

import { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Star, TrendingUp, Users, Calendar, Plus, Eye } from 'lucide-react';

const TeacherFeedbackPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('semester1');

  const feedback = {
    overall: {
      rating: 4.7,
      responseRate: 85,
      totalResponses: 127,
      trend: '+0.3',
    },
    categories: [
      { name: 'Clarté des explications', score: 4.8, responses: 127 },
      { name: 'Disponibilité', score: 4.6, responses: 127 },
      { name: 'Gestion de classe', score: 4.7, responses: 127 },
      { name: 'Matériel pédagogique', score: 4.5, responses: 127 },
      { name: 'Évaluation juste', score: 4.9, responses: 127 },
    ],
    comments: [
      { id: 1, student: 'Anonyme', class: '6ème A', date: '2024-12-10', sentiment: 'positive', text: 'Excellent professeur! Les cours sont très clairs et intéressants.' },
      { id: 2, student: 'Anonyme', class: '5ème B', date: '2024-12-08', sentiment: 'positive', text: 'J\'apprécie la patience et les explications détaillées.' },
      { id: 3, student: 'Anonyme', class: '6ème A', date: '2024-12-05', sentiment: 'neutral', text: 'Bon professeur, mais parfois les devoirs sont un peu difficiles.' },
      { id: 4, student: 'Anonyme', class: '4ème C', date: '2024-12-03', sentiment: 'positive', text: 'Les méthodes d\'enseignement sont innovantes et captivantes!' },
    ],
    strengths: [
      'Communication claire et efficace',
      'Utilisation d\'exemples concrets',
      'Disponibilité pour aider les étudiants',
      'Passion pour la matière',
    ],
    improvements: [
      'Varier davantage les méthodes d\'évaluation',
      'Donner plus de temps pour certains exercices',
      'Utiliser plus de supports visuels',
    ],
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return <ThumbsUp className="w-4 h-4 text-green-500" />;
    if (sentiment === 'negative') return <ThumbsDown className="w-4 h-4 text-red-500" />;
    return <MessageSquare className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Feedback des étudiants</h1>
          <p className="text-gray-500">Améliorez votre enseignement grâce aux retours</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="semester1">Trimestre 1</option>
          <option value="semester2">Trimestre 2</option>
          <option value="year">Année complète</option>
        </select>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl p-6 text-white">
          <Star className="w-8 h-8 mb-3 opacity-80" />
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold">{feedback.overall.rating}</p>
            <p className="text-orange-100 mb-1">/5.0</p>
          </div>
          <p className="text-orange-100 text-sm">Note moyenne</p>
          <p className="text-xs text-orange-100 mt-1">↑ {feedback.overall.trend} vs dernier trimestre</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Users className="w-8 h-8 mb-3 text-blue-600" />
          <p className="text-3xl font-bold text-gray-800">{feedback.overall.responseRate}%</p>
          <p className="text-gray-500 text-sm">Taux de réponse</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <MessageSquare className="w-8 h-8 mb-3 text-green-600" />
          <p className="text-3xl font-bold text-gray-800">{feedback.overall.totalResponses}</p>
          <p className="text-gray-500 text-sm">Réponses</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <TrendingUp className="w-8 h-8 mb-3 text-purple-600" />
          <p className="text-3xl font-bold text-gray-800">+12%</p>
          <p className="text-gray-500 text-sm">Progression</p>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Évaluation par critère</h3>
        <div className="space-y-4">
          {feedback.categories.map((cat, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{cat.score}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(cat.score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  style={{ width: `${(cat.score / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{cat.responses} réponses</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-4">
            <ThumbsUp className="w-5 h-5" />
            Points forts
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                <span className="text-green-500 mt-1">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="flex items-center gap-2 font-semibold text-blue-800 mb-4">
            <TrendingUp className="w-5 h-5" />
            Axes d'amélioration
          </h3>
          <ul className="space-y-2">
            {feedback.improvements.map((improvement, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-500 mt-1">→</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Commentaires récents</h3>
        <div className="space-y-4">
          {feedback.comments.map(comment => (
            <div key={comment.id} className="p-4 border rounded-xl hover:border-blue-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{comment.student}</p>
                    <p className="text-xs text-gray-500">{comment.class} • {comment.date}</p>
                  </div>
                </div>
                {getSentimentIcon(comment.sentiment)}
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <MessageSquare className="w-12 h-12 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Créer une nouvelle enquête</h3>
            <p className="text-blue-100 mb-4">
              Recueillez des retours spécifiques sur un cours ou un projet particulier.
            </p>
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
              Créer une enquête
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherFeedbackPage;
