/**
 * Reports & Analytics Page
 * Generate and view various reports
 */

import { useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  FileText,
  Users,
  BookOpen,
  Award,
  Calendar,
  Filter,
  RefreshCw,
} from 'lucide-react';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  const reportTypes = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'students', label: 'Étudiants', icon: Users },
    { id: 'grades', label: 'Notes & Résultats', icon: Award },
    { id: 'attendance', label: 'Présences', icon: Calendar },
    { id: 'courses', label: 'Cours', icon: BookOpen },
    { id: 'financial', label: 'Financier', icon: TrendingUp },
  ];

  const kpis = [
    { label: 'Taux de réussite', value: '78%', change: '+5%', trend: 'up', color: 'green' },
    { label: 'Taux de présence', value: '92%', change: '+2%', trend: 'up', color: 'blue' },
    { label: 'Note moyenne', value: '14.5/20', change: '+0.8', trend: 'up', color: 'purple' },
    { label: 'Étudiants actifs', value: '1,250', change: '+50', trend: 'up', color: 'orange' },
  ];

  const recentReports = [
    { id: 1, name: 'Rapport mensuel - Novembre 2024', type: 'PDF', date: '2024-12-01', size: '2.4 MB' },
    { id: 2, name: 'Analyse des notes Q3', type: 'Excel', date: '2024-11-15', size: '1.8 MB' },
    { id: 3, name: 'Rapport de présences', type: 'PDF', date: '2024-11-10', size: '856 KB' },
    { id: 4, name: 'Performance par matière', type: 'PDF', date: '2024-11-05', size: '1.2 MB' },
  ];

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {reportTypes.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedReport === report.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <report.icon className="w-4 h-4" />
              {report.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
            <option value="custom">Personnalisé</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Plus de filtres
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{kpi.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                kpi.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance par matière</h3>
          <div className="space-y-4">
            {[
              { subject: 'Mathématiques', score: 75, color: '#3B82F6' },
              { subject: 'Physique', score: 68, color: '#8B5CF6' },
              { subject: 'Français', score: 82, color: '#10B981' },
              { subject: 'Anglais', score: 79, color: '#F59E0B' },
              { subject: 'Histoire', score: 71, color: '#EF4444' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.subject}</span>
                  <span className="font-medium">{item.score}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribution des notes</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="75 251.2" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray="50 251.2" strokeDashoffset="-75" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="40 251.2" strokeDashoffset="-125" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray="35 251.2" strokeDashoffset="-165" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">1,250</p>
                  <p className="text-sm text-gray-500">Étudiants</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {[
              { label: 'Excellent (16+)', color: '#10B981', count: 312 },
              { label: 'Bien (14-16)', color: '#3B82F6', count: 438 },
              { label: 'Passable (10-14)', color: '#F59E0B', count: 350 },
              { label: 'Insuffisant (<10)', color: '#EF4444', count: 150 },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.label} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Rapports récents</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">Voir tout</button>
        </div>
        <div className="space-y-3">
          {recentReports.map(report => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  report.type === 'PDF' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <FileText className={`w-5 h-5 ${report.type === 'PDF' ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{report.name}</p>
                  <p className="text-sm text-gray-500">{report.date} • {report.size}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-white rounded-lg">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
