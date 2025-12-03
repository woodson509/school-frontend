/**
 * Reports Management Page
 * Generate and view report cards
 */

import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import ReportCardView from '../../components/ReportCardView';

const { reportCardAPI, classAPI, settingsAPI } = api;

const ReportsPage = () => {
  const [classes, setClasses] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [reportCards, setReportCards] = useState([]);
  const [selectedReportCard, setSelectedReportCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedPeriod) {
      fetchReportCards();
    } else {
      setReportCards([]);
    }
  }, [selectedClass, selectedPeriod]);

  const fetchInitialData = async () => {
    try {
      const [classesRes, periodsRes] = await Promise.all([
        classAPI.getAll(),
        settingsAPI.getReportPeriods()
      ]);
      if (classesRes.success) setClasses(classesRes.data);
      if (periodsRes.success) setPeriods(periodsRes.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchReportCards = async () => {
    try {
      setLoading(true);
      const res = await reportCardAPI.getAll({
        class_id: selectedClass,
        report_period_id: selectedPeriod
      });
      if (res.success) setReportCards(res.data);
    } catch (error) {
      console.error('Error fetching report cards:', error);
    } finally {
      setLoading(false);
    }
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
        fetchReportCards();
      }
    } catch (error) {
      alert('Erreur lors de la génération des bulletins');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleViewReportCard = async (id) => {
    try {
      const res = await reportCardAPI.getById(id);
      if (res.success) {
        setSelectedReportCard(res.data);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      alert('Erreur lors du chargement du bulletin');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Bulletins Scolaires</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Sélectionner une période</option>
              {periods.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.school_year})</option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={handleGenerate}
              disabled={!selectedClass || !selectedPeriod || generating}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${!selectedClass || !selectedPeriod || generating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Générer les Bulletins
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {selectedClass && selectedPeriod && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Bulletins ({reportCards.length})
            </h3>
            {reportCards.length > 0 && (
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Printer className="w-4 h-4" />
                Imprimer Tout
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : reportCards.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Aucun bulletin généré pour cette sélection.</p>
              <p className="text-sm mt-2">Cliquez sur "Générer" pour créer les bulletins.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rang</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moyenne</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportCards.map((card) => (
                    <tr key={card.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${card.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {card.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{card.student_name}</div>
                        <div className="text-sm text-gray-500">{card.student_code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-gray-900">{card.overall_average}</span>
                        <span className="text-xs text-gray-500">/20</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${card.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {card.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewReportCard(card.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Imprimer">
                          <Printer className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedReportCard && (
        <ReportCardView
          reportCard={selectedReportCard}
          onClose={() => setSelectedReportCard(null)}
        />
      )}
    </div>
  );
};

export default ReportsPage;
