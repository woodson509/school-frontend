/**
 * Teacher Students Page
 * View and manage students
 */

import { useState } from 'react';
import { Users, Search, Filter, Mail, Phone, Download, Eye, TrendingUp } from 'lucide-react';

const TeacherStudentsPage = () => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    { id: 1, name: 'Jean Pierre', class: '6ème A', email: 'jean.p@example.com', phone: '+509 1234-5678', average: 15.5, attendance: 95, status: 'active' },
    { id: 2, name: 'Marie Claire', class: '6ème A', email: 'marie.c@example.com', phone: '+509 1234-5679', average: 16.2, attendance: 98, status: 'active' },
    { id: 3, name: 'Paul Martin', class: '6ème B', email: 'paul.m@example.com', phone: '+509 1234-5680', average: 13.8, attendance: 89, status: 'active' },
    { id: 4, name: 'Sophie Durand', class: '5ème A', email: 'sophie.d@example.com', phone: '+509 1234-5681', average: 17.1, attendance: 100, status: 'active' },
    { id: 5, name: 'Luc Bernard', class: '5ème B', email: 'luc.b@example.com', phone: '+509 1234-5682', average: 14.3, attendance: 92, status: 'active' },
  ];

  const classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème C'];

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'all' || s.class === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes étudiants</h1>
          <p className="text-gray-500">{filteredStudents.length} étudiants</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">Toutes les classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Moyenne</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Présence</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-gray-800">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {student.class}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-gray-600">{student.email}</p>
                    <p className="text-gray-500">{student.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-lg font-semibold ${
                    student.average >= 16 ? 'text-green-600' :
                    student.average >= 14 ? 'text-blue-600' :
                    student.average >= 12 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {student.average}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.attendance >= 95 ? 'bg-green-100 text-green-700' :
                    student.attendance >= 90 ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {student.attendance}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir le profil">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Envoyer un email">
                      <Mail className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir analytics">
                      <TrendingUp className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherStudentsPage;
