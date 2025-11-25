/**
 * Student Attendance Page
 * View personal attendance record
 */

import { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const StudentAttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const sampleData = {
      stats: {
        totalDays: 60,
        present: 56,
        absent: 2,
        late: 1,
        excused: 1,
        rate: 94,
      },
      monthly: {
        '2024-12': [
          { date: '2024-12-02', status: 'present', arrivalTime: '07:25' },
          { date: '2024-12-03', status: 'present', arrivalTime: '07:28' },
          { date: '2024-12-04', status: 'late', arrivalTime: '07:45', note: 'Retard transport' },
          { date: '2024-12-05', status: 'present', arrivalTime: '07:20' },
          { date: '2024-12-06', status: 'present', arrivalTime: '07:30' },
          { date: '2024-12-09', status: 'present', arrivalTime: '07:22' },
          { date: '2024-12-10', status: 'absent', note: 'Maladie' },
          { date: '2024-12-11', status: 'excused', note: 'RDV médical' },
          { date: '2024-12-12', status: 'present', arrivalTime: '07:27' },
          { date: '2024-12-13', status: 'present', arrivalTime: '07:29' },
        ],
        '2024-11': [
          { date: '2024-11-04', status: 'present', arrivalTime: '07:25' },
          { date: '2024-11-05', status: 'present', arrivalTime: '07:28' },
          { date: '2024-11-06', status: 'present', arrivalTime: '07:22' },
          { date: '2024-11-07', status: 'present', arrivalTime: '07:30' },
          { date: '2024-11-08', status: 'present', arrivalTime: '07:26' },
          { date: '2024-11-11', status: 'present', arrivalTime: '07:29' },
          { date: '2024-11-12', status: 'present', arrivalTime: '07:24' },
          { date: '2024-11-13', status: 'present', arrivalTime: '07:27' },
          { date: '2024-11-14', status: 'absent', note: 'Non justifié' },
          { date: '2024-11-15', status: 'present', arrivalTime: '07:30' },
        ],
      },
      recentAbsences: [
        { date: '2024-12-10', subject: 'Toute la journée', reason: 'Maladie', justified: true },
        { date: '2024-11-14', subject: 'Toute la journée', reason: 'Non justifié', justified: false },
      ],
    };
    
    setTimeout(() => {
      setAttendanceData(sampleData);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'excused':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      present: 'Présent',
      absent: 'Absent',
      late: 'En retard',
      excused: 'Excusé',
    };
    return labels[status];
  };

  const getStatusColor = (status) => {
    const colors = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700',
      late: 'bg-orange-100 text-orange-700',
      excused: 'bg-blue-100 text-blue-700',
    };
    return colors[status];
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay() || 7;
    
    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const getAttendanceForDate = (date) => {
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const dateKey = date.toISOString().split('T')[0];
    const monthData = attendanceData?.monthly[monthKey] || [];
    return monthData.find(d => d.date === dateKey);
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mes présences</h1>
        <p className="text-gray-500">Année scolaire 2024-2025</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white col-span-2 md:col-span-1">
          <p className="text-emerald-100 text-sm mb-1">Taux de présence</p>
          <p className="text-4xl font-bold">{attendanceData.stats.rate}%</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-100">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Excellent</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{attendanceData.stats.present}</p>
              <p className="text-xs text-gray-500">Présent</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{attendanceData.stats.absent}</p>
              <p className="text-xs text-gray-500">Absent</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{attendanceData.stats.late}</p>
              <p className="text-xs text-gray-500">Retard</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{attendanceData.stats.excused}</p>
              <p className="text-xs text-gray-500">Excusé</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-lg"
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              const attendance = getAttendanceForDate(day.date);
              const weekend = isWeekend(day.date);
              const isToday = day.date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={`aspect-square p-1 ${!day.isCurrentMonth ? 'opacity-30' : ''}`}
                >
                  <div
                    className={`w-full h-full rounded-lg flex flex-col items-center justify-center text-sm
                      ${isToday ? 'ring-2 ring-emerald-500' : ''}
                      ${weekend ? 'bg-gray-50' : ''}
                      ${attendance?.status === 'present' ? 'bg-green-50' : ''}
                      ${attendance?.status === 'absent' ? 'bg-red-50' : ''}
                      ${attendance?.status === 'late' ? 'bg-orange-50' : ''}
                      ${attendance?.status === 'excused' ? 'bg-blue-50' : ''}
                    `}
                  >
                    <span className={`${isToday ? 'font-bold text-emerald-600' : 'text-gray-700'}`}>
                      {day.date.getDate()}
                    </span>
                    {attendance && (
                      <div className="mt-1">
                        {attendance.status === 'present' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                        {attendance.status === 'absent' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                        {attendance.status === 'late' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                        {attendance.status === 'excused' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Présent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-gray-600">Retard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">Excusé</span>
            </div>
          </div>
        </div>

        {/* Recent Absences */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Absences récentes</h3>
          <div className="space-y-3">
            {attendanceData.recentAbsences.map((absence, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">{absence.date}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    absence.justified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {absence.justified ? 'Justifié' : 'Non justifié'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{absence.subject}</p>
                <p className="text-xs text-gray-500 mt-1">{absence.reason}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Rappel</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Toute absence doit être justifiée dans les 48h. 
                  Contactez le secrétariat si nécessaire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendancePage;
