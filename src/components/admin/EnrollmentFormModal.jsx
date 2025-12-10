/**
 * Enrollment Form Modal
 * Modal for enrolling students in a course
 */

import { useState, useEffect } from 'react';
import { X, UserPlus, Search } from 'lucide-react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const EnrollmentFormModal = ({ courseId, currentEnrollments, onClose, onSave }) => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    useEffect(() => {
        if (user?.school_id) {
            fetchStudents();
        }
    }, [user]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAll({ role: 'student', school_id: user.school_id });
            if (response.success) {
                // Filter out students already enrolled
                const enrolledIds = new Set(currentEnrollments.map(e => e.student_id));
                const availableStudents = response.data.filter(s => !enrolledIds.has(s.id));
                setStudents(availableStudents);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.student_id_number && student.student_id_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedStudentId) {
            onSave({
                course_id: courseId,
                student_id: selectedStudentId
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col relative z-[101]">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                        Inscrire un étudiant
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-hidden flex flex-col">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un étudiant..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                Aucun étudiant trouvé
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredStudents.map((student) => (
                                    <label
                                        key={student.id}
                                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedStudentId === student.id ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="student"
                                            value={student.id}
                                            checked={selectedStudentId === student.id}
                                            onChange={() => setSelectedStudentId(student.id)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{student.full_name}</p>
                                            <p className="text-sm text-gray-500">{student.email}</p>
                                        </div>
                                        {student.student_id_number && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {student.student_id_number}
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedStudentId}
                        className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-colors ${selectedStudentId
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        <UserPlus className="w-4 h-4" />
                        Inscrire
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentFormModal;
