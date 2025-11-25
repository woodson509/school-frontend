/**
 * Grades Management Page
 * View and manage student grades
 */

import { useState, useEffect } from 'react';
import {
  Award,
  Search,
  Download,
  Upload,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  BarChart,
  ChevronDown,
  Edit,
  Check,
  X,
} from 'lucide-react';

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [editingGrade, setEditingGrade] = useState(null);

  useEffect(() => {
    const sampleGrades = [
      { id: 1, student: 'Jean Pierre', class: '6ème A', subject: 'Mathématiques', exam: 'Examen Final', score: 85, maxScore: 100, date: '2024-12-15', status: 'published' },
      { id: 2, student: 'Marie Claire', class: '6ème A', subject: 'Mathématiques', exam: 'Examen Final', score: 78, maxScore: 100, date: '2024-12-15', status: 'published' },
      { id: 3, student: 'Paul Martin', class: '6ème A', subject: 'Physique', exam: 'Midterm', score: 72, maxScore: 80, date: '2024-12-10', status: 'published' },
      { id: 4, student: 'Sophie Durand', class: '6ème B', subject: 'Français', exam: 'Dissertation', score: 88, maxScore: 100, date: '2024-12-12', status: 'published' },
      { id: 5, student: 'Louis Bernard', class: '5ème A', subject: 'Anglais', exam: 'Oral', score: 45, maxScore: 50, date: '2024-12-08', status: 'pending' },
      { id: 6, student: 'Emma Petit', class: '5ème A', subject: 'Histoire', exam: 'QCM', score: null, maxScore: 40, date: '2024-12-14', status: 'pending' },
      { id: 7, student: 'Lucas Robert', class: '6ème A', subject: 'Informatique', exam: 'Quiz 3', score: 18, maxScore: 20, date: '2024-12-13', status: 'published' },
      { id: 8, student: 'Chloé Moreau', class: '6ème B', subject: 'Biologie', exam: 'TP Final', score: 82, maxScore: 100, date: '2024-12-11', status: 'published' },
    ];
    
    setTimeout(() => {
      setGrades(sampleGrades);
      setLoading(false);
    }, 500);
  }, []);

  const classes = ['all', '6ème A', '6ème B', '5ème A', '5ème B', '4ème A'];
  const subjects = ['all', 'Mathématiques', 'Physique', 'Français', 'Anglais', 'Histoire', 'Informatique', 'Biologie'];

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || grade.class === classFilter;
    const matchesSubject = subjectFilter === 'all' || grade.subject === subjectFilter;
    return matchesSearch && matchesClass && matchesSubject;
  });

  const avgScore = filteredGrades.filter(g => g.score !== null).length > 0
    ? Math.round(filteredGrades.filter(g => g.score !== null).reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / filteredGrades.filter(g => g.score !== null).length)
    : 0;

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const handleSaveGrade = (id, newScore) => {
    setGrades(grades.map(g => g.id === id ? { ...g, score: parseInt(newScore), status: 'published' } : g));
    setEditingGrade(null);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les classes</option>
            {classes.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les matières</option>
            {subjects.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            Importer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{filteredGrades.length}</p>
              <p className="text-sm text-gray-500">Notes total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{avgScore}%</p>
              <p className="text-sm text-gray-500">Moyenne générale</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {filteredGrades.filter(g => g.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <BarChart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {filteredGrades.filter(g => g.score !== null && (g.score / g.maxScore) >= 0.6).length}
              </p>
              <p className="text-sm text-gray-500">Réussites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Étudiant</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Classe</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Matière</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Examen</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Note</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGrades.map((grade) => (
              <tr key={grade.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {grade.student.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">{grade.student}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{grade.class}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{grade.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{grade.exam}</td>
                <td className="px-6 py-4">
                  {editingGrade === grade.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={grade.score || ''}
                        max={grade.maxScore}
                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                        id={`grade-input-${grade.id}`}
                      />
                      <span className="text-gray-400">/ {grade.maxScore}</span>
                      <button
                        onClick={() => handleSaveGrade(grade.id, document.getElementById(`grade-input-${grade.id}`).value)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingGrade(null)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    grade.score !== null ? (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(grade.score, grade.maxScore)}`}>
                        {grade.score}/{grade.maxScore}
                      </span>
                    ) : (
                      <span className="text-gray-400">Non noté</span>
                    )
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{grade.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    grade.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {grade.status === 'published' ? 'Publié' : 'En attente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setEditingGrade(grade.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesPage;
