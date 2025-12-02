/**
 * School Settings Page
 * Manage grading scales, report periods, and subject coefficients
 */

import { useState, useEffect } from 'react';
import {
  Settings,
  Calendar,
  Award,
  BookOpen,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { settingsAPI, classAPI, subjectAPI } from '../../services/api';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('periods');
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Configuration de l'École</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('periods')}
          className={`pb-2 px-4 font-medium text-sm transition-colors ${activeTab === 'periods'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Périodes d'Évaluation
          </div>
        </button>
        <button
          onClick={() => setActiveTab('scales')}
          className={`pb-2 px-4 font-medium text-sm transition-colors ${activeTab === 'scales'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Échelles de Notation
          </div>
        </button>
        <button
          onClick={() => setActiveTab('coefficients')}
          className={`pb-2 px-4 font-medium text-sm transition-colors ${activeTab === 'coefficients'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Coefficients
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {activeTab === 'periods' && <ReportPeriodsSettings />}
        {activeTab === 'scales' && <GradingScalesSettings />}
        {activeTab === 'coefficients' && <CoefficientsSettings />}
      </div>
    </div>
  );
};

// Sub-components
const ReportPeriodsSettings = () => {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const res = await settingsAPI.getReportPeriods();
      if (res.success) setPeriods(res.data);
    } catch (error) {
      console.error('Error fetching periods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette période ?')) {
      try {
        await settingsAPI.deleteReportPeriod(id);
        fetchPeriods();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Périodes d'Évaluation</h3>
        <button
          onClick={() => {
            setEditingPeriod(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Période
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {periods.map((period) => (
                <tr key={period.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{period.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {period.period_type === 'trimester' ? 'Trimestre' :
                      period.period_type === 'semester' ? 'Semestre' : period.period_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{period.school_year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${period.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {period.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingPeriod(period);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(period.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <PeriodModal
          period={editingPeriod}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchPeriods();
          }}
        />
      )}
    </div>
  );
};

const PeriodModal = ({ period, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: period?.name || '',
    period_type: period?.period_type || 'trimester',
    school_year: period?.school_year || '2024-2025',
    start_date: period?.start_date?.split('T')[0] || '',
    end_date: period?.end_date?.split('T')[0] || '',
    is_active: period?.is_active ?? true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (period) {
        await settingsAPI.updateReportPeriod(period.id, formData);
      } else {
        await settingsAPI.createReportPeriod(formData);
      }
      onSuccess();
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {period ? 'Modifier la Période' : 'Nouvelle Période'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.period_type}
              onChange={(e) => setFormData({ ...formData, period_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="trimester">Trimestre</option>
              <option value="semester">Semestre</option>
              <option value="quarter">Bimestre</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Début</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Fin</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">Période active</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GradingScalesSettings = () => {
  const [scales, setScales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScales();
  }, []);

  const fetchScales = async () => {
    try {
      setLoading(true);
      const res = await settingsAPI.getGradingScales();
      if (res.success) setScales(res.data);
    } catch (error) {
      console.error('Error fetching scales:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Échelles de Notation</h3>
        <button
          onClick={() => alert('Fonctionnalité à venir')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Échelle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scales.map((scale) => (
          <div key={scale.id} className={`p-4 rounded-xl border-2 ${scale.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-900">{scale.name}</h4>
              {scale.is_default && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  Par défaut
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Maximum: <span className="font-medium">{scale.max_value}</span></p>
              <p>Minimum: <span className="font-medium">{scale.min_value}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CoefficientsSettings = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [coefficients, setCoefficients] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [classesRes, subjectsRes] = await Promise.all([
        classAPI.getAll(),
        subjectAPI.getAll()
      ]);
      if (classesRes.success) setClasses(classesRes.data);
      if (subjectsRes.success) setSubjects(subjectsRes.data);
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchCoefficients();
  }, [selectedClass]);

  const fetchCoefficients = async () => {
    setLoading(true);
    try {
      const res = await settingsAPI.getSubjectCoefficients({ class_id: selectedClass });
      if (res.success) {
        const coefMap = {};
        res.data.forEach(c => coefMap[c.subject_id] = c.coefficient);
        setCoefficients(coefMap);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoefficientChange = async (subjectId, value) => {
    try {
      await settingsAPI.setSubjectCoefficient({
        class_id: selectedClass,
        subject_id: subjectId,
        coefficient: value
      });
      setCoefficients(prev => ({ ...prev, [subjectId]: value }));
    } catch (error) {
      console.error('Error saving coefficient:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner une Classe</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Choisir une classe...</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matière</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coefficient</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.map(subject => (
                <tr key={subject.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{subject.name}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={coefficients[subject.id] || 1}
                      onChange={(e) => handleCoefficientChange(subject.id, e.target.value)}
                      className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
