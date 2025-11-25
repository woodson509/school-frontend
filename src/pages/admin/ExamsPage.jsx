/**
 * Exams Management Page
 * Create and manage exams for courses
 */

import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  BarChart,
  Copy,
  Play,
} from 'lucide-react';

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const sampleExams = [
      { id: 1, title: 'Mathématiques - Examen Final', course: 'MATH-101', date: '2024-12-20', duration: 120, totalMarks: 100, passingMarks: 60, status: 'published', attempts: 45, avgScore: 72 },
      { id: 2, title: 'Physique - Midterm', course: 'PHY-201', date: '2024-12-18', duration: 90, totalMarks: 80, passingMarks: 48, status: 'published', attempts: 38, avgScore: 65 },
      { id: 3, title: 'Informatique - Quiz 3', course: 'CS-101', date: '2024-12-16', duration: 30, totalMarks: 20, passingMarks: 12, status: 'draft', attempts: 0, avgScore: 0 },
      { id: 4, title: 'Français - Dissertation', course: 'FR-101', date: '2024-12-22', duration: 180, totalMarks: 100, passingMarks: 50, status: 'published', attempts: 52, avgScore: 68 },
      { id: 5, title: 'Anglais - Oral', course: 'EN-101', date: '2024-12-15', duration: 15, totalMarks: 50, passingMarks: 25, status: 'completed', attempts: 40, avgScore: 78 },
      { id: 6, title: 'Histoire - QCM', course: 'HIST-101', date: '2024-12-19', duration: 45, totalMarks: 40, passingMarks: 24, status: 'published', attempts: 28, avgScore: 70 },
    ];
    
    setTimeout(() => {
      setExams(sampleExams);
      setLoading(false);
    }, 500);
  }, []);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      published: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
    };
    const labels = {
      draft: 'Brouillon',
      published: 'Publié',
      completed: 'Terminé',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un examen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="completed">Terminé</option>
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvel examen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{exams.length}</p>
              <p className="text-sm text-gray-500">Total examens</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {exams.filter(e => e.status === 'published').length}
              </p>
              <p className="text-sm text-gray-500">Publiés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {exams.reduce((acc, e) => acc + e.attempts, 0)}
              </p>
              <p className="text-sm text-gray-500">Tentatives</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <BarChart className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(exams.reduce((acc, e) => acc + e.avgScore, 0) / exams.filter(e => e.avgScore > 0).length || 0)}%
              </p>
              <p className="text-sm text-gray-500">Score moyen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Examen</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Cours</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Durée</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tentatives</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredExams.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-800">{exam.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.course}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {exam.date}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {exam.duration} min
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {exam.passingMarks}/{exam.totalMarks}
                </td>
                <td className="px-6 py-4">{getStatusBadge(exam.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{exam.attempts}</span>
                    {exam.avgScore > 0 && (
                      <span className="text-xs text-gray-400">({exam.avgScore}% moy.)</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Résultats">
                      <BarChart className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Dupliquer">
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Modifier">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Supprimer">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamsPage;
