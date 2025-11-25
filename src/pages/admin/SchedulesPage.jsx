/**
 * Schedules Management Page
 * Manage class timetables and schedules
 */

import { useState } from 'react';
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

const SchedulesPage = () => {
  const [selectedClass, setSelectedClass] = useState('6ème A');
  const [view, setView] = useState('week');
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', 'Terminale S1'];
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

  // Sample schedule data
  const schedule = {
    'Lundi': {
      '07:00 - 08:00': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '08:00 - 09:00': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '09:00 - 10:00': { subject: 'Français', teacher: 'Mme Martin', room: 'A102', color: '#10B981' },
      '10:30 - 11:30': { subject: 'Histoire', teacher: 'M. Bernard', room: 'B201', color: '#F59E0B' },
      '11:30 - 12:30': { subject: 'Anglais', teacher: 'Mme Petit', room: 'B202', color: '#8B5CF6' },
      '14:00 - 15:00': { subject: 'Physique', teacher: 'M. Robert', room: 'Labo 1', color: '#EF4444' },
      '15:00 - 16:00': { subject: 'Physique', teacher: 'M. Robert', room: 'Labo 1', color: '#EF4444' },
    },
    'Mardi': {
      '07:00 - 08:00': { subject: 'Français', teacher: 'Mme Martin', room: 'A102', color: '#10B981' },
      '08:00 - 09:00': { subject: 'Français', teacher: 'Mme Martin', room: 'A102', color: '#10B981' },
      '09:00 - 10:00': { subject: 'Informatique', teacher: 'M. Laurent', room: 'Salle Info', color: '#EC4899' },
      '10:30 - 11:30': { subject: 'Informatique', teacher: 'M. Laurent', room: 'Salle Info', color: '#EC4899' },
      '11:30 - 12:30': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '14:00 - 15:00': { subject: 'EPS', teacher: 'M. Simon', room: 'Gymnase', color: '#14B8A6' },
      '15:00 - 16:00': { subject: 'EPS', teacher: 'M. Simon', room: 'Gymnase', color: '#14B8A6' },
    },
    'Mercredi': {
      '07:00 - 08:00': { subject: 'Chimie', teacher: 'Mme Moreau', room: 'Labo 2', color: '#6366F1' },
      '08:00 - 09:00': { subject: 'Chimie', teacher: 'Mme Moreau', room: 'Labo 2', color: '#6366F1' },
      '09:00 - 10:00': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '10:30 - 11:30': { subject: 'Géographie', teacher: 'M. Bernard', room: 'B201', color: '#F97316' },
      '11:30 - 12:30': { subject: 'Géographie', teacher: 'M. Bernard', room: 'B201', color: '#F97316' },
    },
    'Jeudi': {
      '07:00 - 08:00': { subject: 'Anglais', teacher: 'Mme Petit', room: 'B202', color: '#8B5CF6' },
      '08:00 - 09:00': { subject: 'Anglais', teacher: 'Mme Petit', room: 'B202', color: '#8B5CF6' },
      '09:00 - 10:00': { subject: 'Biologie', teacher: 'M. Leroy', room: 'Labo 3', color: '#22C55E' },
      '10:30 - 11:30': { subject: 'Biologie', teacher: 'M. Leroy', room: 'Labo 3', color: '#22C55E' },
      '11:30 - 12:30': { subject: 'Philosophie', teacher: 'Mme Blanc', room: 'C301', color: '#A855F7' },
      '14:00 - 15:00': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '15:00 - 16:00': { subject: 'Physique', teacher: 'M. Robert', room: 'Labo 1', color: '#EF4444' },
    },
    'Vendredi': {
      '07:00 - 08:00': { subject: 'Histoire', teacher: 'M. Bernard', room: 'B201', color: '#F59E0B' },
      '08:00 - 09:00': { subject: 'Français', teacher: 'Mme Martin', room: 'A102', color: '#10B981' },
      '09:00 - 10:00': { subject: 'Français', teacher: 'Mme Martin', room: 'A102', color: '#10B981' },
      '10:30 - 11:30': { subject: 'Musique', teacher: 'M. Dubois', room: 'Salle Musique', color: '#F472B6' },
      '11:30 - 12:30': { subject: 'Arts', teacher: 'Mme Richard', room: 'Atelier', color: '#FB923C' },
      '14:00 - 15:00': { subject: 'Informatique', teacher: 'M. Laurent', room: 'Salle Info', color: '#EC4899' },
      '15:00 - 16:00': { subject: 'Étude dirigée', teacher: '-', room: 'A103', color: '#94A3B8' },
    },
    'Samedi': {
      '07:00 - 08:00': { subject: 'Mathématiques', teacher: 'M. Dupont', room: 'A101', color: '#3B82F6' },
      '08:00 - 09:00': { subject: 'Physique', teacher: 'M. Robert', room: 'Labo 1', color: '#EF4444' },
      '09:00 - 10:00': { subject: 'Chimie', teacher: 'Mme Moreau', room: 'Labo 2', color: '#6366F1' },
      '10:30 - 11:30': { subject: 'Anglais', teacher: 'Mme Petit', room: 'B202', color: '#8B5CF6' },
    },
  };

  const isBreak = (slot) => slot === '10:00 - 10:30' || slot === '12:30 - 14:00';

  const handleSlotClick = (day, slot) => {
    if (!isBreak(slot)) {
      setSelectedSlot({ day, slot });
      setShowModal(true);
    }
  };

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
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'week' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'day' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              Jour
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Copy className="w-4 h-4" />
            Dupliquer
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter cours
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Emploi du temps - {selectedClass}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-28">
                  Horaire
                </th>
                {days.map(day => (
                  <th key={day} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, index) => (
                <tr key={slot} className={isBreak(slot) ? 'bg-gray-100' : ''}>
                  <td className="px-4 py-2 text-sm text-gray-600 font-medium border-r border-gray-200">
                    {slot}
                  </td>
                  {days.map(day => {
                    const course = schedule[day]?.[slot];
                    const isBreakSlot = isBreak(slot);
                    
                    return (
                      <td
                        key={`${day}-${slot}`}
                        onClick={() => handleSlotClick(day, slot)}
                        className={`px-2 py-1 border border-gray-100 ${
                          isBreakSlot ? '' : 'cursor-pointer hover:bg-gray-50'
                        }`}
                      >
                        {isBreakSlot ? (
                          <div className="text-center text-xs text-gray-400 italic">
                            {slot === '10:00 - 10:30' ? 'Pause' : 'Déjeuner'}
                          </div>
                        ) : course ? (
                          <div
                            className="p-2 rounded-lg text-white text-xs"
                            style={{ backgroundColor: course.color }}
                          >
                            <p className="font-semibold">{course.subject}</p>
                            <p className="opacity-90">{course.teacher}</p>
                            <p className="opacity-75">{course.room}</p>
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center">
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

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Légende des matières</h4>
        <div className="flex flex-wrap gap-3">
          {[
            { subject: 'Mathématiques', color: '#3B82F6' },
            { subject: 'Français', color: '#10B981' },
            { subject: 'Physique', color: '#EF4444' },
            { subject: 'Chimie', color: '#6366F1' },
            { subject: 'Anglais', color: '#8B5CF6' },
            { subject: 'Histoire/Géo', color: '#F59E0B' },
            { subject: 'Informatique', color: '#EC4899' },
            { subject: 'EPS', color: '#14B8A6' },
            { subject: 'Biologie', color: '#22C55E' },
          ].map((item) => (
            <div key={item.subject} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600">{item.subject}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ScheduleModal
          slot={selectedSlot}
          onClose={() => {
            setShowModal(false);
            setSelectedSlot(null);
          }}
          onSave={() => {
            setShowModal(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
};

const ScheduleModal = ({ slot, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    room: '',
    day: slot?.day || 'Lundi',
    startTime: '',
    endTime: '',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {slot ? `Ajouter cours - ${slot.day} ${slot.slot}` : 'Nouveau cours'}
        </h3>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une matière</option>
              <option value="Mathématiques">Mathématiques</option>
              <option value="Français">Français</option>
              <option value="Physique">Physique</option>
              <option value="Chimie">Chimie</option>
              <option value="Anglais">Anglais</option>
              <option value="Histoire">Histoire</option>
              <option value="Informatique">Informatique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
            <select
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un professeur</option>
              <option value="M. Dupont">M. Dupont</option>
              <option value="Mme Martin">Mme Martin</option>
              <option value="M. Robert">M. Robert</option>
              <option value="Mme Petit">Mme Petit</option>
            </select>
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

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulesPage;
