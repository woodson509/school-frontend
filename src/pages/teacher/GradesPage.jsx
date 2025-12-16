import { useState, useEffect } from 'react';
import { Save, Download, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { classAPI, examAPI, userAPI, settingsAPI, gradesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TeacherGradesPage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');

  const [reportPeriods, setReportPeriods] = useState([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState('');

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Initial Data Fetch (Classes & Periods)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classesRes, periodsRes] = await Promise.all([
          classAPI.getAll({ teacher_id: user.id }),
          settingsAPI.getReportPeriods({ is_active: true })
        ]);

        setClasses(classesRes.data || []);
        if (classesRes.data?.length > 0) {
          setSelectedClassId(classesRes.data[0].id);
        }

        setReportPeriods(periodsRes.data || []);
        if (periodsRes.data?.length > 0) {
          setSelectedPeriodId(periodsRes.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching initial data", error);
      }
    };
    fetchInitialData();
  }, [user.id]);

  // Fetch Exams when Class Changes
  useEffect(() => {
    if (!selectedClassId) return;

    const fetchExams = async () => {
      try {
        const response = await examAPI.getAll({ class_id: selectedClassId });
        setExams(response.data || []);
        // Automatically select first exam if available, else clear selection
        if (response.data?.length > 0) {
          setSelectedExamId(response.data[0].id);
        } else {
          setSelectedExamId('');
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching exams", error);
      }
    };
    fetchExams();
  }, [selectedClassId]);

  // Fetch Students & Grades when Exam (and Class) is Selected
  useEffect(() => {
    if (!selectedClassId || !selectedExamId || !selectedPeriodId) return;

    const fetchStudentsAndGrades = async () => {
      setLoading(true);
      try {
        // 1. Fetch Students in Class
        // Assuming userAPI.getUsers supports class_id filter and role='student'
        // If not, we might need a specific endpoint like classAPI.getStudents(classId)
        const studentsRes = await userAPI.getAll({
          role: 'student',
          class_id: selectedClassId,
          limit: 100 // Fetch all students
        });

        // 2. Fetch Existing Grades for this Exam
        const gradesRes = await gradesAPI.getGrades({
          exam_id: selectedExamId,
          class_id: selectedClassId
          // We could also filter by report_period_id if needed, but exam_id is unique enough
        });

        const studentList = studentsRes.data || [];
        const existingGrades = gradesRes.data || [];

        // 3. Merge Data
        const mergedData = studentList.map(student => {
          const gradeRecord = existingGrades.find(g => g.student_id === student.id);
          return {
            student_id: student.id,
            name: student.full_name,
            profile_picture: student.profile_picture_url,
            // Grade Data
            grade_id: gradeRecord?.id || null, // If exists, it's an update
            value: gradeRecord?.value || '',
            notes: gradeRecord?.notes || '',
            max_value: gradeRecord?.max_value || 20 // Default or from exam settings?
          };
        });

        // If the selected exam has max marks, use it
        const currentExam = exams.find(e => e.id === selectedExamId);
        if (currentExam) {
          mergedData.forEach(s => {
            if (!s.grade_id) { // Only set max if not already saved (though max shouldn't differ)
              s.max_value = currentExam.total_marks || 20;
            }
          });
        }

        setStudents(mergedData);

      } catch (error) {
        console.error("Error fetching students/grades", error);
        setNotification({ type: 'error', message: 'Erreur lors du chargement des données.' });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndGrades();
  }, [selectedClassId, selectedExamId, selectedPeriodId, exams]);


  const handleGradeChange = (studentId, field, value) => {
    setStudents(prev => prev.map(s =>
      s.student_id === studentId ? { ...s, [field]: value } : s
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setNotification(null);
    try {
      // Prepare payload
      // Only specific valid grades (non-empty)
      const gradesToSave = students
        .filter(s => s.value !== '' && s.value !== null)
        .map(s => ({
          id: s.grade_id, // If present, it updates
          student_id: s.student_id,
          exam_id: selectedExamId,
          class_id: selectedClassId,
          report_period_id: selectedPeriodId,
          grade_type: 'exam',
          value: parseFloat(s.value),
          max_value: parseFloat(s.max_value),
          notes: s.notes,
          subject_id: exams.find(e => e.id === selectedExamId)?.subject_id // We need subject_id
        }));

      if (gradesToSave.length === 0) {
        setNotification({ type: 'warning', message: 'Aucune note à enregistrer.' });
        setSaving(false);
        return;
      }

      // Check for missing subject_id
      if (!gradesToSave[0].subject_id) {
        console.error("Missing subject_id for exam", exams.find(e => e.id === selectedExamId));
        throw new Error("Impossible de trouver la matière associée à cet examen.");
      }

      await gradesAPI.saveBulk({ grades: gradesToSave });

      setNotification({ type: 'success', message: 'Notes enregistrées avec succès !' });

      // Refresh data to get new IDs
      // Simplification: We could just re-fetch everything
      // Or specific re-fetch logic

    } catch (error) {
      console.error("Error saving grades", error);
      setNotification({ type: 'error', message: 'Erreur lors de l\'enregistrement: ' + (error.message || 'Erreur inconnue') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Saisie des notes</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !selectedExamId}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-100 text-green-700' : notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {reportPeriods.map(period => (
                <option key={period.id} value={period.id}>{period.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Évaluation (Examen)</label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={exams.length === 0}
            >
              {exams.length === 0 && <option>Aucun examen trouvé</option>}
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title} ({new Date(exam.exam_date).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement des données...</div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {selectedExamId ? "Aucun élève trouvé dans cette classe." : "Sélectionnez une classe et un examen pour commencer."}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Note / {exams.find(e => e.id === selectedExamId)?.total_marks || 20}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commentaire</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map(student => (
                <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      max={student.max_value}
                      step="0.5"
                      value={student.value}
                      onChange={(e) => handleGradeChange(student.student_id, 'value', e.target.value)}
                      className="w-24 px-3 py-2 text-center border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      placeholder="Ajouter un commentaire..."
                      value={student.notes}
                      onChange={(e) => handleGradeChange(student.student_id, 'notes', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeacherGradesPage;
