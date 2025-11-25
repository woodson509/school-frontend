/**
 * Teacher Exams Page
 * Create and manage exams
 */

import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Plus,
  Calendar,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Play,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';

const TeacherExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleExams = [
      { id: 1, title: 'Contrôle Chapitre 6 - Intégrales', class: '6ème A', type: 'written', date: '2024-12-18', time: '08:00', duration: 120, room: 'Salle 101', status: 'scheduled', students: 32, maxPoints: 20 },
      { id: 2, title: 'TP Physique - Optique', class: '5ème B', type: 'practical', date: '2024-12-19', time: '10:00', duration: 90, room: 'Labo', status: 'scheduled', students: 28, maxPoints: 20 },
      { id: 3, title: 'DS Trimestriel', class: '4ème A', type: 'written', date: '2024-12-20', time: '08:00', duration: 180, room: 'Salle 201', status: 'scheduled', students: 30, maxPoints: 40 },
      { id: 4, title: 'Quiz en ligne - Algèbre', class: '6ème A', type: 'online', date: '2024-12-21', time: '14:00', duration: 45, room: 'En ligne', status: 'draft', students: 32, maxPoints: 20 },
      { id: 5, title: 'Contrôle Chapitre 5', class: '6ème A', type: 'written', date: '2024-12-10', time: '08:00', duration: 60, room: 'Salle 101', status: 'completed', students: 32, graded: 32, maxPoints: 20, average: 14.5 },
      { id: 6, title: 'Interrogation orale', class: '3ème C', type: 'oral', date: '2024-12-12', time: '10:00', duration: 5, room: 'Salle 102', status: 'completed', students: 34, graded: 34, maxPoints: 20, average: 13.2 },
    ];

    setTimeout(() => {
      setExams(sampleExams);
      setLoading(false);
    }, 500);
  }, []);

  const filteredExams = exams.filter(e =>
    filter === 'all' || e.status === filter
  );

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-700',
      draft: 'bg-gray-100 text-gray-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-purple-100 text-purple-700',
    };
    const labels = { scheduled: 'Programmé', draft: 'Brouillon', ongoing: 'En cours', completed: 'Terminé' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      written: 'bg-indigo-100 text-indigo-700',
      practical: 'bg-orange-100 text-orange-700',
      online: 'bg-green-100 text-green-700',
      oral: 'bg-pink-100 text-pink-700',
    };
    const labels = { written: 'Écrit', practical: 'TP', online: 'En ligne', oral: 'Oral' };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const upcomingExams = exams.filter(e => e.status === 'scheduled').length;
  const completedExams = exams.filter(e => e.status === 'completed').length;

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
          <h1 className="text-2xl font-bold text-gray-800">Examens</h1>
          <p className="text-gray-500">{exams.length} examens créés</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Nouvel examen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{upcomingExams}</p>
              <p className="text-xs text-gray-500">À venir</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{completedExams}</p>
              <p className="text-xs text-gray-500">Terminés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {exams.filter(e => e.status === 'draft').length}
              </p>
              <p className="text-xs text-gray-500">Brouillons</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {exams.reduce((sum, e) => sum + e.students, 0)}
              </p>
              <p className="text-xs text-gray-500">Élèves concernés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'scheduled', 'draft', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Tous' : f === 'scheduled' ? 'Programmés' : f === 'draft' ? 'Brouillons' : 'Terminés'}
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{exam.class}</span>
                    {getTypeBadge(exam.type)}
                  </div>
                </div>
                {getStatusBadge(exam.status)}
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {exam.date} à {exam.time}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {exam.duration} minutes
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  {exam.students} élèves
                </div>
              </div>

              {exam.status === 'completed' && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-700">Moyenne</span>
                    <span className="font-bold text-purple-700">{exam.average}/20</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-purple-700">Corrigés</span>
                    <span className="font-medium text-purple-700">{exam.graded}/{exam.students}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Eye className="w-4 h-4" />
                  Voir
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                {exam.type === 'online' && exam.status === 'scheduled' && (
                  <button className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                    <Play className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Nouvel examen</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  placeholder="Ex: Contrôle Chapitre 7"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option>6ème A</option>
                    <option>5ème B</option>
                    <option>4ème A</option>
                    <option>3ème C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option value="written">Écrit</option>
                    <option value="practical">TP</option>
                    <option value="online">En ligne</option>
                    <option value="oral">Oral</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
                  <input
                    type="number"
                    defaultValue={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                  <input
                    type="text"
                    placeholder="Ex: Salle 101"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points max</label>
                  <input
                    type="number"
                    defaultValue={20}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Brouillon
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

export default TeacherExamsPage;
