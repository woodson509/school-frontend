/**
 * Student Schedule Page
 * Weekly timetable view
 */

import { useState } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Download,
} from 'lucide-react';

const StudentSchedulePage = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState('week');

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeSlots = [
    '07:30 - 08:30',
    '08:30 - 09:30',
    '09:30 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:30',
    '13:30 - 14:30',
    '14:30 - 15:30',
    '15:30 - 16:30',
  ];

  const schedule = {
    'Lundi': {
      '07:30 - 08:30': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '08:30 - 09:30': { subject: 'Français', teacher: 'Mme Martin', room: 'A101', color: '#EF4444' },
      '10:00 - 11:00': { subject: 'Physique', teacher: 'M. Bernard', room: 'Labo 1', color: '#8B5CF6' },
      '11:00 - 12:00': { subject: 'Anglais', teacher: 'Mme Petit', room: 'A101', color: '#F59E0B' },
      '13:30 - 14:30': { subject: 'Histoire', teacher: 'M. Robert', room: 'A102', color: '#EC4899' },
      '14:30 - 15:30': { subject: 'Sport', teacher: 'M. Laurent', room: 'Gymnase', color: '#10B981' },
    },
    'Mardi': {
      '07:30 - 08:30': { subject: 'Français', teacher: 'Mme Martin', room: 'A101', color: '#EF4444' },
      '08:30 - 09:30': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '10:00 - 11:00': { subject: 'Chimie', teacher: 'M. Simon', room: 'Labo 2', color: '#14B8A6' },
      '11:00 - 12:00': { subject: 'Informatique', teacher: 'Mme Moreau', room: 'Info 1', color: '#6366F1' },
      '13:30 - 14:30': { subject: 'Biologie', teacher: 'M. Leroy', room: 'Labo 3', color: '#22C55E' },
      '14:30 - 15:30': { subject: 'Arts', teacher: 'Mme Dubois', room: 'Art 1', color: '#A855F7' },
    },
    'Mercredi': {
      '07:30 - 08:30': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '08:30 - 09:30': { subject: 'Physique', teacher: 'M. Bernard', room: 'Labo 1', color: '#8B5CF6' },
      '10:00 - 11:00': { subject: 'Anglais', teacher: 'Mme Petit', room: 'A101', color: '#F59E0B' },
      '11:00 - 12:00': { subject: 'Géographie', teacher: 'M. Blanc', room: 'A102', color: '#0EA5E9' },
    },
    'Jeudi': {
      '07:30 - 08:30': { subject: 'Français', teacher: 'Mme Martin', room: 'A101', color: '#EF4444' },
      '08:30 - 09:30': { subject: 'Histoire', teacher: 'M. Robert', room: 'A102', color: '#EC4899' },
      '10:00 - 11:00': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '11:00 - 12:00': { subject: 'Physique', teacher: 'M. Bernard', room: 'Labo 1', color: '#8B5CF6' },
      '13:30 - 14:30': { subject: 'Musique', teacher: 'Mme Garcia', room: 'Musique', color: '#F97316' },
      '14:30 - 15:30': { subject: 'Informatique', teacher: 'Mme Moreau', room: 'Info 1', color: '#6366F1' },
    },
    'Vendredi': {
      '07:30 - 08:30': { subject: 'Anglais', teacher: 'Mme Petit', room: 'A101', color: '#F59E0B' },
      '08:30 - 09:30': { subject: 'Français', teacher: 'Mme Martin', room: 'A101', color: '#EF4444' },
      '10:00 - 11:00': { subject: 'Chimie', teacher: 'M. Simon', room: 'Labo 2', color: '#14B8A6' },
      '11:00 - 12:00': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '13:30 - 14:30': { subject: 'Sport', teacher: 'M. Laurent', room: 'Gymnase', color: '#10B981' },
      '14:30 - 15:30': { subject: 'Étude dirigée', teacher: 'M. Dupont', room: 'A101', color: '#64748B' },
    },
  };

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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'week' ? 'bg-emerald-600 text-white' : 'text-gray-600'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'day' ? 'bg-emerald-600 text-white' : 'text-gray-600'
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
              className={`text-center py-2 rounded-lg ${
                item.isToday ? 'bg-emerald-100' : ''
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
