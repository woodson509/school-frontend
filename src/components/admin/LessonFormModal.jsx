/**
 * Lesson Form Modal
 * Modal for creating and editing lessons with Online & Attachment support
 */

import { useState, useEffect } from 'react';
import { X, Save, Video, Link as LinkIcon, Plus, Trash2, Calendar } from 'lucide-react';

const LessonFormModal = ({ lesson, courseId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        duration_minutes: '',
        is_published: false,
        type: 'text',
        is_online: false,
        meeting_link: '',
        attachments: [] // Array of { title: '', url: '' }
    });

    const [newAttachment, setNewAttachment] = useState({ title: '', url: '' });

    useEffect(() => {
        if (lesson) {
            let parsedAttachments = [];
            try {
                parsedAttachments = typeof lesson.attachments === 'string'
                    ? JSON.parse(lesson.attachments)
                    : (lesson.attachments || []);
            } catch (e) {
                parsedAttachments = [];
            }

            setFormData({
                title: lesson.title || '',
                description: lesson.description || '',
                content: lesson.content || '',
                duration_minutes: lesson.duration_minutes || '',
                is_published: lesson.is_published || false,
                type: lesson.type || 'text',
                is_online: lesson.is_online || false,
                meeting_link: lesson.meeting_link || '',
                attachments: Array.isArray(parsedAttachments) ? parsedAttachments : []
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

    const addAttachment = () => {
        if (newAttachment.title && newAttachment.url) {
            setFormData(prev => ({
                ...prev,
                attachments: [...prev.attachments, newAttachment]
            }));
            setNewAttachment({ title: '', url: '' });
        }
    };

    const removeAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            course_id: courseId,
            duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
            // Clean up empty attachments if any
            attachments: formData.attachments
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-[101]">
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
                    {/* General Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Titre de la leçon *
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder="Ex: Introduction au Chapitre 1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description courte
                            </label>
                            <textarea
                                name="description"
                                rows="2"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder="Bref résumé..."
                            />
                        </div>
                    </div>

                    {/* Online Class Option */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <label className="flex items-center gap-3 cursor-pointer mb-2">
                            <input
                                type="checkbox"
                                name="is_online"
                                checked={formData.is_online}
                                onChange={handleChange}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="font-semibold text-gray-800 flex items-center gap-2">
                                <Video className="w-4 h-4" />
                                Cours en ligne (Zoom / Google Meet)
                            </span>
                        </label>

                        {formData.is_online && (
                            <div className="mt-3 pl-8 animate-in slide-in-from-top-2 fade-in duration-200">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lien de la réunion
                                </label>
                                <input
                                    type="url"
                                    name="meeting_link"
                                    value={formData.meeting_link}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://zoom.us/j/..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Attachments Section - "Uploads" via Links */}
                    <div className="border-t border-gray-100 pt-4">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            Ressources & Documents
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">
                            Ajoutez des liens vers vos documents (Google Drive, Dropbox, YouTube, etc.) pour que les élèves puissent les consulter.
                        </p>

                        <div className="space-y-3 mb-3">
                            {formData.attachments.map((att, index) => (
                                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg group">
                                    <LinkIcon className="w-4 h-4 text-gray-400" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{att.title}</p>
                                        <p className="text-xs text-gray-500 truncate">{att.url}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(index)}
                                        className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                placeholder="Nom du document (ex: PDF Cours)"
                                value={newAttachment.title}
                                onChange={(e) => setNewAttachment({ ...newAttachment, title: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <input
                                type="url"
                                placeholder="Lien (https://...)"
                                value={newAttachment.url}
                                onChange={(e) => setNewAttachment({ ...newAttachment, url: e.target.value })}
                                className="flex-[2] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <button
                                type="button"
                                onClick={addAttachment}
                                disabled={!newAttachment.title || !newAttachment.url}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm whitespace-nowrap"
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contenu de la leçon
                        </label>
                        <textarea
                            name="content"
                            rows="6"
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                            placeholder="Texte du cours, instructions..."
                        />
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Durée (min)
                            </label>
                            <input
                                type="number"
                                name="duration_minutes"
                                value={formData.duration_minutes}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="45"
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Publier maintenant
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
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Enregistrer la leçon
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LessonFormModal;
