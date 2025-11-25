/**
 * Teacher Question Bank Page
 * Manage reusable questions library
 * INNOVATIVE: Organized question library with tags and difficulty
 */

import { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Search,
  Filter,
  Tag,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  Square,
  Type,
  Star,
  Folder,
} from 'lucide-react';

const TeacherQuestionBankPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const sampleQuestions = [
      { id: 1, text: 'Calculer la primitive de f(x) = 2x + 3', type: 'short', category: 'Intégrales', difficulty: 'easy', tags: ['primitives', 'calcul'], usedIn: 5 },
      { id: 2, text: 'Quelle est la dérivée de sin(x)?', type: 'multiple', category: 'Dérivées', difficulty: 'easy', tags: ['dérivées', 'trigonométrie'], usedIn: 8, options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correct: 0 },
      { id: 3, text: 'Résoudre l\'équation x² - 5x + 6 = 0', type: 'short', category: 'Équations', difficulty: 'medium', tags: ['équations', '2nd degré'], usedIn: 12 },
      { id: 4, text: 'Démontrer que √2 est irrationnel', type: 'essay', category: 'Démonstrations', difficulty: 'hard', tags: ['démonstration', 'irrationnels'], usedIn: 2 },
      { id: 5, text: 'Le théorème de Pythagore s\'applique à tout triangle.', type: 'truefalse', category: 'Géométrie', difficulty: 'easy', tags: ['pythagore', 'triangles'], usedIn: 15, correct: false },
      { id: 6, text: 'Calculer l\'intégrale de 0 à 1 de x² dx', type: 'short', category: 'Intégrales', difficulty: 'medium', tags: ['intégrales', 'calcul'], usedIn: 7 },
      { id: 7, text: 'Développer (a + b)³', type: 'short', category: 'Algèbre', difficulty: 'medium', tags: ['développement', 'identités'], usedIn: 10 },
      { id: 8, text: 'Quelle est la probabilité de tirer un as dans un jeu de 52 cartes?', type: 'multiple', category: 'Probabilités', difficulty: 'easy', tags: ['probabilités', 'cartes'], usedIn: 6, options: ['1/52', '1/13', '4/52', '1/4'], correct: 1 },
    ];

    setTimeout(() => {
      setQuestions(sampleQuestions);
      setLoading(false);
    }, 500);
  }, []);

  const categories = ['all', 'Intégrales', 'Dérivées', 'Équations', 'Géométrie', 'Algèbre', 'Probabilités', 'Démonstrations'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filteredQuestions = questions.filter(q => {
    const matchCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchDifficulty && matchSearch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'multiple': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'truefalse': return <Square className="w-4 h-4 text-green-500" />;
      case 'short': return <Type className="w-4 h-4 text-orange-500" />;
      case 'essay': return <Type className="w-4 h-4 text-purple-500" />;
      default: return <Type className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const styles = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      hard: 'bg-red-100 text-red-700',
    };
    const labels = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[difficulty]}`}>
        {labels[difficulty]}
      </span>
    );
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Banque de questions</h1>
          <p className="text-gray-500">{questions.length} questions disponibles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle question
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Database className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{questions.length}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {questions.filter(q => q.type === 'multiple').length}
              </p>
              <p className="text-xs text-gray-500">QCM</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Type className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {questions.filter(q => q.type === 'short' || q.type === 'essay').length}
              </p>
              <p className="text-xs text-gray-500">Ouvertes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Folder className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{categories.length - 1}</p>
              <p className="text-xs text-gray-500">Catégories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'Toutes catégories' : c}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            {difficulties.map(d => (
              <option key={d} value={d}>
                {d === 'all' ? 'Toutes difficultés' : d === 'easy' ? 'Facile' : d === 'medium' ? 'Moyen' : 'Difficile'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                {getTypeIcon(question.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                    {question.category}
                  </span>
                  {getDifficultyBadge(question.difficulty)}
                  <span className="text-xs text-gray-400">
                    Utilisée {question.usedIn} fois
                  </span>
                </div>
                <p className="text-gray-800 font-medium mb-2">{question.text}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {question.tags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Modifier">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Dupliquer">
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Supprimer">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune question trouvée</p>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Nouvelle question</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de question</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option value="multiple">Choix multiple (QCM)</option>
                  <option value="truefalse">Vrai/Faux</option>
                  <option value="short">Réponse courte</option>
                  <option value="essay">Rédaction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <textarea
                  placeholder="Entrez votre question..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    {categories.filter(c => c !== 'all').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  placeholder="Ex: algèbre, équations, 2nd degré"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherQuestionBankPage;
