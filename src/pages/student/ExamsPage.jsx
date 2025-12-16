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
} from 'lucide-react';
import { examAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const StudentExamsPage = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchExams();
  }, [user]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examAPI.getAll({ role: 'student' }); // Requires backend to filter by student's class
      setExams(response.data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const classifyExams = (allExams) => {
    const now = new Date();
    const upcoming = [];
    const completed = [];

    allExams.forEach(exam => {
      const examDate = new Date(exam.exam_date);
      // Logic: If exam is completed or date is past
      if (exam.completed_at || examDate < now) {
        completed.push(exam);
      } else {
        upcoming.push(exam);
      }
    });

    return { upcoming, completed };
  };

  const { upcoming: upcomingExams, completed: completedExams } = classifyExams(exams);


  const getTypeBadge = (type) => {
    // Default to 'written' if type is missing
    const safeType = type || 'written';
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[safeType] || styles.written}`}>
        {labels[safeType] || labels.written}
      </span>
    );
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    const examDate = new Date(date);
    return Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
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
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'upcoming'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              À venir ({upcomingExams.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'completed'
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
                  const daysUntil = getDaysUntil(exam.exam_date);
                  const isToday = daysUntil === 0;

                  return (
                    <div key={exam.id} className="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${daysUntil <= 2 ? 'bg-red-100' : daysUntil <= 7 ? 'bg-orange-100' : 'bg-gray-100'
                            }`}>
                            <span className={`text-2xl font-bold ${daysUntil <= 2 ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-gray-600'
                              }`}>
                              {new Date(exam.exam_date).getDate()}
                            </span>
                            <span className={`text-xs ${daysUntil <= 2 ? 'text-red-500' : daysUntil <= 7 ? 'text-orange-500' : 'text-gray-500'
                              }`}>
                              {new Date(exam.exam_date).toLocaleDateString('fr-FR', { month: 'short' })}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                              {getTypeBadge(exam.type)}
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{exam.subject_name || exam.course_title}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {exam.duration_minutes} min
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {daysUntil <= 2 && (
                            <span className="flex items-center gap-1 text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              {daysUntil <= 0 ? 'Aujourd\'hui' : daysUntil === 1 ? 'Demain' : `Dans ${daysUntil} jours`}
                            </span>
                          )}

                          {/* Only allow taking exam online if it's type is online */}
                          {exam.type === 'online' ? (
                            <Link
                              to={`/exams/${exam.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                              <Play className="w-4 h-4" />
                              Commencer
                            </Link>
                          ) : (
                            <div className="flex flex-col items-end text-sm text-gray-500">
                              <span className="font-medium">Examen sur table</span>
                              <span>{new Date(exam.exam_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
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
                            {new Date(exam.exam_date).getDate()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(exam.exam_date).toLocaleDateString('fr-FR', { month: 'short' })}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                            {getTypeBadge(exam.type)}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{exam.subject_name || exam.course_title}</p>
                        </div>
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
