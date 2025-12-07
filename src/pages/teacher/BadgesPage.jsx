/**
 * Teacher Badges Page
 * Award badges to students
 */

import { useState, useEffect } from 'react';
import {
    UserCheck,
    Star,
    Trophy,
    Medal
} from 'lucide-react';
import api from '../../services/api';

const { badgeAPI, classAPI } = api;

const TeacherBadgesPage = () => {
    const [badges, setBadges] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAwardModal, setShowAwardModal] = useState(false);

    // Award Form State
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');

    useEffect(() => {
        fetchBadges();
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents(selectedClass);
        }
    }, [selectedClass]);

    const fetchBadges = async () => {
        try {
            setLoading(true);
            const res = await badgeAPI.getAll();
            if (res.success) setBadges(res.data);
        } catch (error) {
            console.error('Error fetching badges:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await classAPI.getAll();
            if (res.success) setClasses(res.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchStudents = async (classId) => {
        try {
            const res = await classAPI.getStudents(classId);
            if (res.success) setStudents(res.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleAwardBadge = async (e) => {
        e.preventDefault();
        if (!selectedBadge || !selectedStudent) return;

        try {
            const res = await badgeAPI.award({
                student_id: selectedStudent,
                badge_id: selectedBadge.id
            });
            if (res.success) {
                setShowAwardModal(false);
                setSelectedStudent('');
                alert('Badge attribué avec succès !');
            }
        } catch (error) {
            console.error('Error awarding badge:', error);
            alert(error.message || 'Erreur lors de l\'attribution');
        }
    };

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'trophy': return <Trophy className="w-8 h-8 text-yellow-500" />;
            case 'medal': return <Medal className="w-8 h-8 text-blue-500" />;
            default: return <Star className="w-8 h-8 text-yellow-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Attribution de Badges</h1>
            </div>

            {/* Badges Grid */}
            {loading ? (
                <div className="text-center py-12">Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {badges.map((badge) => (
                        <div key={badge.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="mb-4 p-3 bg-gray-50 rounded-full">
                                {getIcon(badge.icon_url)}
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">{badge.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{badge.description}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium mb-4 ${badge.badge_type === 'academic' ? 'bg-blue-100 text-blue-800' :
                                badge.badge_type === 'behavior' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                }`}>
                                {badge.badge_type}
                            </span>
                            <button
                                onClick={() => {
                                    setSelectedBadge(badge);
                                    setShowAwardModal(true);
                                }}
                                className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
                            >
                                <UserCheck className="w-4 h-4" />
                                Attribuer
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Award Modal */}
            {showAwardModal && selectedBadge && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Attribuer: {selectedBadge.name}</h2>
                        <form onSubmit={handleAwardBadge} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Sélectionner une classe</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Élève</label>
                                <select
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    disabled={!selectedClass}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Sélectionner un élève</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.full_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAwardModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedStudent}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                                >
                                    Attribuer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherBadgesPage;
