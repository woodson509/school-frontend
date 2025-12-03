/**
 * Grades Management Page
 * Allows teachers and admins to enter and manage student grades
 */

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Save,
  Calculator
} from 'lucide-react';
import api from '../../services/api';

const { gradesAPI, classAPI, subjectAPI, settingsAPI, userAPI } = api;

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [gradingScale, setGradingScale] = useState({ max_value: 20 });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedPeriod) {
      fetchGrades();
    }
  }, [selectedClass, selectedSubject, selectedPeriod]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesRes, subjectsRes, periodsRes, scalesRes] = await Promise.all([
        classAPI.getAll(),
        subjectAPI.getAll(),
        settingsAPI.getReportPeriods({ is_active: true }),
        settingsAPI.getGradingScales()
      ]);

      if (classesRes.success) setClasses(classesRes.data);
      if (subjectsRes.success) setSubjects(subjectsRes.data);
      if (periodsRes.success) setPeriods(periodsRes.data);

      // Get active grading scale
      if (scalesRes.success) {
        const activeScale = scalesRes.data.find(s => s.is_default) || scalesRes.data[0];
        setGradingScale(activeScale);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const [gradesRes, studentsRes] = await Promise.all([
        gradesAPI.getGrades({
          class_id: selectedClass,
          subject_id: selectedSubject,
          report_period_id: selectedPeriod
        }),
        userAPI.getAll({ role: 'student', class_id: selectedClass })
      ]);

      if (gradesRes.success) setGrades(gradesRes.data);
      if (studentsRes.success) setStudents(studentsRes.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const handleDeleteGrade = async (id) => {
    if (window.confirm('Supprimer cette note ?')) {
      try {
        await gradesAPI.deleteGrade(id);
        fetchGrades();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  // Group grades by student
  const groupedGrades = students.map(student => {
    const studentGrades = grades.filter(g => g.student_id === student.id);
    const total = studentGrades.reduce((sum, g) => {
      const percentage = (parseFloat(g.value) / parseFloat(g.max_value)) * 100;
      return sum + (percentage * parseFloat(g.weight));
    }, 0);
    const totalWeight = studentGrades.reduce((sum, g) => sum + parseFloat(g.weight), 0);
    const average = totalWeight > 0 ? total / totalWeight : 0;
    const averageOnScale = (average / 100) * parseFloat(gradingScale.max_value);

    return {
      student,
      grades: studentGrades,
      average: averageOnScale.toFixed(2)
    };
  });

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Notes</h1>
        <button
          onClick={() => {
            setSelectedGrade(null);
            setShowGradeModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={!selectedClass || !selectedSubject || !selectedPeriod}
        >
          <Plus className="w-4 h-4" />
          Ajouter une Note
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une matière</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une période</option>
              {periods.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.school_year})</option>
              ))}
            </select>
          </div>
        </div>

        {selectedClass && selectedSubject && selectedPeriod && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <strong>Échelle:</strong> /{gradingScale.max_value}
          </div>
        )}
      </div>

      {/* Grades Table */}
      {selectedClass && selectedSubject && selectedPeriod && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Étudiant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Moyenne</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {groupedGrades.map(({ student, grades: studentGrades, average }) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {student.full_name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">{student.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {studentGrades.length > 0 ? (
                        studentGrades.map(grade => (
                          <span
                            key={grade.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                            title={`${grade.grade_type} - Poids: ${grade.weight}`}
                          >
                            {grade.value}/{grade.max_value}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">Aucune note</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-lg font-bold ${parseFloat(average) >= (gradingScale.max_value * 0.5) ? 'text-green-600' : 'text-red-600'}`}>
                      {average}/{gradingScale.max_value}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedGrade({ student_id: student.id });
                        setShowGradeModal(true);
                      }}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                      title="Ajouter une note"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {groupedGrades.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun étudiant dans cette classe
            </div>
          )}
        </div>
      )}

      {/* Grade Modal */}
      {showGradeModal && (
        <GradeModal
          grade={selectedGrade}
          classId={selectedClass}
          subjectId={selectedSubject}
          periodId={selectedPeriod}
          students={students}
          maxValue={gradingScale.max_value}
          onClose={() => {
            setShowGradeModal(false);
            setSelectedGrade(null);
          }}
          onSuccess={() => {
            setShowGradeModal(false);
            setSelectedGrade(null);
            fetchGrades();
          }}
        />
      )}
    </div>
  );
};

// Grade Modal Component
const GradeModal = ({ grade, classId, subjectId, periodId, students, maxValue, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    student_id: grade?.student_id || '',
    grade_type: 'exam',
    value: '',
    max_value: maxValue,
    weight: 1.0,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await gradesAPI.createGrade({
        ...formData,
        class_id: classId,
        subject_id: subjectId,
        report_period_id: periodId
      });
      onSuccess();
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Ajouter une Note</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Étudiant</label>
            <select
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un étudiant</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.full_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'évaluation</label>
            <select
              value={formData.grade_type}
              onChange={(e) => setFormData({ ...formData, grade_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="exam">Examen</option>
              <option value="quiz">Contrôle</option>
              <option value="homework">Devoir</option>
              <option value="project">Projet</option>
              <option value="participation">Participation</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                max={formData.max_value}
                step="0.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sur</label>
              <input
                type="number"
                value={formData.max_value}
                onChange={(e) => setFormData({ ...formData, max_value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coefficient</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              step="0.1"
              min="0.1"
              max="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarques (Optionnel)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradesPage;
