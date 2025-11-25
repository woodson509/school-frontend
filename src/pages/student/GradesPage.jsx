/**
 * Student Grades Page
 * View all grades and academic performance
 */

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  Filter,
  Download,
  ChevronDown,
} from 'lucide-react';

const StudentGradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [expandedSubject, setExpandedSubject] = useState(null);

  useEffect(() => {
    const sampleGrades = {
      subjects: [
        {
          name: 'Mathématiques',
          code: 'MATH-301',
          teacher: 'M. Dupont',
          average: 15.5,
          classAverage: 12.8,
          coefficient: 4,
          color: '#3B82F6',
          grades: [
            { id: 1, title: 'Contrôle intégrales', grade: 16, max: 20, date: '2024-12-10', type: 'Contrôle', coefficient: 2 },
            { id: 2, title: 'DM Dérivées', grade: 14, max: 20, date: '2024-11-28', type: 'Devoir', coefficient: 1 },
            { id: 3, title: 'Interrogation', grade: 17, max: 20, date: '2024-11-15', type: 'Interro', coefficient: 1 },
            { id: 4, title: 'Contrôle limites', grade: 15, max: 20, date: '2024-10-20', type: 'Contrôle', coefficient: 2 },
          ],
        },
        {
          name: 'Physique',
          code: 'PHY-201',
          teacher: 'M. Bernard',
          average: 14.2,
          classAverage: 13.1,
          coefficient: 3,
          color: '#8B5CF6',
          grades: [
            { id: 5, title: 'TP Optique', grade: 15, max: 20, date: '2024-12-08', type: 'TP', coefficient: 1 },
            { id: 6, title: 'Contrôle mécanique', grade: 13, max: 20, date: '2024-11-25', type: 'Contrôle', coefficient: 2 },
            { id: 7, title: 'QCM', grade: 16, max: 20, date: '2024-11-10', type: 'QCM', coefficient: 1 },
          ],
        },
        {
          name: 'Français',
          code: 'FR-101',
          teacher: 'Mme Martin',
          average: 13.8,
          classAverage: 12.5,
          coefficient: 4,
          color: '#EF4444',
          grades: [
            { id: 8, title: 'Dissertation', grade: 14, max: 20, date: '2024-12-05', type: 'Devoir', coefficient: 2 },
            { id: 9, title: 'Commentaire', grade: 13, max: 20, date: '2024-11-20', type: 'Devoir', coefficient: 2 },
            { id: 10, title: 'Oral', grade: 15, max: 20, date: '2024-11-05', type: 'Oral', coefficient: 1 },
          ],
        },
        {
          name: 'Anglais',
          code: 'EN-301',
          teacher: 'Mme Petit',
          average: 16.5,
          classAverage: 13.2,
          coefficient: 2,
          color: '#F59E0B',
          grades: [
            { id: 11, title: 'Test vocabulaire', grade: 18, max: 20, date: '2024-12-12', type: 'Test', coefficient: 1 },
            { id: 12, title: 'Expression écrite', grade: 15, max: 20, date: '2024-11-28', type: 'Devoir', coefficient: 2 },
            { id: 13, title: 'Compréhension orale', grade: 17, max: 20, date: '2024-11-15', type: 'Test', coefficient: 1 },
          ],
        },
        {
          name: 'Histoire',
          code: 'HIST-202',
          teacher: 'M. Robert',
          average: 14.0,
          classAverage: 12.8,
          coefficient: 2,
          color: '#EC4899',
          grades: [
            { id: 14, title: 'Contrôle WWII', grade: 14, max: 20, date: '2024-12-01', type: 'Contrôle', coefficient: 2 },
            { id: 15, title: 'Exposé', grade: 16, max: 20, date: '2024-11-18', type: 'Oral', coefficient: 1 },
            { id: 16, title: 'QCM', grade: 12, max: 20, date: '2024-10-25', type: 'QCM', coefficient: 1 },
          ],
        },
        {
          name: 'Informatique',
          code: 'CS-101',
          teacher: 'Mme Moreau',
          average: 17.5,
          classAverage: 14.2,
          coefficient: 2,
          color: '#6366F1',
          grades: [
            { id: 17, title: 'Projet Python', grade: 18, max: 20, date: '2024-12-10', type: 'Projet', coefficient: 2 },
            { id: 18, title: 'QCM Algorithmes', grade: 17, max: 20, date: '2024-11-22', type: 'QCM', coefficient: 1 },
          ],
        },
      ],
      globalAverage: 15.2,
      classGlobalAverage: 13.1,
      rank: 5,
      totalStudents: 32,
      trimester: 'Trimestre 1',
    };
    
    setTimeout(() => {
      setGrades(sampleGrades);
      setLoading(false);
    }, 500);
  }, []);

  const getGradeColor = (grade, max = 20) => {
    const percentage = (grade / max) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = (average, classAverage) => {
    if (average >= classAverage + 2) return 'bg-green-500';
    if (average >= classAverage) return 'bg-blue-500';
    return 'bg-orange-500';
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
          <h1 className="text-2xl font-bold text-gray-800">Mes notes</h1>
          <p className="text-gray-500">{grades.trimester} • Année 2024-2025</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Toute l'année</option>
            <option value="t1">Trimestre 1</option>
            <option value="t2">Trimestre 2</option>
            <option value="t3">Trimestre 3</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Bulletin
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
          <p className="text-emerald-100 text-sm mb-1">Moyenne générale</p>
          <p className="text-4xl font-bold">{grades.globalAverage}/20</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-100">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+{(grades.globalAverage - grades.classGlobalAverage).toFixed(1)} vs classe</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Moyenne classe</p>
          <p className="text-3xl font-bold text-gray-800">{grades.classGlobalAverage}/20</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Classement</p>
          <p className="text-3xl font-bold text-gray-800">{grades.rank}<span className="text-lg text-gray-500">/{grades.totalStudents}</span></p>
          <div className="flex items-center gap-1 mt-1">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-500">Top {Math.round((grades.rank / grades.totalStudents) * 100)}%</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Meilleure matière</p>
          <p className="text-xl font-bold text-gray-800">Informatique</p>
          <p className="text-2xl font-bold text-emerald-600">17.5/20</p>
        </div>
      </div>

      {/* Grades by Subject */}
      <div className="space-y-4">
        {grades.subjects.map((subject) => (
          <div key={subject.code} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div
              className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedSubject(expandedSubject === subject.code ? null : subject.code)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <BarChart3 className="w-6 h-6" style={{ color: subject.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                      <span className="text-xs text-gray-500">Coef. {subject.coefficient}</span>
                    </div>
                    <p className="text-sm text-gray-500">{subject.teacher} • {subject.grades.length} notes</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: subject.color }}>
                      {subject.average.toFixed(1)}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      {subject.average > subject.classAverage ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-green-600">+{(subject.average - subject.classAverage).toFixed(1)}</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 text-red-500" />
                          <span className="text-red-600">{(subject.average - subject.classAverage).toFixed(1)}</span>
                        </>
                      )}
                      <span className="text-gray-400">vs {subject.classAverage}</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedSubject === subject.code ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressColor(subject.average, subject.classAverage)}`}
                    style={{ width: `${(subject.average / 20) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Expanded Grades */}
            {expandedSubject === subject.code && (
              <div className="border-t border-gray-100 p-5 bg-gray-50">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-3 font-medium">Évaluation</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Coef.</th>
                      <th className="pb-3 font-medium text-right">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subject.grades.map((grade) => (
                      <tr key={grade.id}>
                        <td className="py-3 font-medium text-gray-800">{grade.title}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                            {grade.type}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-500">{grade.date}</td>
                        <td className="py-3 text-sm text-gray-500">{grade.coefficient}</td>
                        <td className="py-3 text-right">
                          <span className={`px-3 py-1 rounded-full font-bold ${getGradeColor(grade.grade, grade.max)}`}>
                            {grade.grade}/{grade.max}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentGradesPage;
