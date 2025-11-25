/**
 * Teacher Grades Entry Page
 * Enter and manage grades
 */

import { useState } from 'react';
import { Save, Download, Users } from 'lucide-react';

const TeacherGradesPage = () => {
  const [selectedClass, setSelectedClass] = useState('6ème A');
  const [selectedEval, setSelectedEval] = useState('Contrôle Ch.5');
  
  const [students, setStudents] = useState([
    { id: 1, name: 'Jean Pierre', grade: 15.5 },
    { id: 2, name: 'Marie Claire', grade: 16.5 },
    { id: 3, name: 'Paul Martin', grade: 12.0 },
    { id: 4, name: 'Sophie Durand', grade: 17.5 },
  ]);

  const updateGrade = (id, grade) => {
    setStudents(students.map(s => s.id === id ? {...s, grade: parseFloat(grade)} : s));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Saisie des notes</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
              <option>6ème A</option>
              <option>5ème B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Évaluation</label>
            <select value={selectedEval} onChange={(e) => setSelectedEval(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
              <option>Contrôle Ch.5</option>
              <option>Devoir Maison 3</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Note /20</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commentaire</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-gray-800">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={student.grade}
                    onChange={(e) => updateGrade(student.id, e.target.value)}
                    className="w-24 px-3 py-2 text-center border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    placeholder="Ajouter un commentaire..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherGradesPage;
