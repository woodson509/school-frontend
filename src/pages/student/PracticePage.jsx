/**
 * Student Practice Quiz Page
 * Self-assessment and quiz practice
 */

import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Play,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronRight,
  Target,
  Zap,
  BookOpen,
} from 'lucide-react';

const StudentPracticePage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizState, setQuizState] = useState('list'); // list, taking, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const sampleQuizzes = [
      {
        id: 1,
        title: 'Intégrales et primitives',
        subject: 'Mathématiques',
        questions: 10,
        duration: 15,
        difficulty: 'medium',
        attempts: 3,
        bestScore: 80,
        color: '#3B82F6',
      },
      {
        id: 2,
        title: 'Optique géométrique',
        subject: 'Physique',
        questions: 8,
        duration: 12,
        difficulty: 'hard',
        attempts: 1,
        bestScore: 62,
        color: '#8B5CF6',
      },
      {
        id: 3,
        title: 'Le Romantisme',
        subject: 'Français',
        questions: 12,
        duration: 20,
        difficulty: 'easy',
        attempts: 2,
        bestScore: 91,
        color: '#EF4444',
      },
      {
        id: 4,
        title: 'Grammar - Past Tenses',
        subject: 'Anglais',
        questions: 15,
        duration: 10,
        difficulty: 'easy',
        attempts: 5,
        bestScore: 100,
        color: '#F59E0B',
      },
      {
        id: 5,
        title: 'Algorithmique de base',
        subject: 'Informatique',
        questions: 10,
        duration: 15,
        difficulty: 'medium',
        attempts: 0,
        bestScore: null,
        color: '#6366F1',
      },
      {
        id: 6,
        title: 'La Seconde Guerre mondiale',
        subject: 'Histoire',
        questions: 20,
        duration: 25,
        difficulty: 'medium',
        attempts: 1,
        bestScore: 75,
        color: '#EC4899',
      },
    ];
    setQuizzes(sampleQuizzes);
  }, []);

  const sampleQuestions = [
    {
      id: 1,
      question: 'Quelle est la primitive de f(x) = 2x ?',
      options: ['x²', 'x² + C', '2x²', 'x'],
      correct: 1,
    },
    {
      id: 2,
      question: 'L\'intégrale de cos(x) est :',
      options: ['-sin(x) + C', 'sin(x) + C', 'cos(x) + C', '-cos(x) + C'],
      correct: 1,
    },
    {
      id: 3,
      question: 'La primitive de 1/x est :',
      options: ['ln(x) + C', 'x⁻¹ + C', 'e^x + C', 'log(x) + C'],
      correct: 0,
    },
  ];

  const getDifficultyBadge = (difficulty) => {
    const styles = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-orange-100 text-orange-700',
      hard: 'bg-red-100 text-red-700',
    };
    const labels = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[difficulty]}`}>
        {labels[difficulty]}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizState('taking');
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
  };

  const answerQuestion = (answerIndex) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      let correct = 0;
      newAnswers.forEach((answer, index) => {
        if (answer === sampleQuestions[index].correct) correct++;
      });
      setScore(Math.round((correct / sampleQuestions.length) * 100));
      setQuizState('result');
    }
  };

  const resetQuiz = () => {
    setQuizState('list');
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
  };

  // Quiz List View
  if (quizState === 'list') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quiz d'entraînement</h1>
          <p className="text-gray-500">Testez vos connaissances et progressez</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{quizzes.length}</p>
                <p className="text-xs text-gray-500">Quiz disponibles</p>
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
                  {quizzes.reduce((acc, q) => acc + q.attempts, 0)}
                </p>
                <p className="text-xs text-gray-500">Tentatives</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(
                    quizzes.filter(q => q.bestScore).reduce((acc, q) => acc + q.bestScore, 0) /
                    quizzes.filter(q => q.bestScore).length
                  ) || 0}%
                </p>
                <p className="text-xs text-gray-500">Score moyen</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {quizzes.filter(q => q.bestScore >= 80).length}
                </p>
                <p className="text-xs text-gray-500">Maîtrisés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Practice */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Quiz rapide</h3>
                <p className="text-emerald-100">10 questions aléatoires de toutes les matières</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors">
              <Play className="w-5 h-5" />
              Commencer
            </button>
          </div>
        </div>

        {/* Quiz List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-2" style={{ backgroundColor: quiz.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${quiz.color}20` }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: quiz.color }} />
                  </div>
                  {getDifficultyBadge(quiz.difficulty)}
                </div>

                <h3 className="font-semibold text-gray-800 mb-1">{quiz.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{quiz.subject}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {quiz.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {quiz.duration} min
                  </span>
                </div>

                {quiz.bestScore !== null ? (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Meilleur score</span>
                    <span className={`text-lg font-bold ${getScoreColor(quiz.bestScore)}`}>
                      {quiz.bestScore}%
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 mb-4">Pas encore tenté</div>
                )}

                <button
                  onClick={() => startQuiz(quiz)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: `${quiz.color}10`, color: quiz.color }}
                >
                  <Play className="w-4 h-4" />
                  {quiz.attempts > 0 ? 'Réessayer' : 'Commencer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Quiz Taking View
  if (quizState === 'taking') {
    const question = sampleQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">{selectedQuiz.title}</h2>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1}/{sampleQuestions.length}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h3>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => answerQuestion(index)}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cancel */}
        <button
          onClick={resetQuiz}
          className="mt-4 text-gray-500 text-sm hover:text-gray-700"
        >
          Abandonner le quiz
        </button>
      </div>
    );
  }

  // Quiz Result View
  if (quizState === 'result') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
            score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-orange-100' : 'bg-red-100'
          }`}>
            {score >= 80 ? (
              <Award className="w-12 h-12 text-green-600" />
            ) : score >= 60 ? (
              <TrendingUp className="w-12 h-12 text-orange-600" />
            ) : (
              <RotateCcw className="w-12 h-12 text-red-600" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {score >= 80 ? 'Excellent !' : score >= 60 ? 'Bien joué !' : 'Continuez à pratiquer !'}
          </h2>
          <p className="text-gray-500 mb-6">{selectedQuiz.title}</p>

          <div className={`text-6xl font-bold mb-6 ${getScoreColor(score)}`}>
            {score}%
          </div>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-2xl font-bold">
                  {answers.filter((a, i) => a === sampleQuestions[i].correct).length}
                </span>
              </div>
              <p className="text-sm text-gray-500">Correctes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-red-600">
                <XCircle className="w-5 h-5" />
                <span className="text-2xl font-bold">
                  {answers.filter((a, i) => a !== sampleQuestions[i].correct).length}
                </span>
              </div>
              <p className="text-sm text-gray-500">Incorrectes</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetQuiz}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
            >
              Retour aux quiz
            </button>
            <button
              onClick={() => startQuiz(selectedQuiz)}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudentPracticePage;
