/**
 * Reports Management Page - Bulletins Scolaires
 * Vue pédagogique pour générer et visualiser les bulletins
 */

import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Eye,
  Printer,
  RefreshCw,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  BarChart2,
  Edit2
} from 'lucide-react';
import api from '../../services/api';

const { reportCardAPI, classAPI, settingsAPI, subjectAPI, userAPI } = api;

const ReportsPage = () => {
  const [classes, setClasses] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [reportCards, setReportCards] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedPeriod) {
      fetchData();
    } else {
      setReportCards([]);
      setStudents([]);
      setGrades([]);
    }
  }, [selectedClass, selectedPeriod]);

  const fetchInitialData = async () => {
    try {
      const [classesRes, periodsRes, subjectsRes] = await Promise.all([
        classAPI.getAll(),
        settingsAPI.getReportPeriods(),
        subjectAPI.getAll()
      ]);
      if (classesRes.success) setClasses(classesRes.data);
      if (periodsRes.success) setPeriods(periodsRes.data);
      if (subjectsRes.success) setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

      // Fetch students, grades, and existing report cards
      const [studentsRes, dumpResponse, reportCardsRes] = await Promise.all([
        userAPI.getAll({ role: 'student', class_id: selectedClass }),
        fetch(`${API_BASE}/debug/dump-grades`),
        reportCardAPI.getAll({ class_id: selectedClass, report_period_id: selectedPeriod })
      ]);

      const dumpData = await dumpResponse.json();
      const filteredGrades = dumpData.filter(g => g.class_id === selectedClass);

      if (studentsRes.success) setStudents(studentsRes.data);
      setGrades(filteredGrades);
      if (reportCardsRes.success) setReportCards(reportCardsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique subjects from grades
  const gradedSubjects = [...new Set(grades.map(g => g.subject_id))]
    .map(subjectId => subjects.find(s => s.id === subjectId))
    .filter(Boolean);

  // Build comprehensive student data
  const studentBulletins = students.map(student => {
    const studentGrades = grades.filter(g => g.student_id === student.id);

    // Calculate average per subject
    const subjectDetails = gradedSubjects.map(subject => {
      const subjectGrades = studentGrades.filter(g => g.subject_id === subject.id);
      if (subjectGrades.length > 0) {
        const total = subjectGrades.reduce((sum, g) => {
          const value = parseFloat(g.value) || 0;
          const maxValue = parseFloat(g.max_value) || 20;
          return sum + (value / maxValue * 20);
        }, 0);
        return {
          subject,
          average: (total / subjectGrades.length).toFixed(2),
          gradeCount: subjectGrades.length
        };
      }
      return { subject, average: null, gradeCount: 0 };
    });

    // Calculate overall average
    const validAverages = subjectDetails.filter(s => s.average !== null).map(s => parseFloat(s.average));
    const overallAverage = validAverages.length > 0
      ? (validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(2)
      : null;

    return {
      student,
      subjectDetails,
      overallAverage,
      totalGrades: studentGrades.length
    };
  });

  // Sort by average and add ranks
  const sortedBulletins = [...studentBulletins]
    .sort((a, b) => {
      if (a.overallAverage === null) return 1;
      if (b.overallAverage === null) return -1;
      return parseFloat(b.overallAverage) - parseFloat(a.overallAverage);
    })
    .map((bulletin, index) => ({
      ...bulletin,
      rank: index + 1
    }));

  // Class statistics
  const classStats = {
    totalStudents: students.length,
    studentsWithGrades: studentBulletins.filter(s => s.overallAverage).length,
    classAverage: studentBulletins.filter(s => s.overallAverage).length > 0
      ? (studentBulletins.filter(s => s.overallAverage).reduce((sum, s) => sum + parseFloat(s.overallAverage), 0) / studentBulletins.filter(s => s.overallAverage).length).toFixed(2)
      : '0.00',
    passingStudents: studentBulletins.filter(s => s.overallAverage && parseFloat(s.overallAverage) >= 10).length,
    failingStudents: studentBulletins.filter(s => s.overallAverage && parseFloat(s.overallAverage) < 10).length
  };

  const handleGenerate = async () => {
    if (!selectedClass || !selectedPeriod) return;

    if (!window.confirm('Voulez-vous générer les bulletins pour cette classe ? Cela écrasera les bulletins existants pour cette période.')) {
      return;
    }

    try {
      setGenerating(true);
      const res = await reportCardAPI.generate({
        class_id: selectedClass,
        report_period_id: selectedPeriod
      });

      if (res.success) {
        alert(`Succès ! ${res.data.generated_count} bulletins générés.`);
        fetchData();
      }
    } catch (error) {
      alert('Erreur lors de la génération des bulletins');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const getGradeColor = (value) => {
    if (value === null) return 'text-gray-400 bg-gray-50';
    const numValue = parseFloat(value);
    if (numValue >= 16) return 'text-green-700 bg-green-100 font-bold';
    if (numValue >= 14) return 'text-green-600 bg-green-50';
    if (numValue >= 10) return 'text-yellow-700 bg-yellow-50';
    if (numValue >= 8) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-100';
  };

  const getAppreciation = (average) => {
    if (average === null) return '-';
    const num = parseFloat(average);
    if (num >= 18) return 'Excellent';
    if (num >= 16) return 'Très Bien';
    if (num >= 14) return 'Bien';
    if (num >= 12) return 'Assez Bien';
    if (num >= 10) return 'Passable';
    if (num >= 8) return 'Insuffisant';
    return 'Très Insuffisant';
  };

  const selectedClassName = classes.find(c => c.id === selectedClass)?.name || '';
  const selectedPeriodName = periods.find(p => p.id === selectedPeriod)?.name || '';

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
          <h1 className="text-2xl font-bold text-gray-800">📋 Bulletins Scolaires</h1>
          <p className="text-gray-500 mt-1">Génération et visualisation des bulletins</p>
        </div>
        {selectedClass && selectedPeriod && (
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {generating ? 'Génération...' : 'Générer les Bulletins'}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Users className="w-4 h-4" />
              Élèves
            </div>
            <div className="text-2xl font-bold text-gray-800">{classStats.totalStudents}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <FileText className="w-4 h-4" />
              Avec notes
            </div>
            <div className="text-2xl font-bold text-gray-800">{classStats.studentsWithGrades}</div>
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
              <CheckCircle className="w-4 h-4" />
              Admis (≥10)
            </div>
            <div className="text-2xl font-bold text-green-700">{classStats.passingStudents}</div>
          </div>

          <div className="bg-red-50 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-red-500 text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              Rattrapage
            </div>
            <div className="text-2xl font-bold text-red-600">{classStats.failingStudents}</div>
          </div>
        </div>
      )}

      {/* Bulletins List */}
      {selectedClass && selectedPeriod && !selectedStudent && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <h3 className="font-semibold text-white text-lg">
              📊 Bulletins - {selectedClassName} | {selectedPeriodName}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rang</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Élève</th>
                  {gradedSubjects.slice(0, 6).map(subject => (
                    <th key={subject.id} className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                      {subject.name?.substring(0, 8)}...
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase bg-blue-50">Moyenne</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Appréciation</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedBulletins.map((bulletin) => {
                  const isPassing = bulletin.overallAverage && parseFloat(bulletin.overallAverage) >= 10;

                  return (
                    <tr key={bulletin.student.id} className="hover:bg-gray-50 transition-colors">
                      {/* Rank */}
                      <td className="px-4 py-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                          ${bulletin.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                            bulletin.rank === 2 ? 'bg-gray-300 text-gray-700' :
                              bulletin.rank === 3 ? 'bg-orange-300 text-orange-900' :
                                'bg-gray-100 text-gray-600'}`}>
                          {bulletin.rank}
                        </div>
                      </td>

                      {/* Student Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                            {bulletin.student.full_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{bulletin.student.full_name}</div>
                            <div className="text-xs text-gray-500">{bulletin.totalGrades} notes</div>
                          </div>
                        </div>
                      </td>

                      {/* Subject Averages (first 6) */}
                      {gradedSubjects.slice(0, 6).map(subject => {
                        const detail = bulletin.subjectDetails.find(d => d.subject.id === subject.id);
                        return (
                          <td key={subject.id} className="px-3 py-3 text-center">
                            <span className={`inline-block px-2 py-1 rounded text-sm ${getGradeColor(detail?.average)}`}>
                              {detail?.average || '-'}
                            </span>
                          </td>
                        );
                      })}

                      {/* Overall Average */}
                      <td className="px-4 py-3 text-center bg-blue-50">
                        <span className={`inline-block px-3 py-1 rounded-lg text-lg font-bold ${getGradeColor(bulletin.overallAverage)}`}>
                          {bulletin.overallAverage || '-'}
                        </span>
                      </td>

                      {/* Appreciation */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isPassing ? 'bg-green-100 text-green-700' : bulletin.overallAverage ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {getAppreciation(bulletin.overallAverage)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedStudent(bulletin)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="Voir le bulletin détaillé"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {sortedBulletins.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun élève dans cette classe</p>
            </div>
          )}
        </div>
      )}

      {/* Individual Bulletin Detail View */}
      {selectedStudent && (
        <BulletinDetail
          bulletin={selectedStudent}
          className={selectedClassName}
          periodName={selectedPeriodName}
          classStats={classStats}
          onClose={() => setSelectedStudent(null)}
          getGradeColor={getGradeColor}
          getAppreciation={getAppreciation}
        />
      )}

      {/* Instructions */}
      {(!selectedClass || !selectedPeriod) && (
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h3 className="text-lg font-medium text-blue-800 mb-2">Sélectionnez une classe et une période</h3>
          <p className="text-blue-600">
            Choisissez une classe et une période pour afficher ou générer les bulletins scolaires.
          </p>
        </div>
      )}
    </div>
  );
};

// Individual Bulletin Detail Component with Grade Editing
const BulletinDetail = ({ bulletin, className, periodName, classStats, onClose, getGradeColor, getAppreciation }) => {
  const { student, subjectDetails, overallAverage, rank, totalGrades } = bulletin;
  const isPassing = overallAverage && parseFloat(overallAverage) >= 10;
  const [editMode, setEditMode] = useState(false);
  const [editingGrades, setEditingGrades] = useState({});
  const [saving, setSaving] = useState(false);

  const handleGradeChange = (subjectId, value) => {
    setEditingGrades(prev => ({ ...prev, [subjectId]: value }));
  };

  const handleSaveGrades = async () => {
    try {
      setSaving(true);
      const { gradesAPI } = api;

      // For each modified grade, update it
      for (const [subjectId, newValue] of Object.entries(editingGrades)) {
        const detail = subjectDetails.find(d => d.subject.id === subjectId);
        if (detail && detail.gradeId) {
          await gradesAPI.updateGrade(detail.gradeId, { value: parseFloat(newValue) });
        }
      }

      alert('Notes mises à jour avec succès !');
      setEditMode(false);
      setEditingGrades({});
      onClose(); // Close to refresh data
    } catch (error) {
      console.error('Error updating grades:', error);
      alert('Erreur lors de la mise à jour des notes');
    } finally {
      setSaving(false);
    }
  };

  const getDisplayValue = (detail) => {
    if (editingGrades[detail.subject.id] !== undefined) {
      return editingGrades[detail.subject.id];
    }
    return detail.average;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl font-bold">📋 Bulletin Scolaire</h2>
            <p className="text-blue-100 mt-1">{className} • {periodName}</p>
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <button
                  onClick={() => { setEditMode(false); setEditingGrades({}); }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
                <button
                  onClick={handleSaveGrades}
                  disabled={saving || Object.keys(editingGrades).length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {saving ? 'Sauvegarde...' : 'Enregistrer'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
                  title="Modifier les notes"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Edit Mode Banner */}
          {editMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Mode édition activé</p>
                <p className="text-sm text-yellow-600">Modifiez les notes ci-dessous puis cliquez sur Enregistrer</p>
              </div>
            </div>
          )}

          {/* Student Info */}
          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {student.full_name?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">{student.full_name}</h3>
              <p className="text-gray-500">{student.email || 'Email non renseigné'}</p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                {rank}<sup>{rank === 1 ? 'er' : 'ème'}</sup>
              </div>
              <p className="text-gray-500">sur {classStats.totalStudents} élèves</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${isPassing ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="text-sm text-gray-600 mb-1">Moyenne Générale</div>
              <div className={`text-3xl font-bold ${isPassing ? 'text-green-700' : 'text-red-700'}`}>
                {overallAverage || '-'}/20
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50">
              <div className="text-sm text-gray-600 mb-1">Moyenne de Classe</div>
              <div className="text-3xl font-bold text-blue-700">{classStats.classAverage}/20</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="text-sm text-gray-600 mb-1">Appréciation</div>
              <div className={`text-2xl font-bold ${isPassing ? 'text-green-700' : 'text-red-700'}`}>
                {getAppreciation(overallAverage)}
              </div>
            </div>
          </div>

          {/* Subjects Table with Edit Capability */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Matière</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Notes</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Moyenne {editMode && <span className="text-blue-600">(modifiable)</span>}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Appréciation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjectDetails.filter(d => d.average !== null).map((detail, index) => (
                  <tr key={index} className={`hover:bg-gray-50 ${editMode ? 'bg-yellow-50/30' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {detail.subject.name}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {detail.gradeCount} note{detail.gradeCount > 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editMode ? (
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={getDisplayValue(detail)}
                          onChange={(e) => handleGradeChange(detail.subject.id, e.target.value)}
                          className="w-20 px-2 py-1 text-center border-2 border-blue-400 rounded-lg font-bold focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className={`inline-block px-3 py-1 rounded-lg font-bold ${getGradeColor(detail.average)}`}>
                          {detail.average}/20
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 italic">
                      {getAppreciation(editingGrades[detail.subject.id] || detail.average)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Decision */}
          <div className={`p-6 rounded-xl text-center ${isPassing ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="text-lg font-medium text-gray-700 mb-2">Décision du Conseil de Classe</div>
            <div className={`text-3xl font-bold ${isPassing ? 'text-green-700' : 'text-red-700'}`}>
              {isPassing ? '✅ ADMIS(E)' : '⚠️ RATTRAPAGE / REDOUBLEMENT'}
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-8 pt-8 print:pt-4">
            <div className="text-center">
              <p className="font-medium text-gray-700 mb-12">Signature des Parents</p>
              <div className="border-t-2 border-gray-400 mx-8"></div>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700 mb-12">L'Enseignant(e)</p>
              <div className="border-t-2 border-gray-400 mx-8"></div>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700 mb-12">La Direction</p>
              <div className="border-t-2 border-gray-400 mx-8"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
            <p>Bulletin généré le {new Date().toLocaleDateString('fr-FR')} via School Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
