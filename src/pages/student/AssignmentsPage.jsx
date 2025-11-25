/**
 * Student Assignments Page
 * View and submit homework
 */

import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Calendar,
  Clock,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Eye,
  ChevronRight,
} from 'lucide-react';

const StudentAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const sampleAssignments = [
      { id: 1, title: 'Exercices chapitre 5 - Intégrales', course: 'Mathématiques', teacher: 'M. Dupont', dueDate: '2024-12-17', status: 'pending', priority: 'high', description: 'Faire les exercices 1 à 15 du chapitre 5. Montrer tous les calculs.', attachments: ['exercices_ch5.pdf'], points: 20 },
      { id: 2, title: 'Compte-rendu TP Optique', course: 'Physique', teacher: 'M. Bernard', dueDate: '2024-12-18', status: 'pending', priority: 'medium', description: 'Rédiger le compte-rendu du TP sur la réfraction de la lumière.', attachments: ['modele_cr.docx'], points: 15 },
      { id: 3, title: 'Lecture pages 45-60', course: 'Français', teacher: 'Mme Martin', dueDate: '2024-12-19', status: 'pending', priority: 'low', description: 'Lire les pages 45 à 60 du roman et préparer un résumé.', attachments: [], points: 10 },
      { id: 4, title: 'Dissertation: La mondialisation', course: 'Histoire', teacher: 'M. Robert', dueDate: '2024-12-20', status: 'pending', priority: 'high', description: 'Dissertation de 3 pages minimum sur les effets de la mondialisation.', attachments: ['consignes.pdf', 'sources.pdf'], points: 40 },
      { id: 5, title: 'Projet Python - Calculatrice', course: 'Informatique', teacher: 'Mme Moreau', dueDate: '2024-12-16', status: 'submitted', priority: 'high', description: 'Créer une calculatrice graphique en Python avec Tkinter.', attachments: ['projet_specs.pdf'], points: 30, submittedDate: '2024-12-15', submittedFile: 'calculatrice.py' },
      { id: 6, title: 'Exercices vocabulaire Unit 4', course: 'Anglais', teacher: 'Mme Petit', dueDate: '2024-12-14', status: 'graded', priority: 'medium', description: 'Compléter tous les exercices de vocabulaire de l\'unité 4.', attachments: [], points: 15, grade: 14, feedback: 'Bon travail! Attention aux faux-amis.' },
      { id: 7, title: 'QCM Chimie Organique', course: 'Chimie', teacher: 'M. Simon', dueDate: '2024-12-13', status: 'graded', priority: 'low', description: 'QCM en ligne sur les hydrocarbures.', attachments: [], points: 20, grade: 18, feedback: 'Excellent!' },
      { id: 8, title: 'Exposé sur la photosynthèse', course: 'Biologie', teacher: 'M. Leroy', dueDate: '2024-12-12', status: 'late', priority: 'high', description: 'Préparer un exposé de 10 minutes sur la photosynthèse.', attachments: ['grille_evaluation.pdf'], points: 25 },
    ];
    
    setTimeout(() => {
      setAssignments(sampleAssignments);
      setLoading(false);
    }, 500);
  }, []);

  const filteredAssignments = assignments.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-700',
      submitted: 'bg-blue-100 text-blue-700',
      graded: 'bg-green-100 text-green-700',
      late: 'bg-red-100 text-red-700',
    };
    const labels = {
      pending: 'À rendre',
      submitted: 'Soumis',
      graded: 'Noté',
      late: 'En retard',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityIndicator = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-orange-500',
      low: 'bg-green-500',
    };
    return <div className={`w-2 h-2 rounded-full ${colors[priority]}`} />;
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes devoirs</h1>
          <p className="text-gray-500">{assignments.filter(a => a.status === 'pending').length} devoirs à rendre</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tous</option>
            <option value="pending">À rendre</option>
            <option value="submitted">Soumis</option>
            <option value="graded">Notés</option>
            <option value="late">En retard</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {assignments.filter(a => a.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-500">À rendre</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {assignments.filter(a => a.status === 'submitted').length}
              </p>
              <p className="text-xs text-gray-500">Soumis</p>
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
                {assignments.filter(a => a.status === 'graded').length}
              </p>
              <p className="text-xs text-gray-500">Notés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {assignments.filter(a => a.status === 'late').length}
              </p>
              <p className="text-xs text-gray-500">En retard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const daysRemaining = getDaysRemaining(assignment.dueDate);
          return (
            <div
              key={assignment.id}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAssignment(assignment)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {getPriorityIndicator(assignment.priority)}
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{assignment.course} • {assignment.teacher}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {assignment.dueDate}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <FileText className="w-4 h-4" />
                        {assignment.points} pts
                      </div>
                      {assignment.status === 'pending' && daysRemaining >= 0 && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          daysRemaining <= 1 ? 'bg-red-100 text-red-700' :
                          daysRemaining <= 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {daysRemaining === 0 ? 'Aujourd\'hui' :
                           daysRemaining === 1 ? 'Demain' :
                           `${daysRemaining} jours`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {assignment.status === 'graded' && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{assignment.grade}</p>
                      <p className="text-xs text-gray-500">/{assignment.points}</p>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{selectedAssignment.title}</h2>
                    {getStatusBadge(selectedAssignment.status)}
                  </div>
                  <p className="text-gray-500">{selectedAssignment.course} • {selectedAssignment.teacher}</p>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Date limite</p>
                  <p className="font-medium text-gray-800">{selectedAssignment.dueDate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Points</p>
                  <p className="font-medium text-gray-800">{selectedAssignment.points} points</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Instructions</h4>
                <p className="text-gray-600">{selectedAssignment.description}</p>
              </div>

              {/* Attachments */}
              {selectedAssignment.attachments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Fichiers joints</h4>
                  <div className="space-y-2">
                    {selectedAssignment.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-700">{file}</span>
                        </div>
                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grade & Feedback */}
              {selectedAssignment.status === 'graded' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-green-800">Note obtenue</h4>
                    <span className="text-2xl font-bold text-green-600">
                      {selectedAssignment.grade}/{selectedAssignment.points}
                    </span>
                  </div>
                  <p className="text-sm text-green-700">{selectedAssignment.feedback}</p>
                </div>
              )}

              {/* Submit Section */}
              {selectedAssignment.status === 'pending' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Déposer votre fichier ici</p>
                  <p className="text-xs text-gray-400 mb-4">ou</p>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Sélectionner un fichier
                  </button>
                </div>
              )}

              {selectedAssignment.status === 'submitted' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Devoir soumis</p>
                      <p className="text-sm text-blue-600">
                        {selectedAssignment.submittedFile} • {selectedAssignment.submittedDate}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentsPage;
