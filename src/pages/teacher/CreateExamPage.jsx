/**
 * Teacher Create Exam Page
 * Build exams with multiple question types
 */

import { useState } from 'react';
import { CheckSquare, Plus, Trash2, GripVertical, Calendar, Clock, Users, Save, Send } from 'lucide-react';

const TeacherCreateExamPage = () => {
  const [exam, setExam] = useState({
    title: '',
    class: '',
    date: '',
    duration: 60,
    totalPoints: 20,
    instructions: '',
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'mcq', // mcq, true-false, short-answer, essay
    question: '',
    points: 1,
    options: ['', '', '', ''],
    correctAnswer: 0,
  });

  const questionTypes = [
    { value: 'mcq', label: 'QCM', icon: CheckSquare },
    { value: 'true-false', label: 'Vrai/Faux', icon: CheckSquare },
    { value: 'short-answer', label: 'Réponse courte', icon: CheckSquare },
    { value: 'essay', label: 'Dissertation', icon: CheckSquare },
  ];

  const addQuestion = () => {
    setExam({
      ...exam,
      questions: [...exam.questions, {...currentQuestion, id: Date.now()}]
    });
    setCurrentQuestion({
      type: 'mcq',
      question: '',
      points: 1,
      options: ['', '', '', ''],
      correctAnswer: 0,
    });
  };

  const removeQuestion = (id) => {
    setExam({
      ...exam,
      questions: exam.questions.filter(q => q.id !== id)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Créer un examen</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border text-gray-700 rounded-lg hover:bg-gray-50">
            <Save className="w-4 h-4" />
            Brouillon
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Send className="w-4 h-4" />
            Publier
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'examen *</label>
          <input
            type="text"
            value={exam.title}
            onChange={(e) => setExam({...exam, title: e.target.value})}
            placeholder="Ex: Contrôle Chapitre 5 - Intégrales"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classe *</label>
            <select className="w-full px-4 py-2 border rounded-lg">
              <option>6ème A</option>
              <option>6ème B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input type="date" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durée (min)</label>
            <input
              type="number"
              value={exam.duration}
              onChange={(e) => setExam({...exam, duration: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Consignes</label>
          <textarea
            rows={3}
            placeholder="Instructions générales..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Questions ({exam.questions.length})</h3>
        {exam.questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-start gap-3">
              <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">Question {idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{q.points} pts</span>
                    <button onClick={() => removeQuestion(q.id)} className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{q.question}</p>
                {q.type === 'mcq' && (
                  <div className="space-y-1">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`px-3 py-1 rounded text-sm ${i === q.correctAnswer ? 'bg-green-50 text-green-700' : 'bg-gray-50'}`}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Question */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Ajouter une question</h3>
        
        <div className="flex gap-2">
          {questionTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setCurrentQuestion({...currentQuestion, type: type.value})}
              className={`px-4 py-2 rounded-lg text-sm ${
                currentQuestion.type === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
          <textarea
            value={currentQuestion.question}
            onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {currentQuestion.type === 'mcq' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            {currentQuestion.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name="correct"
                  checked={currentQuestion.correctAnswer === idx}
                  onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: idx})}
                />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...currentQuestion.options];
                    newOpts[idx] = e.target.value;
                    setCurrentQuestion({...currentQuestion, options: newOpts});
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm text-gray-600 mr-2">Points:</label>
            <input
              type="number"
              value={currentQuestion.points}
              onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value)})}
              className="w-20 px-3 py-1 border rounded-lg"
            />
          </div>
          <button
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreateExamPage;
