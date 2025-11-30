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
  Save,
} from 'lucide-react';
import { classAPI, attendanceAPI } from '../../services/api';

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId && selectedDate) {
      fetchAttendance();
    }
  }, [selectedClassId, selectedDate]);

  const fetchClasses = async () => {
    try {
      const response = await classAPI.getAll();
      if (response.success && response.data.length > 0) {
        setClasses(response.data);
        setSelectedClassId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.get(selectedClassId, selectedDate);
      if (response.success) {
        // Transform data for UI
        const mappedData = response.data.map(record => ({
          id: record.attendance_id || `temp-${record.student_id}`, // Use attendance_id if exists, else temp
          student_id: record.student_id,
          student: record.student_name,
          status: record.status || 'present', // Default to present
          notes: record.notes || '',
          arrivalTime: record.arrival_time || '',
          avatar: record.profile_picture_url
        }));
        setAttendance(mappedData);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (studentId, newStatus) => {
    setAttendance(attendance.map(a =>
      a.student_id === studentId ? { ...a, status: newStatus } : a
    ));
  };

  const updateNotes = (studentId, newNotes) => {
    setAttendance(attendance.map(a =>
      a.student_id === studentId ? { ...a, notes: newNotes } : a
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const records = attendance.map(a => ({
        student_id: a.student_id,
        status: a.status,
        notes: a.notes
      }));

      const response = await attendanceAPI.save({
        class_id: selectedClassId,
        date: selectedDate,
        records
      });

      if (response.success) {
        alert('Présences enregistrées avec succès');
        fetchAttendance(); // Refresh to get real IDs
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.present}`}>
        {labels[status] || labels.present}
      </span>
    );
  };

  const stats = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    excused: attendance.filter(a => a.status === 'excused').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
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
            {classes.find(c => c.id === selectedClassId)?.name || 'Classe'} - {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : attendance.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Aucun étudiant trouvé dans cette classe.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Étudiant</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions rapides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendance.map((record) => (
                <tr key={record.student_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {record.avatar ? (
                          <img src={record.avatar} alt={record.student} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-medium text-gray-600">{record.student.charAt(0)}</span>
                        )}
                      </div>
                      <span className="font-medium text-gray-800">{record.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={record.notes}
                      onChange={(e) => updateNotes(record.student_id, e.target.value)}
                      placeholder="Ajouter une note..."
                      className="w-full px-3 py-1 border border-transparent hover:border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => updateStatus(record.student_id, 'present')}
                        className={`p-2 rounded-lg transition-colors ${record.status === 'present' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400'}`}
                        title="Présent"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateStatus(record.student_id, 'absent')}
                        className={`p-2 rounded-lg transition-colors ${record.status === 'absent' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-400'}`}
                        title="Absent"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateStatus(record.student_id, 'late')}
                        className={`p-2 rounded-lg transition-colors ${record.status === 'late' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-400'}`}
                        title="Retard"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateStatus(record.student_id, 'excused')}
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
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
