/**
 * Teacher Schedule Page
 * Weekly teaching schedule
 */

import { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Plus,
  Edit,
  Copy,
  Download,
} from 'lucide-react';

const TeacherSchedulePage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // Sample schedule data
    const sampleSchedule = [
      { id: 1, day: 'Lundi', startTime: '08:00', endTime: '09:30', class: '6ème A', subject: 'Mathématiques', room: 'Salle 201', students: 32 },
      { id: 2, day: 'Lundi', startTime: '10:00', endTime: '11:30', class: '5ème B', subject: 'Mathématiques', room: 'Salle 201', students: 28 },
      { id: 3, day: 'Lundi', startTime: '14:00', endTime: '15:30', class: '4ème C', subject: 'Mathématiques', room: 'Salle 203', students: 30 },
      
      { id: 4, day: 'Mardi', startTime: '08:00', endTime: '09:30', class: '6ème A', subject: 'Mathématiques', room: 'Salle 201', students: 32 },
      { id: 5, day: 'Mardi', startTime: '13:30', endTime: '15:00', class: '6ème B', subject: 'Mathématiques', room: 'Salle 202', students: 30 },
      { id: 6, day: 'Mardi', startTime: '15:30', endTime: '17:00', class: '5ème A', subject: 'Mathématiques', room: 'Salle 201', students: 29 },
      
      { id: 7, day: 'Mercredi', startTime: '08:00', endTime: '09:30', class: '4ème C', subject: 'Mathématiques', room: 'Salle 203', students: 30 },
      { id: 8, day: 'Mercredi', startTime: '10:00', endTime: '11:30', class: '5ème B', subject: 'Mathématiques', room: 'Salle 201', students: 28 },
      
      { id: 9, day: 'Jeudi', startTime: '08:00', endTime: '09:30', class: '6ème B', subject: 'Mathématiques', room: 'Salle 202', students: 30 },
      { id: 10, day: 'Jeudi', startTime: '10:00', endTime: '11:30', class: '6ème A', subject: 'Mathématiques', room: 'Salle 201', students: 32 },
      { id: 11, day: 'Jeudi', startTime: '14:00', endTime: '15:30', class: '5ème A', subject: 'Mathématiques', room: 'Salle 201', students: 29 },
      
      { id: 12, day: 'Vendredi', startTime: '08:00', endTime: '09:30', class: '5ème B', subject: 'Mathématiques', room: 'Salle 201', students: 28 },
      { id: 13, day: 'Vendredi', startTime: '10:00', endTime: '11:30', class: '4ème C', subject: 'Mathématiques', room: 'Salle 203', students: 30 },
      { id: 14, day: 'Vendredi', startTime: '14:00', endTime: '15:30', class: '5ème A', subject: 'Mathématiques', room: 'Salle 201', students: 29 },
    ];
    
    setSchedule(sampleSchedule);
  }, []);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeSlots = ['08:00', '09:30', '10:00', '11:30', '13:30', '14:00', '15:30'];

  const getClassesForDay = (day) => {
    return schedule.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const goToPrevWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const totalHours = schedule.reduce((acc, s) => {
    const start = parseInt(s.startTime.split(':')[0]) + parseInt(s.startTime.split(':')[1]) / 60;
    const end = parseInt(s.endTime.split(':')[0]) + parseInt(s.endTime.split(':')[1]) / 60;
    return acc + (end - start);
  }, 0);

  const uniqueClasses = [...new Set(schedule.map(s => s.class))].length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mon emploi du temps</h1>
          <p className="text-gray-500">{totalHours}h de cours par semaine • {uniqueClasses} classes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Copy className="w-4 h-4" />
            Dupliquer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Ajouter un cours
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{schedule.length}</p>
              <p className="text-xs text-gray-500">Séances/semaine</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalHours}h</p>
              <p className="text-xs text-gray-500">Volume horaire</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{uniqueClasses}</p>
              <p className="text-xs text-gray-500">Classes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">3</p>
              <p className="text-xs text-gray-500">Salles utilisées</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Navigation */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <button onClick={goToPrevWeek} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Semaine du {currentWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <button onClick={goToNextWeek} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="p-4 overflow-x-auto">
          <div className="grid grid-cols-5 gap-4 min-w-[800px]">
            {days.map((day, index) => (
              <div key={day} className="space-y-3">
                <div className="text-center pb-2 border-b-2 border-blue-600">
                  <p className="font-semibold text-gray-800">{day}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(currentWeek.getTime() + index * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {getClassesForDay(day).map(session => (
                    <div
                      key={session.id}
                      className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-700">{session.startTime} - {session.endTime}</span>
                        <button className="p-1 hover:bg-white/50 rounded">
                          <Edit className="w-3 h-3 text-blue-600" />
                        </button>
                      </div>
                      <p className="font-semibold text-gray-800 mb-1">{session.class}</p>
                      <p className="text-sm text-gray-600 mb-2">{session.subject}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{session.room}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Users className="w-3 h-3" />
                        <span>{session.students} étudiants</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Actions rapides</h3>
        <p className="text-blue-100 mb-4">Gérez votre emploi du temps efficacement</p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur">
            Voir les conflits
          </button>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur">
            Trouver salle libre
          </button>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur">
            Demander remplacement
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherSchedulePage;
