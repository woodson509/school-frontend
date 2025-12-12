/**
 * Teacher Students Page
 * View and manage students
 */

import { useState, useEffect } from 'react';
import { Users, Search, Filter, Mail, Phone, Download, Eye, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, classAPI } from '../../services/api';

const TeacherStudentsPage = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, classesRes] = await Promise.all([
        userAPI.getAll({ role: 'student' }),
        classAPI.getAll()
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.data.map(s => ({
          id: s.id,
          name: s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || s.email,
          email: s.email,
          phone: s.phone || 'N/A',
          class: s.class_name || 'Non assigné',
          class_id: s.class_id,
          average: s.average || '--',
          attendance: s.attendance_rate || '--',
          status: s.status || 'active'
        })));
      }

      if (classesRes.success) {
        setClasses(classesRes.data.map(c => c.name));
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'all' || s.class === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                  <span className={`text-lg font-semibold ${student.average >= 16 ? 'text-green-600' :
                    student.average >= 14 ? 'text-blue-600' :
                      student.average >= 12 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                    {student.average}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.attendance >= 95 ? 'bg-green-100 text-green-700' :
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
