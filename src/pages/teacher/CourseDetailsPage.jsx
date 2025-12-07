/**
 * Teacher Course Details Page
 * Comprehensive view of a course including lessons, students, and assignments
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Users,
    FileText,
    Plus,
    Edit,
    Trash2,
    Video,
    Calendar,
    CheckCircle,
    UserPlus
} from 'lucide-react';
import { courseAPI, lessonAPI, enrollmentAPI, assignmentAPI } from '../../services/api';
import LessonFormModal from '../../components/admin/LessonFormModal';
import EnrollmentFormModal from '../../components/admin/EnrollmentFormModal';
import CourseFormModal from '../../components/admin/CourseFormModal';
import AssignmentFormModal from '../../components/admin/AssignmentFormModal';

const TeacherCourseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [activeTab, setActiveTab] = useState('lessons');
    const [loading, setLoading] = useState(true);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [editingAssignment, setEditingAssignment] = useState(null);

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const [courseRes, lessonsRes, enrollmentsRes, assignmentsRes] = await Promise.all([
                courseAPI.getById(id),
                lessonAPI.getByCourse(id),
                enrollmentAPI.getByCourse(id),
                assignmentAPI.getByCourse(id)
            ]);

            if (courseRes.success) setCourse(courseRes.data);
            if (lessonsRes.success) setLessons(lessonsRes.data);
            if (enrollmentsRes.success) setEnrollments(enrollmentsRes.data);
            if (assignmentsRes.success) setAssignments(assignmentsRes.data);
        } catch (error) {
            console.error('Error fetching course details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLesson = async (lessonData) => {
        try {
            if (editingLesson) {
                const response = await lessonAPI.update(editingLesson.id, lessonData);
                if (response.success) {
                    setLessons(lessons.map(l => l.id === editingLesson.id ? response.data : l));
                }
            } else {
                const response = await lessonAPI.create(lessonData);
                if (response.success) {
                    setLessons([...lessons, response.data]);
                }
            }
            setShowLessonModal(false);
            setEditingLesson(null);
        } catch (error) {
            console.error('Error saving lesson:', error);
            alert('Erreur lors de l\'enregistrement de la leçon');
        }
    };

    const handleSaveEnrollment = async (enrollmentData) => {
        try {
            const response = await enrollmentAPI.enroll(enrollmentData);
            if (response.success) {
                const enrollmentsRes = await enrollmentAPI.getByCourse(id);
                if (enrollmentsRes.success) setEnrollments(enrollmentsRes.data);
                setShowEnrollModal(false);
            }
        } catch (error) {
            console.error('Error enrolling student:', error);
            alert('Erreur lors de l\'inscription: ' + error.message);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
            try {
                await lessonAPI.delete(lessonId);
                setLessons(lessons.filter(l => l.id !== lessonId));
            } catch (error) {
                console.error('Error deleting lesson:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleUnenroll = async (enrollmentId) => {
        if (confirm('Retirer cet étudiant du cours ?')) {
            try {
                await enrollmentAPI.unenroll(enrollmentId);
                setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
            } catch (error) {
                console.error('Error unenrolling student:', error);
                alert('Erreur lors de la désinscription');
            }
        }
    };

    const handleSaveCourse = async (courseData) => {
        try {
            const response = await courseAPI.update(id, courseData);
            if (response.success) {
                setCourse(response.data);
                setShowEditCourseModal(false);
            }
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Erreur lors de la mise à jour du cours');
        }
    };

    const handleSaveAssignment = async (assignmentData) => {
        try {
            if (editingAssignment) {
                const response = await assignmentAPI.update(editingAssignment.id, assignmentData);
                if (response.success) {
                    setAssignments(assignments.map(a => a.id === editingAssignment.id ? response.data : a));
                }
            } else {
                const response = await assignmentAPI.create(assignmentData);
                if (response.success) {
                    setAssignments([...assignments, response.data]);
                }
            }
            setShowAssignmentModal(false);
            setEditingAssignment(null);
        } catch (error) {
            console.error('Error saving assignment:', error);
            alert('Erreur lors de l\'enregistrement du devoir');
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) {
            try {
                await assignmentAPI.delete(assignmentId);
                setAssignments(assignments.filter(a => a.id !== assignmentId));
            } catch (error) {
                console.error('Error deleting assignment:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800">Cours non trouvé</h2>
                <button
                    onClick={() => navigate('/courses')}
                    className="mt-4 text-indigo-600 hover:underline"
                >
                    Retour aux cours
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                {course.code}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {course.is_active ? 'Actif' : 'Inactif'}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                        <p className="text-gray-600 max-w-2xl">{course.description}</p>

                        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {enrollments.length} étudiants
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                {lessons.length} leçons
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {course.credits} crédits
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setShowEditCourseModal(true)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 justify-center"
                        >
                            <Edit className="w-4 h-4" />
                            Modifier
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('lessons')}
                        className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'lessons' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Leçons & Contenu
                        {activeTab === 'lessons' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'students' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Étudiants Inscrits
                        <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                            {enrollments.length}
                        </span>
                        {activeTab === 'students' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('assignments')}
                        className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'assignments' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Devoirs & Examens
                        {activeTab === 'assignments' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                        )}
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'lessons' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Programme du cours</h3>
                            <button
                                onClick={() => setShowLessonModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Ajouter une leçon
                            </button>
                        </div>

                        {lessons.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">Aucune leçon pour le moment</p>
                                <p className="text-sm text-gray-400 mb-4">Commencez par ajouter du contenu pédagogique</p>
                                <button
                                    onClick={() => setShowLessonModal(true)}
                                    className="text-indigo-600 hover:underline text-sm"
                                >
                                    Créer la première leçon
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lessons.map((lesson, index) => (
                                    <div key={lesson.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
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
                                                                <Calendar className="w-3 h-3" /> {lesson.duration_minutes} min
                                                            </span>
                                                        )}
                                                        <span className={`px-2 py-0.5 rounded-full ${lesson.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {lesson.is_published ? 'Publié' : 'Brouillon'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingLesson(lesson);
                                                        setShowLessonModal(true);
                                                    }}
                                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLesson(lesson.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Étudiants inscrits</h3>
                            <button
                                onClick={() => setShowEnrollModal(true)}
                                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-2 text-sm"
                            >
                                <UserPlus className="w-4 h-4" />
                                Inscrire un étudiant
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Étudiant</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date d'inscription</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progression</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Note finale</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {enrollments.map((enrollment) => (
                                        <tr key={enrollment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                                                        {enrollment.student_name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{enrollment.student_name}</p>
                                                        <p className="text-xs text-gray-500">{enrollment.student_email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                    <div
                                                        className="bg-indigo-600 h-2 rounded-full"
                                                        style={{ width: `${enrollment.progress_percentage || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1 block">
                                                    {enrollment.progress_percentage || 0}% complété
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {enrollment.final_grade ? `${enrollment.final_grade}/100` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleUnenroll(enrollment.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm hover:underline"
                                                >
                                                    Désinscrire
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {enrollments.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                Aucun étudiant inscrit pour le moment
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Devoirs & Examens</h3>
                            <button
                                onClick={() => { setEditingAssignment(null); setShowAssignmentModal(true); }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Créer un devoir
                            </button>
                        </div>

                        {assignments.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">Aucun devoir pour le moment</p>
                                <p className="text-sm text-gray-400 mb-4">Créez des évaluations pour vos étudiants</p>
                                <button
                                    onClick={() => { setEditingAssignment(null); setShowAssignmentModal(true); }}
                                    className="text-indigo-600 hover:underline text-sm"
                                >
                                    Créer le premier devoir
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {assignments.map((assignment) => (
                                    <div key={assignment.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
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
                                                        <span className={`px-2 py-0.5 rounded-full ${assignment.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {assignment.is_published ? 'Publié' : 'Brouillon'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingAssignment(assignment);
                                                        setShowAssignmentModal(true);
                                                    }}
                                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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

            {showLessonModal && (
                <LessonFormModal
                    lesson={editingLesson}
                    courseId={id}
                    onClose={() => {
                        setShowLessonModal(false);
                        setEditingLesson(null);
                    }}
                    onSave={handleSaveLesson}
                />
            )}

            {showEnrollModal && (
                <EnrollmentFormModal
                    courseId={id}
                    currentEnrollments={enrollments}
                    onClose={() => setShowEnrollModal(false)}
                    onSave={handleSaveEnrollment}
                />
            )}

            {showEditCourseModal && (
                <CourseFormModal
                    course={course}
                    onClose={() => setShowEditCourseModal(false)}
                    onSave={handleSaveCourse}
                />
            )}

            {showAssignmentModal && (
                <AssignmentFormModal
                    assignment={editingAssignment}
                    courseId={id}
                    onClose={() => {
                        setShowAssignmentModal(false);
                        setEditingAssignment(null);
                    }}
                    onSave={handleSaveAssignment}
                />
            )}
        </div>
    );
};

export default TeacherCourseDetailsPage;
