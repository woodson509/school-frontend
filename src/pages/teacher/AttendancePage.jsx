/**
 * Teacher Attendance Page
 * Mark and track student attendance
 */

import { useState, useEffect } from 'react';
import { Calendar, Check, X, Clock, Users, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { attendanceAPI, classAPI, userAPI } from '../../services/api';

const TeacherAttendancePage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({});

  const statusOptions = [
    { value: 'present', label: 'Présent', color: 'bg-green-500', icon: Check },
    { value: 'absent', label: 'Absent', color: 'bg-red-500', icon: X },
    { value: 'late', label: 'Retard', color: 'bg-orange-500', icon: Clock },
    { value: 'excused', label: 'Excusé', color: 'bg-blue-500', icon: Check },
  ];

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classAPI.getAll();
        if (res.success && res.data.length > 0) {
          setClasses(res.data);
          setSelectedClass(res.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    if (user) fetchClasses();
  }, [user]);

  // Fetch students and attendance when class or date changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedClass) return;

      try {
        setLoading(true);

        // Fetch students for this class
        const studentsRes = await userAPI.getAll({ role: 'student', class_id: selectedClass });

        // Fetch existing attendance records
        const attendanceRes = await attendanceAPI.get(selectedClass, selectedDate);

        if (studentsRes.success) {
          const studentList = studentsRes.data.map(s => ({
            id: s.id,
            name: s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || s.email,
            status: 'present' // Default status
          }));

          // Apply existing attendance records if any
          if (attendanceRes.success && attendanceRes.data) {
            const records = Array.isArray(attendanceRes.data) ? attendanceRes.data : [];
            records.forEach(record => {
              const student = studentList.find(s => s.id === record.student_id);
              if (student) {
                student.status = record.status || 'present';
              }
            });
          }

          setStudents(studentList);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedClass, selectedDate]);

  const updateStatus = (studentId, status) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const markAllPresent = () => {
    setStudents(students.map(s => ({ ...s, status: 'present' })));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const attendanceData = {
        class_id: selectedClass,
        date: selectedDate,
        records: students.map(s => ({
          student_id: s.id,
          status: s.status
        }))
      };

      await attendanceAPI.save(attendanceData);
      alert('Présences enregistrées avec succès !');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    excused: students.filter(s => s.status === 'excused').length,
  };

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des présences</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={markAllPresent}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
            >
              Tous présents
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusOptions.map(opt => (
          <div key={opt.value} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${opt.color} bg-opacity-10 flex items-center justify-center`}>
                <opt.icon className={`w-5 h-5 ${opt.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats[opt.value]}</p>
                <p className="text-xs text-gray-500">{opt.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun étudiant trouvé pour cette classe
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <span className="font-medium text-gray-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      {statusOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => updateStatus(student.id, opt.value)}
                          className={`p-2 rounded-lg transition-colors ${student.status === opt.value
                              ? `${opt.color} text-white`
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          title={opt.label}
                        >
                          <opt.icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      placeholder="Ajouter une note..."
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 bg-white border text-gray-700 rounded-lg hover:bg-gray-50">
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={saving || students.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

export default TeacherAttendancePage;
