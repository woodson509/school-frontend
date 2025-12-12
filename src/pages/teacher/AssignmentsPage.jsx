/**
 * Teacher Assignments Page
 * Create and manage assignments
 */

import { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  Calendar,
  Clock,
  Users,
  Edit,
  Trash2,
  Eye,
  Copy,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { assignmentAPI, courseAPI } from '../../services/api';

const TeacherAssignmentsPage = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course_id: '',
    description: '',
    due_date: '',
    due_time: '23:59',
    points: 20,
    is_published: false
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, coursesRes] = await Promise.all([
        assignmentAPI.getAll(),
        courseAPI.getAll({ teacher_id: user?.id })
      ]);

      if (assignmentsRes.success) {
        setAssignments(assignmentsRes.data.map(a => ({
          ...a,
          dueDate: new Date(a.due_date).toLocaleDateString('fr-FR'),
          class: a.class_name || a.course_code || 'N/A', // Display class name if available, else course code
          submitted: 0, // TODO: Fetch submissions count
          total: 0 // TODO: Fetch total students
        })));
      }

      if (coursesRes.success) {
        setCourses(coursesRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const filteredAssignments = assignments.filter(a =>
    filter === 'all' || a.status === filter
  );

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      draft: 'bg-gray-100 text-gray-700',
      grading: 'bg-orange-100 text-orange-700',
      completed: 'bg-blue-100 text-blue-700',
    };
    const labels = { active: 'Actif', draft: 'Brouillon', grading: 'Correction', completed: 'Terminé' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleCreate = async () => {
    try {
      if (!newAssignment.course_id) {
        alert('Veuillez sélectionner un cours');
        return;
      }

      await assignmentAPI.create({
        course_id: newAssignment.course_id,
        title: newAssignment.title,
        description: newAssignment.description,
        points: newAssignment.points,
        due_date: `${newAssignment.due_date}T${newAssignment.due_time}:00`,
        is_published: true // Default to published for now
      });

      alert('Devoir créé avec succès !');
      setShowModal(false);
      setNewAssignment({
        title: '',
        course_id: '',
        description: '',
        due_date: '',
        due_time: '23:59',
        points: 20,
        is_published: false
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Erreur lors de la création du devoir');
    }
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
          <h1 className="text-2xl font-bold text-gray-800">Devoirs (Live)</h1>
          <p className="text-gray-500">{assignments.length} devoirs créés</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau devoir
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {assignments.filter(a => a.status === 'active').length}
              </p>
              <p className="text-xs text-gray-500">Actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {assignments.filter(a => a.status === 'grading').length}
              </p>
              <p className="text-xs text-gray-500">À corriger</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {assignments.filter(a => a.status === 'draft').length}
              </p>
              <p className="text-xs text-gray-500">Brouillons</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {assignments.reduce((sum, a) => sum + a.submitted, 0)}
              </p>
              <p className="text-xs text-gray-500">Soumissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'active', 'grading', 'draft', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : f === 'grading' ? 'Correction' : f === 'draft' ? 'Brouillons' : 'Terminés'}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Devoir</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Échéance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Soumissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAssignments.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-800">{assignment.title}</p>
                    <p className="text-sm text-gray-500">{assignment.points} points</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm">
                    {assignment.class}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {assignment.dueDate}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {assignment.submitted}/{assignment.total}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(assignment.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Nouveau devoir</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="Ex: Exercices Chapitre 5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cours</label>
                  <select
                    value={newAssignment.course_id}
                    onChange={(e) => setNewAssignment({ ...newAssignment, course_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Sélectionner un cours...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.class_name || course.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                  <input
                    type="number"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment({ ...newAssignment, points: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date limite</label>
                  <input
                    type="date"
                    value={newAssignment.due_date}
                    onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure limite</label>
                  <input
                    type="time"
                    value={newAssignment.due_time}
                    onChange={(e) => setNewAssignment({ ...newAssignment, due_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Décrivez le devoir..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fichiers joints</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Glissez des fichiers ici ou cliquez pour télécharger</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Enregistrer brouillon
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Publier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignmentsPage;
