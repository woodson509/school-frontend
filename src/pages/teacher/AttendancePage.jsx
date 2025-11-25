/**
 * Teacher Attendance Page
 * Mark and track student attendance
 */

import { useState } from 'react';
import { Calendar, Check, X, Clock, Users, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const TeacherAttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('6ème A');
  
  const [students, setStudents] = useState([
    { id: 1, name: 'Jean Pierre', status: 'present' },
    { id: 2, name: 'Marie Claire', status: 'present' },
    { id: 3, name: 'Paul Martin', status: 'absent' },
    { id: 4, name: 'Sophie Durand', status: 'late' },
    { id: 5, name: 'Luc Bernard', status: 'present' },
    { id: 6, name: 'Anne Petit', status: 'present' },
    { id: 7, name: 'Marc Robert', status: 'excused' },
    { id: 8, name: 'Julie Simon', status: 'present' },
  ]);

  const classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème C'];
  
  const statusOptions = [
    { value: 'present', label: 'Présent', color: 'bg-green-500', icon: Check },
    { value: 'absent', label: 'Absent', color: 'bg-red-500', icon: X },
    { value: 'late', label: 'Retard', color: 'bg-orange-500', icon: Clock },
    { value: 'excused', label: 'Excusé', color: 'bg-blue-500', icon: Check },
  ];

  const updateStatus = (studentId, status) => {
    setStudents(students.map(s => s.id === studentId ? {...s, status} : s));
  };

  const markAllPresent = () => {
    setStudents(students.map(s => ({...s, status: 'present'})));
  };

  const stats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    excused: students.filter(s => s.status === 'excused').length,
  };

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
                <option key={cls} value={cls}>{cls}</option>
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
                      {student.name.split(' ').map(n => n[0]).join('')}
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
                        className={`p-2 rounded-lg transition-colors ${
                          student.status === opt.value
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
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 bg-white border text-gray-700 rounded-lg hover:bg-gray-50">
          Annuler
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default TeacherAttendancePage;
