/**
 * Student Badges Page
 * View earned badges and achievements
 */

import { useState, useEffect } from 'react';
import {
    Award,
    Star,
    Trophy,
    Medal,
    Calendar
} from 'lucide-react';
import api from '../../services/api';

const { badgeAPI } = api;

const StudentBadgesPage = () => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyBadges();
    }, []);

    const fetchMyBadges = async () => {
        try {
            setLoading(true);
            // Assuming there's an endpoint to get my badges or we filter from all
            // Ideally: const res = await badgeAPI.getMyBadges();
            // For now, we might need to fetch all and filter or use a specific endpoint if it exists
            // Let's assume badgeAPI.getMyBadges() exists or we add it to api.js
            const res = await badgeAPI.getMyBadges();
            if (res.success) setBadges(res.data);
        } catch (error) {
            console.error('Error fetching badges:', error);
        } finally {
            setLoading(false);
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mes Badges</h1>
                    <p className="text-gray-500">Vos réussites et récompenses</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-gray-800">{badges.length}</span>
                    <span className="text-gray-500">badges obtenus</span>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : badges.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Aucun badge pour le moment</h3>
                    <p className="text-gray-500 mt-1">Continuez vos efforts pour débloquer des récompenses !</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {badges.map((badge) => (
                        <div key={badge.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                            <div className="mb-4 p-4 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform duration-300">
                                {getIcon(badge.icon_url)}
                            </div>

                            <h3 className="font-bold text-gray-800 mb-2">{badge.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{badge.description}</p>

                            <div className="mt-auto w-full pt-4 border-t border-gray-50">
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>Obtenu le {new Date(badge.awarded_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentBadgesPage;
