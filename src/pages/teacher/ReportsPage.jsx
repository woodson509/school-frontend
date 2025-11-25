/**
 * Teacher Reports Page
 * Generate and view reports
 */

import { useState } from 'react';
import { FileText, Download, TrendingUp, Users, Calendar } from 'lucide-react';

const TeacherReportsPage = () => {
  const reports = [
    { id: 1, title: 'Rapport trimestre 1 - 6ème A', type: 'Classe', date: '2024-12-15', status: 'ready' },
    { id: 2, title: 'Analyse des résultats', type: 'Performance', date: '2024-12-10', status: 'ready' },
    { id: 3, title: 'Rapport de présences', type: 'Assiduité', date: '2024-12-08', status: 'ready' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Rapports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left">
          <Users className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">Rapport de classe</h3>
          <p className="text-sm text-gray-500">Performance globale</p>
        </button>
        <button className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left">
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">Évolution</h3>
          <p className="text-sm text-gray-500">Progression étudiants</p>
        </button>
        <button className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left">
          <Calendar className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">Présences</h3>
          <p className="text-sm text-gray-500">Taux d'assiduité</p>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-800">Rapports récents</h3>
        </div>
        <div className="divide-y">
          {reports.map(report => (
            <div key={report.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-800">{report.title}</h4>
                  <p className="text-xs text-gray-500">{report.type} • {report.date}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Télécharger
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherReportsPage;
