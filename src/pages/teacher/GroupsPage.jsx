/**
 * Teacher Groups Page
 * Manage student work groups
 */

import { useState } from 'react';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

const TeacherGroupsPage = () => {
  const groups = [
    { id: 1, name: 'Groupe A - Intégrales', class: '6ème A', students: ['Jean Pierre', 'Marie Claire', 'Paul Martin'], project: 'Projet intégrales' },
    { id: 2, name: 'Groupe B - Dérivées', class: '6ème A', students: ['Sophie Durand', 'Luc Bernard'], project: 'Exposé dérivées' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Groupes de travail</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Nouveau groupe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map(group => (
          <div key={group.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{group.name}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{group.class}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Projet: {group.project}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Membres ({group.students.length})</p>
              <div className="flex flex-wrap gap-2">
                {group.students.map((student, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{student}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherGroupsPage;
