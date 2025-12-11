/**
 * Teacher Subjects Page
 * View academic subjects/disciplines
 */

import { useState, useEffect } from 'react';
import {
    BookMarked,
    Search,
    BookOpen,
    Users,
    Clock
} from 'lucide-react';
import { subjectAPI } from '../../services/api';

const TeacherSubjectsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const response = await subjectAPI.getAll();
            if (response.success) {
                // Map API data to frontend format
                const mappedSubjects = response.data.map(subject => ({
                    ...subject,
                    color: subject.color || '#3B82F6' // Default color if not in DB
                }));
                setSubjects(mappedSubjects);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Matières</h1>
                    <p className="text-gray-500">Consultez la liste des matières enseignées</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une matière..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64"
                    />
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSubjects.map((subject) => (
                    <div
                        key={subject.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div
                            className="h-2"
                            style={{ backgroundColor: subject.color }}
                        ></div>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${subject.color}20` }}
                                >
                                    <BookMarked className="w-6 h-6" style={{ color: subject.color }} />
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-800 mb-1">{subject.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{subject.code}</p>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{subject.description}</p>

                            <div className="flex items-center justify-between text-sm">
                                {/* <span className="text-gray-500">{subject.courses || 0} cours</span> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherSubjectsPage;
