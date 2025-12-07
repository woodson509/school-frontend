/**
 * Student Course Details Page
 * View course content, lessons, and assignments
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    FileText,
    Video,
    Calendar,
    CheckCircle,
    PlayCircle,
    Clock,
    Download
} from 'lucide-react';
import { courseAPI, lessonAPI, assignmentAPI, enrollmentAPI } from '../../services/api';

const StudentCourseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [enrollment, setEnrollment] = useState(null);
    const [activeTab, setActiveTab] = useState('lessons');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const [courseRes, lessonsRes, assignmentsRes, enrollmentRes] = await Promise.all([
                courseAPI.getById(id),
                lessonAPI.getByCourse(id),
                assignmentAPI.getByCourse(id),
                // Assuming we have an endpoint to get my enrollment for a specific course
                enrollmentAPI.getMyEnrollment(id)
            ]);

            if (courseRes.success) setCourse(courseRes.data);
            if (lessonsRes.success) {
                // Filter only published lessons for students
                setLessons(lessonsRes.data.filter(l => l.is_published));
            }
            if (assignmentsRes.success) {
                // Filter only published assignments for students
                setAssignments(assignmentsRes.data.filter(a => a.is_published));
            }
            if (enrollmentRes.success) setEnrollment(enrollmentRes.data);
        } catch (error) {
            console.error('Error fetching course details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800">Cours non trouvé</h2>
                <button
                    onClick={() => navigate('/courses')}
                    className="mt-4 text-emerald-600 hover:underline"
                >
                    Retour aux cours
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                {course.code}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                        <p className="text-gray-600 max-w-2xl">{course.description}</p>

                        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                {lessons.length} leçons
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {course.credits} crédits
                            </div>
                            {enrollment && (
                                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                    <TrendingUp className="w-4 h-4" />
                                    Progression: {enrollment.progress_percentage || 0}%
                                </div>
                            )}
                        </div>
                    </div>

                    {enrollment && (
                        <div className="w-full md:w-48 shrink-0">
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500 mb-1">Votre note actuelle</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {enrollment.current_grade ? `${enrollment.current_grade}%` : '-'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('lessons')}
                        className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'lessons' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Leçons & Contenu
                        {activeTab === 'lessons' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('assignments')}
                        className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'assignments' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Devoirs & Examens
                        {activeTab === 'assignments' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full" />
                        )}
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'lessons' && (
                    <div className="space-y-4">
                        {lessons.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">Aucune leçon disponible</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lessons.map((lesson, index) => (
                                    <div key={lesson.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all group cursor-pointer">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                        {lesson.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                                        {lesson.description || 'Pas de description'}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        {lesson.type === 'video' && (
                                                            <span className="flex items-center gap-1">
                                                                <Video className="w-3 h-3" /> Vidéo
                                                            </span>
                                                        )}
                                                        {lesson.duration_minutes && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> {lesson.duration_minutes} min
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                                                    Commencer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="space-y-4">
                        {assignments.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">Aucun devoir à faire</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {assignments.map((assignment) => (
                                    <div key={assignment.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                        {assignment.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                                        {assignment.description || 'Pas de description'}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            Pour le {new Date(assignment.due_date).toLocaleDateString()}
                                                        </span>
                                                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                                                            {assignment.points} points
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                                    Voir détails
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for icon
const TrendingUp = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default StudentCourseDetailsPage;
