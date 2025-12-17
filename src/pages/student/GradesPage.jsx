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
import { useAuth } from '../../contexts/AuthContext';
import { gradeAPI } from '../../services/api';

const StudentGradesPage = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState({ subjects: [], globalAverage: 0, classGlobalAverage: 0, rank: 0, totalStudents: 0, trimester: 'Année courante' });
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [expandedSubject, setExpandedSubject] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const response = await gradeAPI.getAll({ student_id: user.id });
        const data = response.data || [];

        // Process grades
        const subjectsMap = {};
        const colors = ['#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#EC4899', '#10B981', '#6366F1'];
        let colorIndex = 0;

        data.forEach(g => {
          const subjName = g.subject_name || 'Matière Inconnue';
          if (!subjectsMap[subjName]) {
            subjectsMap[subjName] = {
              name: subjName,
              code: g.subject_id,
              teacher: g.recorded_by_name || 'N/A',
              average: 0,
              classAverage: 0, // Not available yet
              coefficient: 1, // Default
              color: colors[colorIndex % colors.length],
              grades: []
            };
            colorIndex++;
          }

          subjectsMap[subjName].grades.push({
            id: g.id,
            title: g.exam_title || g.grade_type || 'Note', // 'notes' field is description usually
            notes: g.notes,
            grade: parseFloat(g.value),
            max: parseFloat(g.max_value),
            date: new Date(g.created_at).toLocaleDateString(),
            type: g.grade_type,
            coefficient: parseFloat(g.weight || 1)
          });
        });

        // Calculate averages
        const subjects = Object.values(subjectsMap).map(subj => {
          let totalScore = 0;
          let totalWeight = 0;

          subj.grades.forEach(g => {
            const normalizedScore = (g.grade / g.max) * 20; // Normalize to 20
            totalScore += normalizedScore * g.coefficient;
            totalWeight += g.coefficient;
          });

          subj.average = totalWeight > 0 ? (totalScore / totalWeight) : 0;
          return subj;
        });

        // Global Average
        let globalTotal = 0;
        let globalWeight = 0;
        subjects.forEach(s => {
          globalTotal += s.average; // Simplification: assuming coef 1 for subjects for now as we don't have subject coefs in this query
          globalWeight += 1;
        });

        const globalAverage = globalWeight > 0 ? (globalTotal / globalWeight) : 0;

        setGrades({
          subjects,
          globalAverage: parseFloat(globalAverage.toFixed(2)),
          classGlobalAverage: 0, // Placeholder
          rank: 0, // Placeholder
          totalStudents: 0,
          trimester: 'Année 2024-2025'
        });

      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user]);

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
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSubject === subject.code ? 'rotate-180' : ''
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
