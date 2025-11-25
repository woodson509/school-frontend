/**
 * Teacher Quiz Builder Page
 * Create and manage quizzes with various question types
 * INNOVATIVE: Visual quiz builder with drag-and-drop
 */

import { useState } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  Eye,
  Settings,
  Copy,
  CheckCircle,
  Circle,
  Square,
  Type,
  List,
  AlignLeft,
  Image,
  Clock,
  Target,
  Shuffle,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

const TeacherQuizBuilderPage = () => {
  const [quiz, setQuiz] = useState({
    title: 'Nouveau quiz',
    description: '',
    class: '',
    subject: 'Mathématiques',
    duration: 30,
    shuffleQuestions: false,
    showResults: true,
    passingScore: 50,
    questions: [],
  });

  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const questionTypes = [
    { id: 'multiple', label: 'Choix multiple', icon: CheckCircle, description: 'Une seule bonne réponse' },
    { id: 'checkbox', label: 'Cases à cocher', icon: Square, description: 'Plusieurs bonnes réponses' },
    { id: 'truefalse', label: 'Vrai/Faux', icon: Circle, description: 'Question binaire' },
    { id: 'shortanswer', label: 'Réponse courte', icon: Type, description: 'Texte court' },
    { id: 'essay', label: 'Rédaction', icon: AlignLeft, description: 'Texte long' },
    { id: 'matching', label: 'Association', icon: List, description: 'Associer des éléments' },
  ];

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      text: '',
      points: 1,
      options: type === 'multiple' || type === 'checkbox' ? [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false },
        { id: 3, text: '', isCorrect: false },
        { id: 4, text: '', isCorrect: false },
      ] : type === 'truefalse' ? [
        { id: 1, text: 'Vrai', isCorrect: false },
        { id: 2, text: 'Faux', isCorrect: false },
      ] : [],
      correctAnswer: '',
      explanation: '',
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
    setActiveQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId, updates) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    });
  };

  const deleteQuestion = (questionId) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter(q => q.id !== questionId),
    });
    if (activeQuestion === questionId) {
      setActiveQuestion(null);
    }
  };

  const updateOption = (questionId, optionId, updates) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map(q => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: q.options.map(opt =>
            opt.id === optionId ? { ...opt, ...updates } : opt
          ),
        };
      }),
    });
  };

  const setCorrectOption = (questionId, optionId, questionType) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map(q => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: q.options.map(opt => ({
            ...opt,
            isCorrect: questionType === 'checkbox'
              ? (opt.id === optionId ? !opt.isCorrect : opt.isCorrect)
              : opt.id === optionId,
          })),
        };
      }),
    });
  };

  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Créateur de quiz</h1>
          <p className="text-gray-500">{quiz.questions.length} questions • {totalPoints} points</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Eye className="w-4 h-4" />
            Aperçu
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Settings className="w-4 h-4" />
            Paramètres
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Paramètres du quiz</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
              <select
                value={quiz.class}
                onChange={(e) => setQuiz({ ...quiz, class: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Sélectionner...</option>
                <option value="6A">6ème A</option>
                <option value="5B">5ème B</option>
                <option value="4A">4ème A</option>
                <option value="3C">3ème C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
              <input
                type="number"
                value={quiz.duration}
                onChange={(e) => setQuiz({ ...quiz, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note de passage (%)</label>
              <input
                type="number"
                value={quiz.passingScore}
                onChange={(e) => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="shuffle"
                checked={quiz.shuffleQuestions}
                onChange={(e) => setQuiz({ ...quiz, shuffleQuestions: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="shuffle" className="text-sm text-gray-700">Mélanger les questions</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showResults"
                checked={quiz.showResults}
                onChange={(e) => setQuiz({ ...quiz, showResults: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="showResults" className="text-sm text-gray-700">Afficher résultats immédiatement</label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Types */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Types de questions</h3>
          <div className="space-y-2">
            {questionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => addQuestion(type.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <type.icon className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{type.label}</p>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Questions</span>
              <span className="font-semibold text-gray-800">{quiz.questions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Points total</span>
              <span className="font-semibold text-indigo-600">{totalPoints}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Durée</span>
              <span className="font-semibold text-gray-800">{quiz.duration} min</span>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="lg:col-span-3 space-y-4">
          {quiz.questions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucune question</h3>
              <p className="text-gray-500 mb-4">Commencez par ajouter une question depuis le panneau de gauche</p>
            </div>
          ) : (
            quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${
                  activeQuestion === question.id ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                {/* Question Header */}
                <div
                  className="flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer"
                  onClick={() => setActiveQuestion(activeQuestion === question.id ? null : question.id)}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {question.text || 'Question sans titre'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {questionTypes.find(t => t.id === question.type)?.label} • {question.points} point(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteQuestion(question.id); }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {activeQuestion === question.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Question Editor */}
                {activeQuestion === question.id && (
                  <div className="p-4 space-y-4">
                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <textarea
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                        placeholder="Entrez votre question..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Points */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700">Points:</label>
                      <input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                        className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Options for Multiple Choice / Checkbox / True-False */}
                    {(question.type === 'multiple' || question.type === 'checkbox' || question.type === 'truefalse') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options (cliquez pour marquer comme correcte)
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={option.id} className="flex items-center gap-3">
                              <button
                                onClick={() => setCorrectOption(question.id, option.id, question.type)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  option.isCorrect
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-300 hover:border-green-500'
                                }`}
                              >
                                {option.isCorrect && <CheckCircle className="w-4 h-4" />}
                              </button>
                              <span className="text-sm text-gray-500 w-6">{String.fromCharCode(65 + optIndex)}.</span>
                              {question.type === 'truefalse' ? (
                                <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg">{option.text}</span>
                              ) : (
                                <input
                                  type="text"
                                  value={option.text}
                                  onChange={(e) => updateOption(question.id, option.id, { text: e.target.value })}
                                  placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Short Answer */}
                    {question.type === 'shortanswer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Réponse correcte</label>
                        <input
                          type="text"
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                          placeholder="Entrez la réponse correcte..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}

                    {/* Explanation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Explication (optionnel)</label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                        placeholder="Explication affichée après la réponse..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherQuizBuilderPage;
