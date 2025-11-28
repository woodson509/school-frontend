/**
 * Lesson Form Modal
 * Modal for creating and editing lessons
 */

import { useState, useEffect } from 'react';
import { X, Save, Video, FileText, Link as LinkIcon } from 'lucide-react';

const LessonFormModal = ({ lesson, courseId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        video_url: '',
        duration_minutes: '',
        is_published: false,
        type: 'text'
    });

    useEffect(() => {
        if (lesson) {
            setFormData({
                title: lesson.title || '',
                description: lesson.description || '',
                content: lesson.content || '',
                video_url: lesson.video_url || '',
                duration_minutes: lesson.duration_minutes || '',
                is_published: lesson.is_published || false,
                type: lesson.type || 'text'
            });
        }
    }, [lesson]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            course_id: courseId,
            duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        {lesson ? 'Modifier la leçon' : 'Nouvelle leçon'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Titre de la leçon *
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: Introduction à l'algèbre"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description courte
                            </label>
                            <textarea
                                name="description"
                                rows="2"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Bref résumé du contenu..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type de contenu
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="text">Texte / Article</option>
                                <option value="video">Vidéo</option>
                                <option value="quiz">Quiz</option>
                                <option value="assignment">Devoir</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Durée estimée (minutes)
                            </label>
                            <input
                                type="number"
                                name="duration_minutes"
                                min="1"
                                value={formData.duration_minutes}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {formData.type === 'video' && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL de la vidéo (YouTube, Vimeo...)
                                </label>
                                <div className="relative">
                                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="url"
                                        name="video_url"
                                        value={formData.video_url}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>
                        )}

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contenu détaillé
                            </label>
                            <textarea
                                name="content"
                                rows="8"
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                placeholder="Contenu complet de la leçon (Markdown ou HTML supporté)..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Vous pourrez ajouter des fichiers joints après la création.
                            </p>
                        </div>

                        <div className="col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Publier immédiatement (visible par les étudiants)
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LessonFormModal;
