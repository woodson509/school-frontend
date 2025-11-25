/**
 * Attendance Management Page
 * Track student attendance
 */

import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Calendar,
  UserCheck,
  UserX,
  Clock,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('6ème A');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B'];

  useEffect(() => {
    const sampleAttendance = [
      { id: 1, student: 'Jean Pierre', status: 'present', arrivalTime: '07:55', notes: '' },
      { id: 2, student: 'Marie Claire', status: 'present', arrivalTime: '07:50', notes: '' },
      { id: 3, student: 'Paul Martin', status: 'absent', arrivalTime: null, notes: 'Maladie' },
      { id: 4, student: 'Sophie Durand', status: 'late', arrivalTime: '08:15', notes: 'Retard transport' },
      { id: 5, student: 'Louis Bernard', status: 'present', arrivalTime: '07:45', notes: '' },
      { id: 6, student: 'Emma Petit', status: 'present', arrivalTime: '07:58', notes: '' },
      { id: 7, student: 'Lucas Robert', status: 'excused', arrivalTime: null, notes: 'Rendez-vous médical' },
      { id: 8, student: 'Chloé Moreau', status: 'present', arrivalTime: '07:52', notes: '' },
    ];
    
    setTimeout(() => {
      setAttendance(sampleAttendance);
      setLoading(false);
    }, 500);
  }, [selectedDate, selectedClass]);

  const updateStatus = (id, newStatus) => {
    setAttendance(attendance.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    ));
  };

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700',
      late: 'bg-orange-100 text-orange-700',
      excused: 'bg-blue-100 text-blue-700',
    };
    const labels = {
      present: 'Présent',
      absent: 'Absent',
      late: 'Retard',
      excused: 'Excusé',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const stats = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    excused: attendance.filter(a => a.status === 'excused').length,
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
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Check className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.present}</p>
              <p className="text-sm text-gray-500">Présents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <UserX className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.absent}</p>
              <p className="text-sm text-gray-500">Absents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.late}</p>
              <p className="text-sm text-gray-500">Retards</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.excused}</p>
              <p className="text-sm text-gray-500">Excusés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">
            {selectedClass} - {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Étudiant</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Heure d'arrivée</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions rapides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="font-medium text-gray-600">{record.student.charAt(0)}</span>
                    </div>
                    <span className="font-medium text-gray-800">{record.student}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(record.status)}
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  {record.arrivalTime || '-'}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    defaultValue={record.notes}
                    placeholder="Ajouter une note..."
                    className="w-full px-3 py-1 border border-transparent hover:border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => updateStatus(record.id, 'present')}
                      className={`p-2 rounded-lg transition-colors ${record.status === 'present' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400'}`}
                      title="Présent"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(record.id, 'absent')}
                      className={`p-2 rounded-lg transition-colors ${record.status === 'absent' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-400'}`}
                      title="Absent"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(record.id, 'late')}
                      className={`p-2 rounded-lg transition-colors ${record.status === 'late' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-400'}`}
                      title="Retard"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(record.id, 'excused')}
                      className={`p-2 rounded-lg transition-colors ${record.status === 'excused' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-400'}`}
                      title="Excusé"
                    >
                      <AlertCircle className="w-4 h-4" />
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

export default AttendancePage;
