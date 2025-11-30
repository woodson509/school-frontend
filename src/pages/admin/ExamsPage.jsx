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
import { examAPI, courseAPI } from '../../services/api';

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const [examsRes, coursesRes] = await Promise.all([
        examAPI.getAll(),
        courseAPI.getAll()
      ]);

      if (examsRes.success) {
        // Map API data to frontend format
        const mappedExams = examsRes.data.map(exam => ({
          ...exam,
          course: exam.course_code || exam.course_title,
          date: exam.exam_date ? new Date(exam.exam_date).toISOString().split('T')[0] : 'Non défini',
          duration: exam.duration_minutes,
          totalMarks: exam.total_marks,
          passingMarks: exam.passing_marks,
          status: exam.is_published ? 'published' : 'draft',
          attempts: 0, // TODO: Fetch real count
          avgScore: 0 // TODO: Fetch real average
        }));
        setExams(mappedExams);
      }

      if (coursesRes.success) {
        setCourses(coursesRes.data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.course && exam.course.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
      try {
        await examAPI.delete(id);
        setExams(exams.filter(e => e.id !== id));
      } catch (error) {
        console.error('Error deleting exam:', error);
        alert('Erreur lors de la suppression de l\'examen');
      }
    }
  };

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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status] || labels.draft}
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
                {exams.reduce((acc, e) => acc + (e.attempts || 0), 0)}
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
                {Math.round(exams.reduce((acc, e) => acc + (e.avgScore || 0), 0) / (exams.filter(e => e.avgScore > 0).length || 1))}%
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
                    <span className="text-sm text-gray-600">{exam.attempts || 0}</span>
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
                    <button
                      onClick={() => { setEditingExam(exam); setShowModal(true); }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <ExamModal
          exam={editingExam}
          courses={courses}
          onClose={() => { setShowModal(false); setEditingExam(null); }}
          onSave={async (data) => {
            try {
              if (editingExam) {
                await examAPI.update(editingExam.id, {
                  ...data,
                  duration_minutes: data.duration,
                  total_marks: data.totalMarks,
                  passing_marks: data.passingMarks,
                  exam_date: data.date,
                  is_published: data.status === 'published'
                });
              } else {
                await examAPI.create({
                  ...data,
                  duration_minutes: data.duration,
                  total_marks: data.totalMarks,
                  passing_marks: data.passingMarks,
                  exam_date: data.date,
                  is_published: data.status === 'published'
                });
              }
              fetchExams();
              setShowModal(false);
              setEditingExam(null);
            } catch (error) {
              console.error('Error saving exam:', error);
              alert('Erreur lors de l\'enregistrement de l\'examen');
            }
          }}
        />
      )}
    </div>
  );
};

const ExamModal = ({ exam, courses, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: exam?.title || '',
    course_id: exam?.course_id || '',
    date: exam?.date || '',
    duration: exam?.duration || 60,
    totalMarks: exam?.totalMarks || 100,
    passingMarks: exam?.passingMarks || 50,
    status: exam?.status || 'draft',
    description: exam?.description || '',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {exam ? 'Modifier l\'examen' : 'Nouvel examen'}
        </h3>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cours</label>
            <select
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un cours</option>
              {courses?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note totale</label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note de passage</label>
              <input
                type="number"
                value={formData.passingMarks}
                onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="completed">Terminé</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {exam ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamsPage;
