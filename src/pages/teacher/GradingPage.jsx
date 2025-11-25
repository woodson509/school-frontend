/**
 * Teacher Grading Page
 * Correct and grade student submissions
 * INNOVATIVE: Side-by-side view with quick grading
 */

import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
  Clock,
  User,
  Filter,
  Search,
  Eye,
  Save,
  Send,
} from 'lucide-react';

const TeacherGradingPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleSubmissions = [
      { id: 1, student: 'Jean Pierre', class: '6ème A', assignment: 'Exercices Ch.5', submittedAt: '14/12 10:30', status: 'pending', content: 'Contenu de la soumission...', files: ['exercice.pdf'], grade: null, feedback: '' },
      { id: 2, student: 'Marie Claire', class: '6ème A', assignment: 'Exercices Ch.5', submittedAt: '14/12 09:15', status: 'pending', content: 'Travail de Marie...', files: ['devoir.pdf'], grade: null, feedback: '' },
      { id: 3, student: 'Paul Martin', class: '5ème B', assignment: 'TP Géométrie', submittedAt: '13/12 18:45', status: 'pending', content: 'TP complet de Paul...', files: ['tp_geometrie.pdf', 'figures.png'], grade: null, feedback: '' },
      { id: 4, student: 'Sophie Durand', class: '6ème A', assignment: 'Exercices Ch.5', submittedAt: '13/12 14:20', status: 'graded', content: 'Exercices résolus...', files: ['exercice.pdf'], grade: 16, feedback: 'Bon travail!' },
      { id: 5, student: 'Lucas Petit', class: '6ème A', assignment: 'Exercices Ch.5', submittedAt: '13/12 11:00', status: 'graded', content: 'Solutions...', files: ['solution.pdf'], grade: 12, feedback: 'À améliorer' },
      { id: 6, student: 'Emma Martin', class: '5ème B', assignment: 'QCM Algèbre', submittedAt: '12/12 16:30', status: 'pending', content: 'Réponses QCM...', files: [], grade: null, feedback: '' },
    ];

    setTimeout(() => {
      setSubmissions(sampleSubmissions);
      setLoading(false);
    }, 500);
  }, []);

  const filteredSubmissions = submissions.filter(s =>
    filter === 'all' || s.status === filter
  );

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;

  const updateSubmission = (id, updates) => {
    setSubmissions(submissions.map(s =>
      s.id === id ? { ...s, ...updates } : s
    ));
    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, ...updates });
    }
  };

  const gradeSubmission = (id) => {
    updateSubmission(id, { status: 'graded' });
  };

  const navigateSubmission = (direction) => {
    const currentIndex = filteredSubmissions.findIndex(s => s.id === selectedSubmission?.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex < filteredSubmissions.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredSubmissions.length - 1;
    }
    setSelectedSubmission(filteredSubmissions[newIndex]);
  };

  const quickGrades = [20, 18, 16, 14, 12, 10, 8, 5, 0];

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
          <h1 className="text-2xl font-bold text-gray-800">Correction</h1>
          <p className="text-gray-500">{pendingCount} soumissions en attente</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Toutes ({submissions.length})</option>
            <option value="pending">En attente ({pendingCount})</option>
            <option value="graded">Corrigées ({gradedCount})</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              <p className="text-xs text-gray-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{gradedCount}</p>
              <p className="text-xs text-gray-500">Corrigées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">{submissions.length}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {gradedCount > 0 
                  ? (submissions.filter(s => s.grade).reduce((sum, s) => sum + s.grade, 0) / gradedCount).toFixed(1)
                  : '-'
                }
              </p>
              <p className="text-xs text-gray-500">Moyenne</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                onClick={() => setSelectedSubmission(submission)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedSubmission?.id === submission.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-medium">
                      {submission.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{submission.student}</p>
                      <p className="text-xs text-gray-500">{submission.class}</p>
                    </div>
                  </div>
                  {submission.status === 'graded' ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {submission.grade}/20
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      En attente
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{submission.assignment}</p>
                <p className="text-xs text-gray-400">{submission.submittedAt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grading Panel */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <div className="bg-white rounded-xl shadow-sm">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                      {selectedSubmission.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedSubmission.student}</h3>
                      <p className="text-sm text-gray-500">{selectedSubmission.assignment}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateSubmission('prev')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-500">
                      {filteredSubmissions.findIndex(s => s.id === selectedSubmission.id) + 1}/{filteredSubmissions.length}
                    </span>
                    <button
                      onClick={() => navigateSubmission('next')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Travail soumis</h4>
                <div className="p-4 bg-gray-50 rounded-lg mb-4 min-h-[150px]">
                  <p className="text-gray-700">{selectedSubmission.content}</p>
                </div>

                {selectedSubmission.files.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Fichiers joints</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.files.map((file, i) => (
                        <a
                          key={i}
                          href="#"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{file}</span>
                          <Download className="w-4 h-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Grading */}
              <div className="p-4 space-y-4">
                <div>
                  <label className="block font-medium text-gray-800 mb-2">Note rapide</label>
                  <div className="flex flex-wrap gap-2">
                    {quickGrades.map((grade) => (
                      <button
                        key={grade}
                        onClick={() => updateSubmission(selectedSubmission.id, { grade })}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedSubmission.grade === grade
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {grade}/20
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-800 mb-2">Ou note personnalisée</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={selectedSubmission.grade || ''}
                    onChange={(e) => updateSubmission(selectedSubmission.id, { grade: parseFloat(e.target.value) })}
                    placeholder="Note /20"
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-800 mb-2">Commentaire</label>
                  <textarea
                    value={selectedSubmission.feedback}
                    onChange={(e) => updateSubmission(selectedSubmission.id, { feedback: e.target.value })}
                    placeholder="Ajouter un commentaire pour l'élève..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => gradeSubmission(selectedSubmission.id)}
                    disabled={selectedSubmission.grade === null}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Valider et passer au suivant
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Save className="w-5 h-5" />
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sélectionnez une soumission</h3>
              <p className="text-gray-500">Cliquez sur une soumission pour la corriger</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherGradingPage;
