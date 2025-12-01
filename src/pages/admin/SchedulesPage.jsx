/**
 * Schedules Management Page
 * Manage class timetables and schedules
 */

import { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Copy,
} from 'lucide-react';
import { scheduleAPI, classAPI, userAPI } from '../../services/api';

const SchedulesPage = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('week');
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = [
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 10:30', // Pause
    '10:30 - 11:30',
    '11:30 - 12:30',
    '12:30 - 14:00', // Déjeuner
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSchedules();
    }
  }, [selectedClass]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [classesRes, teachersRes] = await Promise.all([
        classAPI.getAll(),
        userAPI.getAll(),
      ]);

      if (classesRes.success) {
        setClasses(classesRes.data);
        if (classesRes.data.length > 0) {
          setSelectedClass(classesRes.data[0].id);
        }
      }
      if (teachersRes.success) {
        setTeachers(teachersRes.data.filter(u => u.role === 'teacher'));
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await scheduleAPI.getAll(selectedClass);
      if (response.success) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  // Organize schedules by day and time slot
  const getScheduleByDayAndSlot = (day, slot) => {
    if (isBreak(slot)) return null;

    const [startTime, endTime] = slot.split(' - ');
    return schedules.find(s =>
      s.day_of_week === day &&
      s.start_time === startTime + ':00' &&
      s.end_time === endTime + ':00'
    );
  };

  const isBreak = (slot) => slot === '10:00 - 10:30' || slot === '12:30 - 14:00';

  const handleSlotClick = (day, slot, schedule = null) => {
    if (!isBreak(slot)) {
      setSelectedSlot({ day, slot });
      setEditingSchedule(schedule);
      setShowModal(true);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingSchedule) {
        await scheduleAPI.update(editingSchedule.id, data);
      } else {
        await scheduleAPI.create(data);
      }
      fetchSchedules();
      setShowModal(false);
      setSelectedSlot(null);
      setEditingSchedule(null);
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        await scheduleAPI.delete(id);
        fetchSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const headers = ['Jour', 'Heure début', 'Heure fin', 'Matière', 'Professeur', 'Salle'];
    const csvContent = [
      headers.join(','),
      ...schedules.map(s => [
        s.day_of_week,
        s.start_time,
        s.end_time,
        `"${s.subject_name}"`,
        `"${s.teacher_name}"`,
        `"${s.room}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `emploi_du_temps_${selectedClassName}.csv`;
    link.click();
  };

  const [currentDay, setCurrentDay] = useState(days[0]);
  const displayedDays = view === 'week' ? days : [currentDay];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'week' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'day' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                }`}
            >
              Jour
            </button>
          </div>
          {view === 'day' && (
            <select
              value={currentDay}
              onChange={(e) => setCurrentDay(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Copy className="w-4 h-4" />
            Dupliquer
          </button>
          <button
            onClick={() => { setSelectedSlot(null); setEditingSchedule(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter cours
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden print:shadow-none">
        <div className="p-4 border-b border-gray-200 bg-gray-50 print:bg-white print:border-none">
          <h3 className="font-semibold text-gray-800">Emploi du temps - {selectedClassName}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] print:min-w-0">
            <thead>
              <tr className="bg-gray-50 print:bg-white">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-28 border print:border-gray-300">
                  Horaire
                </th>
                {displayedDays.map(day => (
                  <th key={day} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase border print:border-gray-300">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot} className={isBreak(slot) ? 'bg-gray-100 print:bg-gray-100' : ''}>
                  <td className="px-4 py-2 text-sm text-gray-600 font-medium border-r border-gray-200 border print:border-gray-300">
                    {slot}
                  </td>
                  {displayedDays.map(day => {
                    const schedule = getScheduleByDayAndSlot(day, slot);
                    const isBreakSlot = isBreak(slot);

                    return (
                      <td
                        key={`${day}-${slot}`}
                        onClick={() => handleSlotClick(day, slot, schedule)}
                        className={`px-2 py-1 border border-gray-100 print:border-gray-300 ${isBreakSlot ? '' : 'cursor-pointer hover:bg-gray-50'
                          }`}
                      >
                        {isBreakSlot ? (
                          <div className="text-center text-xs text-gray-400 italic">
                            {slot === '10:00 - 10:30' ? 'Pause' : 'Déjeuner'}
                          </div>
                        ) : schedule ? (
                          <div
                            className="p-2 rounded-lg text-white text-xs relative group print:text-black print:border print:border-gray-300"
                            style={{ backgroundColor: schedule.color || '#3B82F6' }}
                          >
                            <p className="font-semibold">{schedule.subject_name}</p>
                            <p className="opacity-90">{schedule.teacher_name}</p>
                            <p className="opacity-75">{schedule.room}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(schedule.id);
                              }}
                              className="absolute top-1 right-1 p-1 bg-white/20 rounded hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center print:hidden">
                            <Plus className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ScheduleModal
          slot={selectedSlot}
          schedule={editingSchedule}
          classId={selectedClass}
          teachers={teachers}
          onClose={() => {
            setShowModal(false);
            setSelectedSlot(null);
            setEditingSchedule(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const ScheduleModal = ({ slot, schedule, classId, subjects, teachers, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    class_id: classId,
    subject_id: schedule?.subject_id || '',
    subject_name: schedule?.subject_name || '',
    teacher_id: schedule?.teacher_id || '',
    day_of_week: slot?.day || schedule?.day_of_week || 'Lundi',
    start_time: schedule?.start_time?.substring(0, 5) || '',
    end_time: schedule?.end_time?.substring(0, 5) || '',
    room: schedule?.room || '',
    color: schedule?.color || '#3B82F6',
    notes: schedule?.notes || '',
  });

  // If slot is provided, parse the time
  useEffect(() => {
    if (slot && !schedule) {
      const [startTime, endTime] = slot.slot.split(' - ');
      setFormData(prev => ({
        ...prev,
        start_time: startTime,
        end_time: endTime,
      }));
    }
  }, [slot, schedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {schedule ? 'Modifier le cours' : slot ? `Ajouter cours - ${slot.day} ${slot.slot}` : 'Nouveau cours'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
            <input
              type="text"
              value={formData.subject_name}
              onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ex: Mathématiques, Français..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
            <select
              value={formData.teacher_id}
              onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un professeur</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
            <select
              value={formData.day_of_week}
              onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Lundi">Lundi</option>
              <option value="Mardi">Mardi</option>
              <option value="Mercredi">Mercredi</option>
              <option value="Jeudi">Jeudi</option>
              <option value="Vendredi">Vendredi</option>
              <option value="Samedi">Samedi</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure début</label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin</label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ex: A101"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Notes additionnelles..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {schedule ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulesPage;
