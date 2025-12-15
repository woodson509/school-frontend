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
  X
} from 'lucide-react';
import { examAPI, courseAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TeacherExamsPage = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    type: 'written',
    date: '',
    time: '',
    duration: 60,
    maxPoints: 20,
    passing_marks: 10,
    room: ''
  });

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, [user]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await examAPI.getAll();
      setExams(data.data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await courseAPI.getAll();
      // Filter if necessary, but backend usually handles it for teachers
      setCourses(data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format payload
      const payload = {
        course_id: formData.course_id,
        title: formData.title,
        description: formData.description,
        duration_minutes: parseInt(formData.duration),
        total_marks: parseFloat(formData.maxPoints),
        passing_marks: parseFloat(formData.passing_marks),
        exam_date: formData.date ? `${formData.date} ${formData.time || '00:00'}` : null,
        // type: formData.type // backend doesn't support 'type' field yet in schema? checking controller...
        // controller has 'is_published', but 'type' (written/oral) not in createExam inputs shown in view_file 5871
        // ignoring 'type' for now as it maps to nothing in backend, or adding it if schema allows (it wasn't in INSERT)
      };

      await examAPI.create(payload);
      setShowModal(false);
      fetchExams();
      setFormData({
        course_id: '',
        title: '',
        description: '',
        type: 'written',
        date: '',
        time: '',
        duration: 60,
        maxPoints: 20,
        passing_marks: 10,
        room: ''
      });
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Erreur lors de la création de l\'examen');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
      try {
        await examAPI.delete(id);
        fetchExams();
      } catch (error) {
        console.error('Error deleting exam:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const filteredExams = exams.filter(e =>
    filter === 'all' ||
    (filter === 'scheduled' && !e.completed_at && new Date(e.exam_date) > new Date()) ||
    (filter === 'completed' && (e.completed_at || new Date(e.exam_date) < new Date()))
    // Status logic is complex without explicit status field, approximating
  );

  const getStatusBadge = (exam) => {
    const isCompleted = new Date(exam.exam_date) < new Date();
    const status = isCompleted ? 'completed' : 'scheduled';

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

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'scheduled', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {f === 'all' ? 'Tous' : f === 'scheduled' ? 'Programmés' : 'Terminés'}
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      {exams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun examen créé</h3>
          <p className="text-gray-500 mt-2">Commencez par créer un nouvel examen pour vos élèves.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{exam.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{exam.course_title}</span>
                      {/* Class name from backend join */}
                      {exam.class_name && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{exam.class_name}</span>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(exam)}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(exam.exam_date).toLocaleDateString()} {new Date(exam.exam_date).toLocaleTimeString([], { hour: '2bit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {exam.duration_minutes} minutes
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    {exam.total_marks} points max
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                    Détails
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Nouvel examen</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'examen *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Contrôle Chapitre 7"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cours / Matière *</label>
                    <select
                      name="course_id"
                      required
                      value={formData.course_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Sélectionner un cours</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.title} {course.code ? `(${course.code})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type (Info seulement)</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="written">Écrit</option>
                      <option value="practical">TP</option>
                      <option value="online">En ligne</option>
                      <option value="oral">Oral</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min) *</label>
                    <input
                      type="number"
                      name="duration"
                      required
                      min="1"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total des points *</label>
                    <input
                      type="number"
                      name="maxPoints"
                      required
                      min="1"
                      value={formData.maxPoints}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note de passage</label>
                    <input
                      type="number"
                      name="passing_marks"
                      min="0"
                      value={formData.passing_marks}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Créer l'examen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExamsPage;
