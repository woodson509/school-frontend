/**
 * Grades Management Page - Bulletin Scolaire
 * Vue pédagogique des notes par classe et période
 */

import { useState, useEffect } from 'react';
import {
  Download,
  Users,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Printer
} from 'lucide-react';
import api from '../../services/api';

const { classAPI, subjectAPI, settingsAPI, userAPI } = api;

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters - Only class and period
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [gradingScale, setGradingScale] = useState({ max_value: 20 });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedPeriod) {
      fetchGrades();
    }
  }, [selectedClass, selectedPeriod]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesRes, subjectsRes, periodsRes, scalesRes] = await Promise.all([
        classAPI.getAll(),
        subjectAPI.getAll(),
        settingsAPI.getReportPeriods({ is_active: true }),
        settingsAPI.getGradingScales()
      ]);

      if (classesRes.success) setClasses(classesRes.data);
      if (subjectsRes.success) setSubjects(subjectsRes.data);
      if (periodsRes.success) setPeriods(periodsRes.data);

      if (scalesRes.success) {
        const activeScale = scalesRes.data.find(s => s.is_default) || scalesRes.data[0];
        if (activeScale) setGradingScale(activeScale);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

      // Fetch all grades and students
      const [dumpResponse, studentsRes] = await Promise.all([
        fetch(`${API_BASE}/debug/dump-grades`),
        userAPI.getAll({ role: 'student', class_id: selectedClass })
      ]);

      const dumpData = await dumpResponse.json();

      // Filter by class_id only (show all subjects)
      const filteredGrades = dumpData.filter(g => g.class_id === selectedClass);

      setGrades(filteredGrades);
      if (studentsRes.success) setStudents(studentsRes.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  // Get unique subjects from grades
  const gradedSubjects = [...new Set(grades.map(g => g.subject_id))]
    .map(subjectId => subjects.find(s => s.id === subjectId))
    .filter(Boolean);

  // Build comprehensive student data with all subjects
  const studentData = students.map(student => {
    const studentGrades = grades.filter(g => g.student_id === student.id);

    // Calculate average per subject
    const subjectAverages = {};
    gradedSubjects.forEach(subject => {
      const subjectGrades = studentGrades.filter(g => g.subject_id === subject.id);
      if (subjectGrades.length > 0) {
        const total = subjectGrades.reduce((sum, g) => {
          const value = parseFloat(g.value) || 0;
          const maxValue = parseFloat(g.max_value) || 20;
          return sum + (value / maxValue * 20);
        }, 0);
        subjectAverages[subject.id] = (total / subjectGrades.length).toFixed(1);
      } else {
        subjectAverages[subject.id] = null;
      }
    });

    // Calculate overall average
    const validAverages = Object.values(subjectAverages).filter(v => v !== null).map(v => parseFloat(v));
    const overallAverage = validAverages.length > 0
      ? (validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(2)
      : null;

    return {
      student,
      subjectAverages,
      overallAverage,
      totalGrades: studentGrades.length
    };
  });

  // Sort students by overall average (descending)
  const sortedStudentData = [...studentData].sort((a, b) => {
    if (a.overallAverage === null) return 1;
    if (b.overallAverage === null) return -1;
    return parseFloat(b.overallAverage) - parseFloat(a.overallAverage);
  });

  // Class statistics
  const classStats = {
    totalStudents: students.length,
    totalGrades: grades.length,
    classAverage: studentData.filter(s => s.overallAverage).length > 0
      ? (studentData.filter(s => s.overallAverage).reduce((sum, s) => sum + parseFloat(s.overallAverage), 0) / studentData.filter(s => s.overallAverage).length).toFixed(2)
      : '0.00',
    highestAverage: studentData.filter(s => s.overallAverage).length > 0
      ? Math.max(...studentData.filter(s => s.overallAverage).map(s => parseFloat(s.overallAverage))).toFixed(2)
      : '0.00',
    lowestAverage: studentData.filter(s => s.overallAverage).length > 0
      ? Math.min(...studentData.filter(s => s.overallAverage).map(s => parseFloat(s.overallAverage))).toFixed(2)
      : '0.00',
    passingStudents: studentData.filter(s => s.overallAverage && parseFloat(s.overallAverage) >= 10).length,
    failingStudents: studentData.filter(s => s.overallAverage && parseFloat(s.overallAverage) < 10).length
  };

  // Get grade color based on value
  const getGradeColor = (value) => {
    if (value === null) return 'text-gray-400 bg-gray-50';
    const numValue = parseFloat(value);
    if (numValue >= 16) return 'text-green-700 bg-green-100 font-bold';
    if (numValue >= 14) return 'text-green-600 bg-green-50';
    if (numValue >= 10) return 'text-yellow-700 bg-yellow-50';
    if (numValue >= 8) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-100';
  };

  // Get rank suffix
  const getRankSuffix = (rank) => {
    if (rank === 1) return 'er';
    return 'ème';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Tableau des Notes</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble des résultats scolaires</p>
        </div>
        {selectedClass && selectedPeriod && (
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        )}
      </div>

      {/* Filters - Only Class and Period */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Classe
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Période
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">Sélectionner une période</option>
              {periods.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.school_year})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {selectedClass && selectedPeriod && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Users className="w-4 h-4" />
              Élèves
            </div>
            <div className="text-2xl font-bold text-gray-800">{classStats.totalStudents}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <BookOpen className="w-4 h-4" />
              Notes
            </div>
            <div className="text-2xl font-bold text-gray-800">{classStats.totalGrades}</div>
          </div>

          <div className="bg-blue-50 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Moyenne Classe
            </div>
            <div className="text-2xl font-bold text-blue-700">{classStats.classAverage}/20</div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              <Award className="w-4 h-4" />
              Plus haute
            </div>
            <div className="text-2xl font-bold text-green-700">{classStats.highestAverage}/20</div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              ✅ Admis
            </div>
            <div className="text-2xl font-bold text-green-700">{classStats.passingStudents}</div>
          </div>

          <div className="bg-red-50 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-red-500 text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              En difficulté
            </div>
            <div className="text-2xl font-bold text-red-600">{classStats.failingStudents}</div>
          </div>
        </div>
      )}

      {/* Main Grades Table */}
      {selectedClass && selectedPeriod && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase sticky left-0 bg-blue-600 z-10">
                    Rang
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase sticky left-12 bg-blue-600 z-10">
                    Élève
                  </th>
                  {gradedSubjects.map(subject => (
                    <th key={subject.id} className="px-4 py-4 text-center text-xs font-semibold uppercase whitespace-nowrap">
                      {subject.name}
                    </th>
                  ))}
                  <th className="px-4 py-4 text-center text-xs font-semibold uppercase bg-blue-800">
                    Moyenne
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold uppercase bg-blue-800">
                    Décision
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedStudentData.map((data, index) => {
                  const rank = index + 1;
                  const isPassing = data.overallAverage && parseFloat(data.overallAverage) >= 10;

                  return (
                    <tr key={data.student.id} className="hover:bg-gray-50 transition-colors">
                      {/* Rank */}
                      <td className="px-4 py-3 sticky left-0 bg-white z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                          ${rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                            rank === 2 ? 'bg-gray-300 text-gray-700' :
                              rank === 3 ? 'bg-orange-300 text-orange-900' :
                                'bg-gray-100 text-gray-600'}`}>
                          {rank}
                        </div>
                      </td>

                      {/* Student Name */}
                      <td className="px-4 py-3 sticky left-12 bg-white z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                            {data.student.full_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{data.student.full_name}</div>
                            <div className="text-xs text-gray-500">{data.totalGrades} notes</div>
                          </div>
                        </div>
                      </td>

                      {/* Subject Grades */}
                      {gradedSubjects.map(subject => (
                        <td key={subject.id} className="px-4 py-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${getGradeColor(data.subjectAverages[subject.id])}`}>
                            {data.subjectAverages[subject.id] !== null ? data.subjectAverages[subject.id] : '-'}
                          </span>
                        </td>
                      ))}

                      {/* Overall Average */}
                      <td className="px-4 py-3 text-center bg-gray-50">
                        <span className={`inline-block px-4 py-2 rounded-lg text-lg font-bold ${data.overallAverage ? getGradeColor(data.overallAverage) : 'text-gray-400'
                          }`}>
                          {data.overallAverage || '-'}
                        </span>
                      </td>

                      {/* Decision */}
                      <td className="px-4 py-3 text-center bg-gray-50">
                        {data.overallAverage ? (
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isPassing ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {isPassing ? '✅ Admis' : '⚠️ Rattrapage'}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {sortedStudentData.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun élève dans cette classe</p>
            </div>
          )}

          {/* No grades message */}
          {sortedStudentData.length > 0 && grades.length === 0 && (
            <div className="text-center py-8 bg-yellow-50 border-t border-yellow-100">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-yellow-700">Aucune note enregistrée pour cette période</p>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      {selectedClass && selectedPeriod && grades.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Légende des couleurs</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-100 border border-green-300"></span>
              Excellent (16-20)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-50 border border-green-200"></span>
              Bien (14-16)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-yellow-50 border border-yellow-300"></span>
              Passable (10-14)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-orange-50 border border-orange-300"></span>
              Insuffisant (8-10)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-100 border border-red-300"></span>
              Faible (&lt;8)
            </span>
          </div>
        </div>
      )}

      {/* Instructions when nothing selected */}
      {!selectedClass || !selectedPeriod ? (
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h3 className="text-lg font-medium text-blue-800 mb-2">Sélectionnez une classe et une période</h3>
          <p className="text-blue-600">
            Choisissez une classe et une période pour afficher le tableau des notes complet.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default GradesPage;
