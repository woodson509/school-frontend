/**
 * Teacher Classes Page
 * View and manage assigned classes
 */

import { useState, useEffect } from 'react';
import {
  Users,
  BarChart3,
  ChevronRight,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Award,
  AlertCircle,
} from 'lucide-react';

const TeacherClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleClasses = [
      {
        id: 1,
        name: '6ème A',
        students: 32,
        average: 15.2,
        previousAverage: 14.5,
        attendance: 94,
        schedule: 'Lun 08:00, Mer 10:00, Ven 08:00',
        nextClass: 'Lundi 08:00',
        topStudents: ['Jean Pierre', 'Marie Claire', 'Paul Martin'],
        needsAttention: ['Sophie Durand', 'Lucas Petit'],
        color: '#3B82F6',
      },
      {
        id: 2,
        name: '5ème B',
        students: 28,
        average: 13.8,
        previousAverage: 14.2,
        attendance: 91,
        schedule: 'Mar 09:45, Jeu 13:30',
        nextClass: 'Mardi 09:45',
        topStudents: ['Emma Martin', 'Thomas Bernard'],
        needsAttention: ['Julie Robert', 'Marc Simon', 'Lisa Moreau'],
        color: '#8B5CF6',
      },
      {
        id: 3,
        name: '4ème A',
        students: 30,
        average: 14.5,
        previousAverage: 14.0,
        attendance: 96,
        schedule: 'Lun 13:30, Mer 08:00',
        nextClass: 'Lundi 13:30',
        topStudents: ['Alice Dupont', 'Hugo Martin', 'Léa Bernard'],
        needsAttention: ['Tom Petit'],
        color: '#10B981',
      },
      {
        id: 4,
        name: '3ème C',
        students: 34,
        average: 12.9,
        previousAverage: 12.5,
        attendance: 89,
        schedule: 'Mar 08:00, Ven 10:00',
        nextClass: 'Mardi 08:00',
        topStudents: ['Camille Simon'],
        needsAttention: ['Pierre Durand', 'Marie Robert', 'Lucas Leroy', 'Emma Moreau'],
        color: '#F59E0B',
      },
      {
        id: 5,
        name: '2nde D',
        students: 32,
        average: 14.1,
        previousAverage: 13.8,
        attendance: 93,
        schedule: 'Mer 13:30, Jeu 08:00',
        nextClass: 'Mercredi 13:30',
        topStudents: ['Nathan Bernard', 'Clara Martin'],
        needsAttention: ['Antoine Petit'],
        color: '#EC4899',
      },
    ];

    setTimeout(() => {
      setClasses(sampleClasses);
      setLoading(false);
    }, 500);
  }, []);

  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
  const globalAverage = classes.length > 0
    ? (classes.reduce((sum, c) => sum + c.average, 0) / classes.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mes classes</h1>
        <p className="text-gray-500">{classes.length} classes • {totalStudents} élèves</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-5 text-white">
          <p className="text-indigo-200 text-sm mb-1">Total élèves</p>
          <p className="text-3xl font-bold">{totalStudents}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Moyenne générale</p>
          <p className="text-3xl font-bold text-gray-800">{globalAverage}/20</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Meilleure classe</p>
          <p className="text-3xl font-bold text-green-600">6ème A</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">À surveiller</p>
          <p className="text-3xl font-bold text-orange-600">3ème C</p>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => {
          const trend = cls.average - cls.previousAverage;
          return (
            <div
              key={cls.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedClass(cls)}
            >
              <div className="h-2" style={{ backgroundColor: cls.color }} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      {cls.students} élèves
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: cls.color }}>
                      {cls.average}
                    </p>
                    <div className={`flex items-center gap-1 text-sm ${
                      trend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {trend >= 0 ? '+' : ''}{trend.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Attendance */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                  <span className="text-sm text-gray-600">Assiduité</span>
                  <span className={`font-semibold ${
                    cls.attendance >= 95 ? 'text-green-600' :
                    cls.attendance >= 90 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {cls.attendance}%
                  </span>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Clock className="w-4 h-4" />
                  Prochain cours: {cls.nextClass}
                </div>

                {/* Top Students */}
                {cls.topStudents.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <Award className="w-3 h-3" /> Meilleurs élèves
                    </p>
                    <p className="text-sm text-gray-700">{cls.topStudents.join(', ')}</p>
                  </div>
                )}

                {/* Needs Attention */}
                {cls.needsAttention.length > 0 && (
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs text-orange-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {cls.needsAttention.length} élève(s) à surveiller
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{cls.schedule}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedClass.name}</h2>
                  <p className="text-gray-500">{selectedClass.students} élèves</p>
                </div>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-indigo-50 rounded-xl">
                  <p className="text-2xl font-bold text-indigo-600">{selectedClass.average}</p>
                  <p className="text-sm text-gray-500">Moyenne</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{selectedClass.attendance}%</p>
                  <p className="text-sm text-gray-500">Assiduité</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">{selectedClass.students}</p>
                  <p className="text-sm text-gray-500">Élèves</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Meilleurs élèves</h3>
                <div className="space-y-2">
                  {selectedClass.topStudents.map((student, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span>{student}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedClass.needsAttention.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Élèves à surveiller</h3>
                  <div className="space-y-2">
                    {selectedClass.needsAttention.map((student, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                        </div>
                        <span>{student}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <a
                  href={`/teacher/students?class=${selectedClass.id}`}
                  className="flex-1 py-3 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700"
                >
                  Voir tous les élèves
                </a>
                <a
                  href={`/teacher/class-analytics?class=${selectedClass.id}`}
                  className="flex-1 py-3 border border-indigo-600 text-indigo-600 text-center rounded-lg hover:bg-indigo-50"
                >
                  Voir les statistiques
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassesPage;
