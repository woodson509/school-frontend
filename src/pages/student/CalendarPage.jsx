/**
 * Student Calendar Page
 * Full calendar with events, exams, and deadlines
 */

import { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  BookOpen,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';

const { eventAPI } = api;

const StudentCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const res = await eventAPI.getAll({ month, year });
      if (res.success) {
        // Transform API data to match expected format
        const transformedEvents = res.data.map(e => ({
          id: e.id,
          title: e.title,
          type: e.type || 'event',
          date: e.date?.split('T')[0] || e.date,
          endDate: e.endDate?.split('T')[0] || e.endDate,
          color: e.color || getDefaultColor(e.type),
          time: e.time,
          description: e.description,
          location: e.location,
        }));
        setEvents(transformedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultColor = (type) => {
    const colors = {
      exam: '#EF4444',
      assignment: '#F59E0B',
      event: '#3B82F6',
      holiday: '#10B981',
      academic: '#3B82F6',
      meeting: '#8B5CF6',
    };
    return colors[type] || '#6B7280';
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay() || 7;

    const days = [];

    // Previous month
    for (let i = startingDayOfWeek - 1; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push({ date: d, isCurrentMonth: false });
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true });
    }

    // Next month
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false });
    }

    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => {
      const eventDate = e.date;
      const endDate = e.endDate || eventDate;
      return dateStr >= eventDate && dateStr <= endDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'exam': return <FileText className="w-4 h-4" />;
      case 'assignment': return <BookOpen className="w-4 h-4" />;
      case 'event':
      case 'academic': return <Calendar className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendrier</h1>
          <p className="text-gray-500">Gérez vos événements et échéances</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'month' ? 'bg-emerald-600 text-white' : 'text-gray-600'
                }`}
            >
              Mois
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'week' ? 'bg-emerald-600 text-white' : 'text-gray-600'
                }`}
            >
              Semaine
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm">
          {/* Navigation */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <button onClick={goToPrevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
              >
                Aujourd'hui
              </button>
            </div>
            <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const dayEvents = getEventsForDate(day.date);
                  const isToday = day.date.toDateString() === today.toDateString();
                  const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day.date)}
                      className={`min-h-[80px] p-1 border rounded-lg cursor-pointer transition-all ${!day.isCurrentMonth ? 'bg-gray-50 opacity-50' : 'hover:border-emerald-300'
                        } ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-100'}`}
                    >
                      <div className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-emerald-600 text-white' : 'text-gray-700'
                        }`}>
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="text-xs px-1 py-0.5 rounded truncate text-white"
                            style={{ backgroundColor: event.color }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-400">+{dayEvents.length - 2} autres</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="px-4 pb-4 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-sm text-gray-600">Examens</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500" />
              <span className="text-sm text-gray-600">Devoirs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-sm text-gray-600">Événements</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-sm text-gray-600">Vacances</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          {selectedDate && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: event.color }}
                      >
                        {getTypeIcon(event.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{event.title}</p>
                        {event.time && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Aucun événement ce jour</p>
              )}
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">À venir</h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Aucun événement à venir</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCalendarPage;

