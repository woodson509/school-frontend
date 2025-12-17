/**
 * Student Schedule Page
 * Weekly timetable view
 */

import { useState, useEffect } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Download,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { scheduleAPI } from '../../services/api';

const StudentSchedulePage = () => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState('week');
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']; // Added Samedi just in case
  const timeSlots = [
    '07:30 - 08:30',
    '08:30 - 09:30',
    '09:30 - 10:00', // Break
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:30', // Lunch
    '13:30 - 14:30',
    '14:30 - 15:30',
    '15:30 - 16:30',
    '16:30 - 17:30',
  ];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const response = await scheduleAPI.getAll({ role: 'student' }); // auto-detected by backend anyway
        const data = response.data || [];

        // Transform flat array to nested object: schedule[Day][TimeSlot]
        const newSchedule = {};

        data.forEach(item => {
          const day = item.day_of_week;
          if (!days.includes(day)) return; // skip invalid days

          // Format times to match slot keys (e.g. 07:30 - 08:30)
          // Assuming DB returns HH:MM:SS or HH:MM
          const start = item.start_time.substring(0, 5);
          const end = item.end_time.substring(0, 5);
          const slotKey = `${start} - ${end}`; // strict match for now

          if (!newSchedule[day]) newSchedule[day] = {};

          newSchedule[day][slotKey] = {
            subject: item.subject_name || 'Cours',
            teacher: item.teacher_name || 'N/A',
            room: item.room || 'N/A',
            color: item.color || '#3B82F6',
            notes: item.notes
          };
        });

        setSchedule(newSchedule);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user]);

  const isBreak = (slot) => slot === '09:30 - 10:00' || slot === '12:00 - 13:30';
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + currentWeek * 7);

    return days.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        day,
        date: date.getDate(),
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mon emploi du temps</h1>
          <p className="text-gray-500">Année scolaire 2024-2025 • Classe 6ème A</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'week' ? 'bg-emerald-600 text-white' : 'text-gray-600'
                }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'day' ? 'bg-emerald-600 text-white' : 'text-gray-600'
                }`}
            >
              Jour
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentWeek(currentWeek - 1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeek(0)}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200"
            >
              Aujourd'hui
            </button>
            <span className="text-gray-600 font-medium">
              {weekDates[0]?.date} {weekDates[0]?.month} - {weekDates[4]?.date} {weekDates[4]?.month}
            </span>
          </div>
          <button
            onClick={() => setCurrentWeek(currentWeek + 1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-6 gap-2 mb-2">
          <div className="text-center py-2"></div>
          {weekDates.map((item, index) => (
            <div
              key={index}
              className={`text-center py-2 rounded-lg ${item.isToday ? 'bg-emerald-100' : ''
                }`}
            >
              <p className={`text-sm font-medium ${item.isToday ? 'text-emerald-700' : 'text-gray-600'}`}>
                {item.day}
              </p>
              <p className={`text-lg font-bold ${item.isToday ? 'text-emerald-700' : 'text-gray-800'}`}>
                {item.date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot} className={isBreak(slot) ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2 text-sm text-gray-600 font-medium whitespace-nowrap border-r border-gray-100 w-24">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{slot.split(' - ')[0]}</span>
                    </div>
                  </td>
                  {days.map(day => {
                    // Find course for this specific slot if key logic doesn't match perfectly
                    // or just rely on formatted keys.
                    // For now, let's keep strict match but ensure we populated it correctly.
                    // In real world, we'd iterate over raw events and check start/end time overlap.
                    // But our backend keys are constructed to match.

                    // Fallback: check raw data? No, transformation did the job.

                    const courseData = schedule[day]?.[slot];
                    const isCurrentDay = day === capitalizedToday && currentWeek === 0;
                    return (
                      <td
                        key={`${day}-${slot}`}
                        className={`px-2 py-2 border-r border-gray-100 ${isCurrentDay ? 'bg-emerald-50/50' : ''}`}
                      >
                        {isBreak(slot) ? (
                          <div className="text-center text-sm text-gray-400 italic py-2">
                            {slot === '09:30 - 10:00' ? 'Pause' : 'Déjeuner'}
                          </div>
                        ) : courseData ? (
                          <div
                            className="p-3 rounded-lg text-white min-h-[70px] cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: courseData.color }}
                          >
                            <p className="font-semibold text-sm">{courseData.subject}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs opacity-90">
                              <User className="w-3 h-3" />
                              {courseData.teacher}
                            </div>
                            <div className="flex items-center gap-1 text-xs opacity-75">
                              <MapPin className="w-3 h-3" />
                              {courseData.room}
                            </div>
                          </div>
                        ) : (
                          <div className="min-h-[70px]" />
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

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Légende</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(
            Object.values(schedule).reduce((acc, day) => {
              Object.values(day).forEach(course => {
                acc[course.subject] = course.color;
              });
              return acc;
            }, {})
          ).map(([subject, color]) => (
            <div key={subject} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              <span className="text-sm text-gray-600">{subject}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSchedulePage;
