/**
 * Student Exams Page
 * View upcoming and past exams
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  Play,
  CheckCircle,
  AlertCircle,
  Award,
  TrendingUp,
  Filter,
} from 'lucide-react';

const StudentExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const sampleExams = [
      // Upcoming
      { id: 1, title: 'Contrôle de Mathématiques', course: 'Mathématiques', code: 'MATH-301', date: '2024-12-18', time: '08:00', duration: 120, room: 'A101', type: 'written', status: 'upcoming', topics: ['Intégrales', 'Dérivées', 'Limites'] },
      { id: 2, title: 'TP noté Physique', course: 'Physique', code: 'PHY-201', date: '2024-12-19', time: '10:00', duration: 90, room: 'Labo 1', type: 'practical', status: 'upcoming', topics: ['Optique géométrique', 'Réfraction'] },
      { id: 3, title: 'Dissertation Français', course: 'Français', code: 'FR-101', date: '2024-12-20', time: '14:00', duration: 180, room: 'A101', type: 'written', status: 'upcoming', topics: ['Le romantisme', 'Victor Hugo'] },
      { id: 4, title: 'QCM Anglais', course: 'Anglais', code: 'EN-301', date: '2024-12-21', time: '09:00', duration: 60, room: 'Online', type: 'online', status: 'upcoming', topics: ['Grammar', 'Vocabulary Unit 4-5'] },
      // Completed
      { id: 5, title: 'Quiz Informatique', course: 'Informatique', code: 'CS-101', date: '2024-12-10', time: '11:00', duration: 30, room: 'Info 1', type: 'online', status: 'completed', grade: 18, maxGrade: 20, rank: 3, totalStudents: 32 },
      { id: 6, title: 'Contrôle Histoire', course: 'Histoire', code: 'HIST-202', date: '2024-12-08', time: '08:00', duration: 120, room: 'A102', type: 'written', status: 'completed', grade: 14, maxGrade: 20, rank: 8, totalStudents: 32 },
      { id: 7, title: 'TP Chimie', course: 'Chimie', code: 'CHEM-301', date: '2024-12-05', time: '14:00', duration: 90, room: 'Labo 2', type: 'practical', status: 'completed', grade: 16, maxGrade: 20, rank: 5, totalStudents: 32 },
    ];
    
    setTimeout(() => {
      setExams(sampleExams);
      setLoading(false);
    }, 500);
  }, []);

  const upcomingExams = exams.filter(e => e.status === 'upcoming');
  const completedExams = exams.filter(e => e.status === 'completed');

  const getTypeBadge = (type) => {
    const styles = {
      written: 'bg-blue-100 text-blue-700',
      practical: 'bg-purple-100 text-purple-700',
      online: 'bg-green-100 text-green-700',
      oral: 'bg-orange-100 text-orange-700',
    };
    const labels = {
      written: 'Écrit',
      practical: 'TP',
      online: 'En ligne',
      oral: 'Oral',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    const examDate = new Date(date);
    return Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
  };

  const getGradeColor = (grade, max) => {
    const percentage = (grade / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes examens</h1>
          <p className="text-gray-500">{upcomingExams.length} examens à venir</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{upcomingExams.length}</p>
              <p className="text-xs text-gray-500">À venir</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{completedExams.length}</p>
              <p className="text-xs text-gray-500">Passés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {completedExams.length > 0 
                  ? (completedExams.reduce((acc, e) => acc + (e.grade / e.maxGrade) * 20, 0) / completedExams.length).toFixed(1)
                  : '-'}/20
              </p>
              <p className="text-xs text-gray-500">Moyenne</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {completedExams.filter(e => e.grade / e.maxGrade >= 0.5).length}/{completedExams.length}
              </p>
              <p className="text-xs text-gray-500">Réussis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              À venir ({upcomingExams.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Passés ({completedExams.length})
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingExams.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun examen à venir</p>
                </div>
              ) : (
                upcomingExams.map((exam) => {
                  const daysUntil = getDaysUntil(exam.date);
                  return (
                    <div key={exam.id} className="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${
                            daysUntil <= 2 ? 'bg-red-100' : daysUntil <= 7 ? 'bg-orange-100' : 'bg-gray-100'
                          }`}>
                            <span className={`text-2xl font-bold ${
                              daysUntil <= 2 ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-gray-600'
                            }`}>
                              {new Date(exam.date).getDate()}
                            </span>
                            <span className={`text-xs ${
                              daysUntil <= 2 ? 'text-red-500' : daysUntil <= 7 ? 'text-orange-500' : 'text-gray-500'
                            }`}>
                              {new Date(exam.date).toLocaleDateString('fr-FR', { month: 'short' })}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                              {getTypeBadge(exam.type)}
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{exam.course} • {exam.code}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {exam.time} • {exam.duration} min
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {exam.room}
                              </div>
                            </div>
                            {exam.topics && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {exam.topics.map((topic, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {daysUntil <= 2 && (
                            <span className="flex items-center gap-1 text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              {daysUntil === 0 ? 'Aujourd\'hui' : daysUntil === 1 ? 'Demain' : `Dans ${daysUntil} jours`}
                            </span>
                          )}
                          {exam.type === 'online' && (
                            <Link
                              to={`/student/exams/${exam.id}/start`}
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                              <Play className="w-4 h-4" />
                              Commencer
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedExams.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun examen passé</p>
                </div>
              ) : (
                completedExams.map((exam) => (
                  <div key={exam.id} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-gray-600">
                            {new Date(exam.date).getDate()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(exam.date).toLocaleDateString('fr-FR', { month: 'short' })}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                            {getTypeBadge(exam.type)}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{exam.course}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500">Rang: {exam.rank}/{exam.totalStudents}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${getGradeColor(exam.grade, exam.maxGrade)}`}>
                          {exam.grade}
                        </p>
                        <p className="text-sm text-gray-500">/{exam.maxGrade}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentExamsPage;
